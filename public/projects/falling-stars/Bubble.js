class Bubble extends Particle {
    constructor(pos, diam, spd, rot) {
        super(pos, diam, spd, rot);
    }

//METHODS
 update() {
    //want my bubbles to fall & rotate more gently than stars or leaves
    let oldPos = this.pos.copy();//creates a new object that is a copy of the current position
    let oldRot = this.rot;

    super.update();//do everything parent does

    this.pos = oldPos;//overwrite the position with the old position so the parent's update doesn't change it
    this.rot = oldRot;

    //Now we implement a custom bubble movement
    this.bubbleMovement();
}

   bubbleMovement() {
    //want customized bubble movement
    //slowing gravity
    this.spd.y += this.gravity * 0.000005;

    //slowing movement dramatically
    this.pos.x += this.spd.x * 0.05432;
    this.pos.y += this.spd.y * 0.02439;

    //slowing rotation
    this.rot += this.rotSpd * .01;
    }

draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);
    stroke(255, this.getOpacity());
    strokeWeight(2);
    fill(194, 243, 255, this.getOpacity());
    ellipse(0, 0, this.diam, this.diam);
    push();
    noStroke();
    rotate(PI/4);
    fill(235, 251, 255, this.getOpacity()*.9);
    rect(-this.diam/4, -this.diam/6, this.diam/8, this.diam/15);//scaling my bubble sheen to stay withing bubble bounds
    pop();
    pop();  
}
}