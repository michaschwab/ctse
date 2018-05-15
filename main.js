var loadTimePerTimelineInMs = 10;
var renderTimeInMs = 15;
var mainThreadWaitTimeInMs = 2000;

var canvasTimelinesBeforeAfter = 5;

var MODES = { MAIN_THREAD: 0, COMPOSITE: 100 };

var mode = MODES.COMPOSITE;

var timelineHeight = 110;
var timelineHeightBuffer = 10;
var numberTimelines = 100;
var canvasSizeComposite = window.innerHeight + 2 * canvasTimelinesBeforeAfter * timelineHeight;
var timelineWidth = 800;
var timelineBarWidth = 8;

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
  else
  {

  }
};

var drawTimeline = function(y, ctx, data)
{
  for(var i = 0; i < data.length; i++)
  {
    ctx.fillRect(i * timelineBarWidth, y, timelineBarWidth, data[i]);
  }
};

var renderCanvas = function(scrollTop, startIndex)
{
  ctx.clearRect(0, 0, 1000, canvasHeight);
  ctx.fillStyle = 'green';

  var offset = mode === MODES.MAIN_THREAD ? scrollTop : 0;

  for (var i = startIndex; i < data.length; i++) {
    if(i >= 0)
    {
      if(i === 0)
      {
        //console.log(data[i]);
      }
      const y = (i - startIndex) * timelineHeight - offset;
      drawTimeline(y, ctx, data[i]);
    }

  }

  wait(renderTimeInMs);
};

var loadTimelines = function()
{
  var data = [];

  for(var i = 0; i < numberTimelines; i++)
  {
    data.push(loadTimeline(i));
  }

  return data;
};

var loadTimeline = function(number)
{
  var data = [];
  for(var i = 0; i < timelineWidth / timelineBarWidth; i++)
  {
    i <= number ? data.push(timelineHeight - i - timelineHeightBuffer) : data.push(timelineHeight - timelineHeightBuffer);
  }

  return data;
};


var raf = function()
{
  //wait(mainThreadWaitTimeInMs);

  var scrollTop = document.documentElement.scrollTop;

  if(mode === MODES.MAIN_THREAD)
  {
    // Load some data
    wait(loadTimePerTimelineInMs * canvasHeight / timelineHeight);

    alldomz.style.top = '-' + scrollTop + 'px';
    renderCanvas(scrollTop, 0);
  }
  else
  {
    // Load some data
    //wait(loadTimePerTimelineInMs * numberTimelines);
    wait(loadTimePerTimelineInMs * canvasHeight / timelineHeight);

    var numberOfScrolledTimelines = Math.floor(scrollTop / timelineHeight);
    var scrolledTimelinesHeight = numberOfScrolledTimelines * timelineHeight;

    renderCanvas(scrolledTimelinesHeight, numberOfScrolledTimelines - canvasTimelinesBeforeAfter);

    // Adjust position
    canvas.style.top = scrolledTimelinesHeight - canvasTimelinesBeforeAfter * timelineHeight + 'px';
  }

  window.setTimeout(raf, mainThreadWaitTimeInMs);
  //requestAnimationFrame(raf);
};


var wait = function(ms)
{
  var start = Date.now();
  while(Date.now() - start < ms)
  {

  }
};

var data = loadTimelines();
setup();
requestAnimationFrame(raf);
