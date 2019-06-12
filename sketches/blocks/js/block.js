function Block(orgn, phi, l, clr) {
  this.orgn = orgn;
  this.phi = phi;
  this.theta = 0;
  this.l = l;
  this.clr = clr;
  this.squished = false;
  this.t = -1;
  this.g = -4;
  this.v = 0;
  this.y = 0;
  this.jumping = false;

  let max_theta = 10;
  let dep_rate = 1;
  let max_v = 40;

  this.draw = function(p) {
    p.push();
    // p.colorMode(HSB);
    p.fill(clr);
    p.translate(this.orgn.x, this.orgn.y - this.y);
    let a = p.radians(this.phi - this.theta);
    let x = this.l * p.cos(a);
    let y = this.l * p.sin(a);
    p.rect(-x/2, -y, x, y);
    p.pop();

    this.update(p);
  }

  this.update = function(p) {
    if (this.squished) {
      this.theta += (this.theta >= max_theta ? 0 : dep_rate);
    } else if (this.t >= 0 && this.t < 20) {
      this.theta = - max_theta * p.cos(p.radians(this.t)) / (1 + this.t);
      this.t += dep_rate;
    } else {
      this.t = -1;
    }
    if (this.jumping) {
      this.v += this.g;
      this.y += this.v;
      if (this.y < 0) {
        this.y = 0;
        this.jumping = false;
        console.log("landed!")
        this.theta = max_theta;
        this.t = 0;
      }
    }
  }

  this.press = function() {
    this.squished = true;
  }

  this.release = function() {
    this.squished = false;
    this.t = 0;
    this.v = max_v;
    this.jumping = true;
    console.log("jump!");
  }
}
