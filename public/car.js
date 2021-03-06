class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.aceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.02;
    this.angle = 0;
    this.crashed = false;

    if (controlType != "DUMMY") {
      this.sensor = new Sensors(this);
    }
    this.controls = new Controls(controlType);
  }

  update(trackBorders, flow) {
    if (!this.crashed) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.crashed = this.#assesDamage(trackBorders, flow);
    }
    if (this.sensor) {
      this.sensor.update(trackBorders, flow);
    }
  }

  #assesDamage(trackBorders, flow) {
    for (let i = 0; i < trackBorders.length; i++) {
      if (polygonsIntersection(this.polygon, trackBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < flow.length; i++) {
      if (polygonsIntersection(this.polygon, flow[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const radio = Math.hypot(this.width, this.height) / 2;
    const theta = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - theta) * radio,
      y: this.y - Math.cos(this.angle - theta) * radio,
    });
    points.push({
      x: this.x - Math.sin(this.angle + theta) * radio,
      y: this.y - Math.cos(this.angle + theta) * radio,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - theta) * radio,
      y: this.y - Math.cos(Math.PI + this.angle - theta) * radio,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + theta) * radio,
      y: this.y - Math.cos(Math.PI + this.angle + theta) * radio,
    });
    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed = this.speed + this.aceleration;
    }
    if (this.controls.reverse) {
      this.speed = this.speed - this.aceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed = this.speed - this.friction;
    }
    if (this.speed < 0) {
      this.speed = this.speed + this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle = this.angle + 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle = this.angle - 0.03 * flip;
      }
    }

    this.x = this.x - Math.sin(this.angle) * this.speed;
    this.y = this.y - Math.cos(this.angle) * this.speed;
  }

  draw(context, color) {
    if (this.crashed) {
      context.fillStyle = "red";
    } else {
      context.fillStyle = color;
    }
    context.beginPath();
    context.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      context.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    context.fill();

    if (this.sensor) {
      this.sensor.draw(context);
    }
  }
}
