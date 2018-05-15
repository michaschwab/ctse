var loadTimePerTimelineInMs = 10;
var renderTimeInMs = 15;
var mainThreadWaitTimeInMs = 20;

var canvasSizeFactorComposite = 2;

var MODES = { MAIN_THREAD: 0, COMPOSITE: 100 };

var mode = MODES.COMPOSITE;

var timelineHeight = 110;
var numberTimelines = 100;
var canvasSizeComposite = canvasSizeFactorComposite * window.innerHeight;
var timelineWidth = 800;
var timelineBarWidth = 20;

var alldomz = document.getElementById('alldomz');
//<div class="domz">Dom 1</div>
for(var i = 1; i <= numberTimelines; i++)
{
  var domEl = document.createElement('div');
  domEl.innerText = 'Dom ' + i;
  alldomz.appendChild(domEl);
}
document.getElementsByClassName('rendering-indicator')[0].innerText = mode === MODES.COMPOSITE ? 'Composite' : 'Main Thread';
var canvas = document.getElementById('canvaz');
var canvasHeight = mode === MODES.MAIN_THREAD ? window.innerHeight : canvasSizeComposite;
canvas.setAttribute('height', canvasHeight.toString(10));
var ctx = canvas.getContext('2d');
var scale = window.devicePixelRatio;
//
canvas.style.width = canvas.width / scale + 'px';
canvas.style.height = canvas.height / scale + 'px';
ctx.scale(scale, scale);

var setup = function()
{
  if(mode === MODES.MAIN_THREAD)
  {
    document.getElementById('scroll').style.height = alldomz.offsetHeight + 'px';
    alldomz.style.position = 'fixed';
    canvas.style.position = 'fixed';
  }
};

var drawTimeline = function(y, ctx, data)
{
  for(var i = 0; i < data.length; i++)
  {
    ctx.fillRect(i * timelineBarWidth, y, timelineBarWidth, data[i]*100);
  }
};

var renderCanvas = function(scrollTop)
{
  ctx.clearRect(0, 0, 1000, canvasHeight);

  var offset = mode === MODES.MAIN_THREAD ? scrollTop : 0;

  for (var i = 0; i < data.length; i++) {
    const y = i * timelineHeight - offset;
    drawTimeline(y, ctx, data[i]);
  }

  wait(renderTimeInMs);
};

var loadTimelines = function()
{
  // In Main Thread mode, this function should always only load the data that is currently visible, or cache some of it.
  // In Composite mode, this function should return however many fit in the canvas.
  var data = [];

  for(var i = 0; i < numberTimelines; i++)
  {
    data.push(loadTimeline());
  }

  wait(loadTimePerTimelineInMs * numberTimelines);

  return data;
};

var loadTimeline = function()
{
  var data = [];
  for(var i = 0; i < timelineWidth / timelineBarWidth; i++)
  {
    data.push(Math.random());
  }

  return data;
};

var wait = function(ms)
{
  var start = Date.now();
  while(Date.now() - start < ms)
  {

  }
};


var data = loadTimelines();


var raf = function()
{
  wait(mainThreadWaitTimeInMs);

  var scrollTop = document.documentElement.scrollTop;

  if(mode === MODES.MAIN_THREAD)
  {
    alldomz.style.top = '-' + scrollTop + 'px';
    renderCanvas(scrollTop);
  }
  else
  {
    renderCanvas(scrollTop);
  }
  requestAnimationFrame(raf);
};

setup();
requestAnimationFrame(raf);