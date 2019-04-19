class Particle {
  constructor(x, y, theta, speed, color) {
    this.x = x;
    this.y = y;
    this.theta = theta;
    this.speed = speed;
    this.color = color;
    this.dx = this.speed * cos(this.theta);
    this.dy = this.speed * sin(this.theta);
  }

  advance() {
    this.x += this.dx;
    this.y += this.dy;
  }

  bounce(X, Y) {
    if (this.x <= 0 || this.x >= X) {
      this.dx = -this.dx;
    }
    if (this.y <=0 || this.y >= Y)  {
      this.dy = -this.dy;
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(color(this.color));
    ellipse(0, 0, 5, 5);
    pop();
  }
}
