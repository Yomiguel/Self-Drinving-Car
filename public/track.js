class Track {
  constructor(x, width, laneCount = 4) {
    this.x = x;
    this.width = width;
    this.lanes = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bot = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const botLeft = { x: this.left, y: this.bot };
    const botRight = { x: this.right, y: this.bot };
    this.borders = [
      [topLeft, botLeft],
      [topRight, botRight],
    ];
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.lanes;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.lanes - 1) * laneWidth
    );
  }

  draw(context) {
    context.lineWidth = 5;
    context.strokeStyles = "white";

    for (let i = 1; i <= this.lanes - 1; i++) {
      const x = linearInterpolation(this.left, this.right, i / this.lanes);

      context.setLineDash([20, 20]);
      context.beginPath();
      context.moveTo(x, this.top);
      context.lineTo(x, this.bot);
      context.stroke();
    }

    context.setLineDash([]);
    this.borders.forEach((border) => {
      context.beginPath();
      context.moveTo(border[0].x, border[0].y);
      context.lineTo(border[1].x, border[1].y);
      context.stroke();
    });
  }
}
