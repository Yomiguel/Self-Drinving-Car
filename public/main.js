const canvas = document.getElementById("canvas");
canvas.width = 200;

const context = canvas.getContext("2d");
const track = new Track(canvas.width / 2, canvas.width * 0.95);
const car = new Car(track.getLaneCenter(1), 100, 30, 50, "MAIN");
const flow = [new Car(track.getLaneCenter(1), -100, 30, 50, "DUMMY",2)];

motion();

function motion() {
  for (let i = 0; i < flow.length; i++) {
    flow[i].update(track.borders, []);
  }
  car.update(track.borders, flow);

  canvas.height = window.innerHeight;

  context.save();
  context.translate(0, -car.y + canvas.height * 0.75);

  track.draw(context);
  for (let i = 0; i < flow.length; i++) {
    flow[i].draw(context, "orange");
  }
  car.draw(context, "blue");

  context.restore();
  requestAnimationFrame(motion);
}
