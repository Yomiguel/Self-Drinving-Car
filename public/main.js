const canvas = document.getElementById("canvas");
canvas.width = 200;

const context = canvas.getContext("2d");
const track = new Track(canvas.width / 2, canvas.width * 0.95);
const car = new Car(track.getLaneCenter(1), 100, 30, 50);

motion();

function motion() {
  car.update();

  canvas.height = window.innerHeight;

  context.save();
  context.translate(0, -car.y + canvas.height * 0.75);

  track.draw(context);
  car.draw(context);

  context.restore();
  requestAnimationFrame(motion);
}
