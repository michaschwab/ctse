var renderTimePerTimelineInMs = 0;
var mainThreadWaitTimeInMs = 5;
var mainThreadWaitSynchronous = true;

var canvasTimelinesBeforeAfter = 4;

var MODES = { MAIN_THREAD: 0, COMPOSITE: 100 };

var mode = MODES.COMPOSITE;

var timelineHeight = 110;
var timelineHeightBuffer = 10;
var numberTimelines = 100;
var canvasSizeComposite = window.innerHeight + 2 * canvasTimelinesBeforeAfter * timelineHeight;
var timelineWidth = 800;
var timelineBarWidth = 8;

// Set some elements and variables
var alldomz = document.getElementById('alldomz');
var canvas = document.getElementById('canvaz');
var ctx = canvas.getContext('2d');
var scale = 1;//window.devicePixelRatio; // Keep it simple for now

document.getElementById('canvasTrackRenderTimeIndicator').innerText = renderTimePerTimelineInMs;
document.getElementById('mainThreadWaitTimeIndicator').innerText = mainThreadWaitTimeInMs;
document.getElementById('canvasTimelinesBeforeAfterIndicator').innerText = canvasTimelinesBeforeAfter;

document.getElementById('canvasTrackRenderTimeSlider').value = renderTimePerTimelineInMs;
document.getElementById('mainThreadWaitTimeSlider').value = mainThreadWaitTimeInMs;
document.getElementById('canvasTimelinesBeforeAfterSlider').value = canvasTimelinesBeforeAfter;

var setCanvasSize = function()
{
  canvasSizeComposite = window.innerHeight + 2 * canvasTimelinesBeforeAfter * timelineHeight;
  canvasHeight = mode === MODES.MAIN_THREAD ? window.innerHeight * scale : canvasSizeComposite * scale;
  canvas.setAttribute('width', canvas.width * scale);
  canvas.setAttribute('height', canvasHeight.toString(10));
  canvas.style.width = canvas.width / scale + 'px';
  canvas.style.height = canvas.height / scale + 'px';
  ctx.scale(scale, scale);
};

// Add the DOM nodes
for(var i = 1; i <= numberTimelines; i++)
{
  var domEl = document.createElement('div');
  domEl.innerText = 'Dom ' + i;
  alldomz.appendChild(domEl);
}
document.getElementById('scroll').style.height = alldomz.offsetHeight + 'px';

var changeRenderMode = function()
{
  if(mode === MODES.MAIN_THREAD)
  {
    alldomz.style.position = 'fixed';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
  }
  else
  {
    alldomz.style.position = 'absolute';
    canvas.style.position = 'absolute';
    alldomz.style.top = 0;
  }
  setCanvasSize();
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

  for (var i = 0; i < data.length; i++)
  {
    const y = (i - startIndex) * timelineHeight - offset;
    drawTimeline(y, ctx, data[i]);
  }

  wait(renderTimePerTimelineInMs * Math.floor(canvasHeight / timelineHeight));
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
  var scrollTop = document.documentElement.scrollTop;

  if(mode === MODES.MAIN_THREAD)
  {
    // Load some data
    wait(renderTimePerTimelineInMs * canvasHeight / timelineHeight);

    // Adjust DOM position
    alldomz.style.top = '-' + scrollTop + 'px';
    renderCanvas(scrollTop, 0);
  }
  else
  {
    // Load some data
    wait(renderTimePerTimelineInMs * canvasHeight / timelineHeight);

    var numberOfScrolledTimelines = Math.floor(scrollTop / timelineHeight);
    var scrolledTimelinesHeight = numberOfScrolledTimelines * timelineHeight;

    renderCanvas(scrolledTimelinesHeight, numberOfScrolledTimelines - canvasTimelinesBeforeAfter);

    // Adjust canvas position
    canvas.style.top = scrolledTimelinesHeight - canvasTimelinesBeforeAfter * timelineHeight + 'px';
  }

  if(mainThreadWaitSynchronous)
  {
    wait(mainThreadWaitTimeInMs);

    requestAnimationFrame(raf);
  }
  else
  {
    window.setTimeout(raf, mainThreadWaitTimeInMs);
  }
};


var wait = function(ms)
{
  var start = Date.now();
  while(Date.now() - start < ms)
  {

  }
};

setCanvasSize();
var data = loadTimelines();
changeRenderMode();
requestAnimationFrame(raf);