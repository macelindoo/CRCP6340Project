class Leaf extends Particle {
    //Leaf will need a position
    //Leaf will need a speed
    //Leaf will need a rotation
    //Leaf will need a size

    //Want my color property of the leaves to not be easily changed
    colorsOptions = [
        color(34, 139, 34),// Green
        color(165, 42, 42),// Red
        color(255, 215, 0),// Gold  
        color(139, 69, 19),// Brown
    ];//creating an array of color options for the leaves

    constructor(pos, diam, spd, rot) {
        super(pos, diam, spd, rot);
        this.leafRatio = random(.3, .6);//random ratio for leaf width (keeps leaves tall and skinny)
        this.color = random(this.colorsOptions);//randomly select a color from the colorsOptions array
    }

    update() {
    //want my leaves to fall & rotate more gently than stars
    let oldPos = this.pos.copy();//creates a new object that is a copy of the current position
    let oldRot = this.rot;

    super.update();//do everything parent does

    this.pos = oldPos;//overwrite the position with the old position so the parent's update doesn't change it
    this.rot = oldRot;

    //Now we implement a custom leaf movement
    this.leafMovement();
}

   leafMovement() {
    //slowing gravity by 1/4
    this.spd.y += this.gravity * 0.25;
    
    //slowing movement by 1/4
    this.pos.x += this.spd.x * 0.25;
    this.pos.y += this.spd.y * 0.25;
    
    //slowing rotation by by 5%
    this.rot += this.rotSpd * .05;
    }

    draw() {
        //I want leaves that are taller than they are wide
        let opacity = this.getOpacity();
        fill(this.color, opacity);//my colors paired with opacity from Particle.getOpacity()
        noStroke();
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rot);
        ellipse(0, 0, this.diam * this.leafRatio, this.diam);//Creates tall, skinny leaves (width < height)
        pop();
    }
}