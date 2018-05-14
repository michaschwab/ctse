
var alldomz = document.getElementById('alldomz');
var canvas = document.getElementById('canvaz');
var ctx = canvas.getContext('2d');
var scale = window.devicePixelRatio;
document.getElementById('match_height').style.height = alldomz.offsetHeight + 'px';
canvas.style.width = canvas.width / scale + 'px';
canvas.style.height = canvas.height / scale + 'px';
ctx.scale(scale, scale);

var raf = function() {
  ctx.clearRect(0, 0, 1000, 1000);
  var scrollTop = document.getElementById('scroll').scrollTop;
  for (var i = 0; i < 15; i++) {
    const y = i * 110 - scrollTop;
    ctx.strokeRect(0, y, 400, 100);
    ctx.fillText('Drawn on canvas', 10, y + 50);
  }
  alldomz.style.top = '-' + scrollTop + 'px';
  requestAnimationFrame(raf);
};

requestAnimationFrame(raf);