const canvas = document.getElementById("canvas");
canvas.windth = 200;

const context = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50);
car.draw(context);

motion();

function motion() {
  car.update();
  canvas.height = window.innerHeight;
  car.draw(context);
  requestAnimationFrame(motion);
}
