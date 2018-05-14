var loadTimeInMs = 50;
var renderTimeInMs = 10;

var timelineHeight = 110;
var numberTimelines = 15;
var timelineWidth = 800;
var timelineBarWidth = 20;

var alldomz = document.getElementById('alldomz');
var canvas = document.getElementById('canvaz');
var ctx = canvas.getContext('2d');
var scale = window.devicePixelRatio;
document.getElementById('match_height').style.height = alldomz.offsetHeight + 'px';
canvas.style.width = canvas.width / scale + 'px';
canvas.style.height = canvas.height / scale + 'px';
ctx.scale(scale, scale);

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
  ctx.clearRect(0, 0, 1000, 1000);

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
  var scrollTop = document.getElementById('scroll').scrollTop;

  renderCanvas(scrollTop);

  alldomz.style.top = '-' + scrollTop + 'px';
  requestAnimationFrame(raf);
};

requestAnimationFrame(raf);