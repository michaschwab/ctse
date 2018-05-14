var loadTimeInMs = 50;
var renderTimeInMs = 10;

var MODES = { MAIN_THREAD: 0, COMPOSITE: 100 };

var mode = MODES.COMPOSITE;

var timelineHeight = 110;
var numberTimelines = 15;
var timelineWidth = 800;
var timelineBarWidth = 20;

var alldomz = document.getElementById('alldomz');
var canvas = document.getElementById('canvaz');
var canvasHeight = mode === MODES.MAIN_THREAD ? window.innerHeight : timelineHeight * numberTimelines;
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
  //ctx.strokeRect(0, y, timelineWidth, 100);
  //ctx.fillText('Drawn on canvas', 10, y + timelineHeight / 2 - 5);
  for(var i = 0; i < data.length; i++)
  {
    ctx.fillRect(i * timelineBarWidth, y, timelineBarWidth, data[i]*100);
  }
};

var renderCanvas = function(scrollTop)
{
  ctx.clearRect(0, 0, 1000, canvasHeight);

  for (var i = 0; i < data.length; i++) {
    const y = i * timelineHeight - scrollTop;
    drawTimeline(y, ctx, data[i]);
  }

  wait(renderTimeInMs);
};

var loadTimelines = function()
{
  var data = [];

  for(var i = 0; i < numberTimelines; i++)
  {
    data.push(loadTimeline());
  }

  wait(loadTimeInMs);

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
  //console.log(document.documentElement.scrollTop);
  var scrollTop = document.documentElement.scrollTop;//document.getElementById('scroll').scrollTop;



  if(mode === MODES.MAIN_THREAD)
  {
    alldomz.style.top = '-' + scrollTop + 'px';
    renderCanvas(scrollTop);
  }
  else
  {
    renderCanvas(0);
  }
  requestAnimationFrame(raf);
};

setup();
requestAnimationFrame(raf);

/*
window.addEventListener('scroll', function()
{
  console.log('scroll');
})*/
