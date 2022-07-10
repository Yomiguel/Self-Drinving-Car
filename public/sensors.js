class Sensors {
  constructor(car) {
    this.car = car;
    this.rayCount = 6;
    this.rayLength = 200;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(trackBorders, flow) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], trackBorders, flow));
    }
  }

  #getReading(ray, trackBorders, flow) {
    let touches = [];

    for (let i = 0; i < trackBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        trackBorders[i][0],
        trackBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < flow.length; i++) {
      const pol = flow[i].polygon;
      for (let j = 0; j < pol.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          pol[j],
          pol[(j + 1) % pol.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((element) => element.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((element) => element.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        linearInterpolation(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(context) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "yellow";
      context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      context.lineTo(end.x, end.y);
      context.stroke();

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
  }
}
