var title_name = "The Painted Pixel",
  title_base_color = "#f4f2f3",
  particle_colors = ["#c6f91f", "#f37a48", "#7692ff"],
  effect = 1;

var particles = [],
  frequency = 1,
  c1 = {},
  c2 = {},
  c3 = {},
  tela,
  canvas;

var btn = document.querySelector(".welcome_msg h3");
var body = document.querySelector("body");
setInterval(
  function () {
    populate();
  }.bind(this),
  frequency
);
drawCanvas();
update();
//fadeOut();

/* Event listeners */
function fadeOut() {
  setTimeout(function () {
    var c = document.querySelector("canvas");
    if (c) {
      c.style.opacity = 0;
      c.style.fontSize = "26px";
      body.style.backgroundColor = "#FFFFFF";
      faded = true;
    }
  }, 5000);
}

btn.addEventListener("click", function () {
  changeEffect();
});

window.addEventListener("resize", function () {
  //if ( !faded ){
  body.style.backgroundColor = "#000000";
  drawCanvas();
  //}
});

/* Functions */
function drawCanvas() {
  var dom_canvas = document.querySelector("canvas");
  if (dom_canvas) dom_canvas.remove();
  var ht = window.innerHeight;
  var wd = window.innerWidth;
  c1 = createCanvas({
    width: wd,
    height: ht
  });
  c2 = createCanvas({
    width: wd,
    height: ht
  });
  c3 = createCanvas({
    width: wd,
    height: ht
  });
  tela = c1.canvas;
  canvas = c1.context;
  body.appendChild(c3.canvas);
  writeText(c2.canvas, c2.context, title_name);
}

function changeEffect() {
  effect += 1;
  setTimeout(function () {
    effect += 1;
  }, 5000);
  setTimeout(function () {
    effect = 1;
    drawCanvas();
  }, 7000);
}
/* Codepen code ... with a few modifications */
var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value " in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Particle = (function () {
  function Particle(canvas, options) {
    _classCallCheck(this, Particle);
    var random = Math.random();
    this.canvas = canvas;
    this.x = options.x;
    this.y = options.y;
    this.s = 3 + Math.random();
    this.a = 0;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.radius = 0.5 + Math.random() * 20;
    this.color = this.randomColor();
  }
  _createClass(Particle, [{
      key: "randomColor",
      value: function randomColor() {
        var colors = particle_colors;
        return colors[this.randomIntFromInterval(0, colors.length - 1)];
      }
    },
    {
      key: "randomIntFromInterval",
      value: function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
    },
    {
      key: "render",
      value: function render() {
        this.canvas.beginPath();
        this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.canvas.lineWidth = 2;
        this.canvas.fillStyle = this.color;
        this.canvas.fill();
        this.canvas.closePath();
      }
    },
    {
      key: "move",
      value: function move() {
        this.x += Math.cos(this.a) * this.s;
        this.y += Math.sin(this.a) * this.s;
        this.a += Math.random() * 0.8 - 0.4;
        if (this.x < 0 || this.x > this.w - this.radius) {
          return false;
        }
        if (this.y < 0 || this.y > this.h - this.radius) {
          return false;
        }
        this.render();
        return true;
      }
    }
  ]);
  return Particle;
})();

function createCanvas(properties) {
  var canvas = document.createElement("canvas");
  canvas.width = properties.width;
  canvas.height = properties.height;
  var context = canvas.getContext("2d");
  return {
    canvas: canvas,
    context: context
  };
}

function writeText(canvas, context, text) {
  var size = 80;
  context.font = size + "px Rubik Mono One";
  context.fillStyle = title_base_color;
  context.textAlign = "center";
  context.transition = "all 2s ease-in-out";
  var lineheight = 80;
  var lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    context.fillText(
      lines[i],
      canvas.width / 2,
      canvas.height / 2 + lineheight * i - (lineheight * (lines.length - 1)) / 3
    );
  }
}

function maskCanvas() {
  c3.context.drawImage(c2.canvas, 0, 0, c2.canvas.width, c2.canvas.height);
  switch (effect) {
    case 1:
      c3.context.globalCompositeOperation = "source-atop";
      break;
    case 2:
      c3.context.globalCompositeOperation = "source-out";
      break;
    case 3:
      c3.context.globalCompositeOperation = "screen";
      break;
    default:
      c3.context.globalCompositeOperation = "source-atop";
  }
  c3.context.drawImage(c1.canvas, 0, 0);
  blur(c1.context, c1.canvas, 2);
}

function blur(ctx, canvas, amt) {
  ctx.filter = "blur(" + amt + "px)";
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = "none";
}

function populate() {
  particles.push(
    new Particle(canvas, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    })
  );
  return particles.length;
}

function clear() {
  canvas.globalAlpha = 0.03;
  canvas.fillStyle = title_base_color;
  canvas.fillRect(0, 0, tela.width, tela.height);
  canvas.globalAlpha = 1;
}

function update() {
  clear();
  particles = particles.filter(function (p) {
    return p.move();
  });
  maskCanvas();
  requestAnimationFrame(update.bind(this));
}