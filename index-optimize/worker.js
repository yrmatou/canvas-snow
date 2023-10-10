"use strict";
var windowHeight = 1920;
var windowWidth = 931;
var centerX = windowWidth / 2;
var centerY = windowHeight / 2;
var PI2 = Math.PI * 2;
//canvas
var canvas = null;
var ctx = null;
function setUpCanvas() {
  canvas.width = windowWidth;
  canvas.height = windowHeight;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fill();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  //加算
  add(x, y) {
    if (x instanceof Vector) {
      this.x += x.x;
      this.y += x.y;
      return this;
    } else {
      this.x += x;
      this.y += y;
      return this;
    }
  }
  static add(vectorA, vectorB) {
    var x = vectorA.x + vectorB.x;
    var y = vectorA.y + vectorB.y;
    return new Vector(x, y);
  }
  //減算
  sub(x, y) {
    if (x instanceof Vector) {
      this.x -= x.x;
      this.y -= x.y;
      return this;
    } else {
      this.x -= x;
      this.y -= y;
      return this;
    }
  }
  static sub(vectorA, vectorB) {
    var x = vectorA.x - vectorB.x;
    var y = vectorA.y - vectorB.y;
    return new Vector(x, y);
  }
  // ベクトル乗算
  mult(n) {
    this.x = this.x * n;
    this.y = this.y * n;
    return this;
  }
  //ベクトル除算
  div(n) {
    this.x = this.x / n;
    this.y = this.y / n;
    return this;
  }
  //ベクトルの大きさを返す
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  //正規化する
  normalize() {
    var size = this.mag();
    if (size === 0) {
      return;
    }
    this.x = this.x * (1 / size);
    this.y = this.y * (1 / size);
    return this;
  }
  //最大値
  limit(max) {
    if (this.mag() > max) {
      return this.normalize().mult(max);
    } else {
      return this;
    }
  }
  //ベクトルの角度を返す
  static angle(vectorA) {
    var theta = Math.atan2(vectorA.y, vectorA.x);
    return theta;
  }
  //長さ１のランダムな値を返す
  static random2D() {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    return this.normalize();
  }
  //角度から長さ１のベクトルを返す
  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }
  //同じ値をもったVectorを返す
  static copy(vectorA) {
    return new Vector(vectorA.x, vectorA.y);
  }
  //ベクトル内積
  static dot(vectorA, vectorB) {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  }
  //ベクトル間の角度を返す
  static angleBetween(vectorA, vectorB) {
    var theta = Math.acos(
      this.dot(vectorA, vectorB) / (vectorA.mag() * vectorB.mag())
    );
    return theta;
  }
}

class LinkedList {
  constructor() {
    //長さ
    this.length = 0;
    //ポインタの位置
    this.index = 0;
    //データ
    this.data = [];
  }
  //挿入されたものを追加
  push(elm) {
    this.data.push(elm);
    this.length++;
  }
  //今の要素を返す
  current() {
    return this.data[this.index];
  }
  //次があるか？
  hasNext() {
    if (this.index < this.length) {
      return true;
    } else {
      return false;
    }
  }
  //次の要素を返す
  next() {
    if (!this.hasNext()) {
      return false;
    } else {
      this.index++;
      return this.data[this.index];
    }
  }
  //ポインタを先頭に戻す
  rewind() {
    this.index = 0;
  }
  //最初の要素を返す
  first() {
    return this.data[0];
  }
  //最後の要素を返す
  last() {
    return this.data[this.length];
  }
}

class Vehicle {
  constructor(x, y) {
    var xpos = x || Math.random() * windowWidth;
    var ypos = y || Math.random() * windowHeight;
    this.vlocation = new Vector(xpos, ypos);
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.radius = Math.random() * 10 + 2;
    this.separateRange = this.radius * 4;
    this.fillColor = "rgb(182,194,206)";
    this.maxForce = 0.2;
    this.maxSpeed = 3;
  }
  separate(vehicles) {
    var sum = new Vector(0, 0);
    var count = 0;
    for (var i = 0; i < vehicles.length; i++) {
      var diff = Vector.sub(this.vlocation, vehicles.data[i].vlocation);
      var distance = diff.mag();
      if (distance < this.separateRange && distance > 0) {
        diff.normalize().mult(15).div(distance);
        sum.add(diff);
        count++;
      }
    }
    if (count > 0) {
      var steer = sum.sub(this.velocity);
      this.acceleration.add(steer);
    }
  }
  updateState() {
    this.velocity.add(this.acceleration);
    this.vlocation.add(this.velocity);
    this.acceleration.mult(0);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.vlocation.x, this.vlocation.y, this.radius, 0, PI2, true);
    ctx.closePath();
    ctx.fillStyle = this.fillColor;
    ctx.fill();
  }
}

//vehicles
var vehicles = new LinkedList();
var vehiclesLength = 400;

var isMousePressed = false;

var frameCount = 0;

function loop() {
  if (frameCount < 240) {
    for (var i = 0; i < vehiclesLength / 240; i++) {
      var v = new Vehicle();
      vehicles.push(v);
    }
  }
  frameCount++;
  clearCanvas();
  vehicles.rewind();
  while (vehicles.hasNext()) {
    vehicles.current().separate(vehicles);
    vehicles.current().updateState();
    vehicles.current().draw();
    vehicles.next();
  }
  requestAnimationFrame(loop);
}
self.onmessage = (e) => {
  const { windowHeight: height, windowWidth: width, offscreen } = e.data || {};
  windowWidth = width;
  windowHeight = height;
  canvas = offscreen;
  ctx = canvas.getContext("2d");
  setUpCanvas();
  canvas.addEventListener("mousedown", function (e) {
    isMousePressed = true;
  });

  canvas.addEventListener("mouseup", function () {
    isMousePressed = false;
  });
  canvas.addEventListener("mousemove", function (e) {
    if (isMousePressed) {
      var x = e.clientX;
      var y = e.clientY;
      var v = new Vehicle(x, y);
      vehicles.push(v);
    }
  });
  loop();
};
