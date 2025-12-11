class Particle {
    //I want to build a particle that will
    //be able to morph into different shapes
    //I want the particle to spin, grow, and possibly fade
    //as it ages

    //I think I'll need a Particle super class and three shape subclasses
    //The particle class will house all the movement properties about what
    //a particle does
    //The shape subclasses will house the properties of the shapes

    //A particle is born, it moves, it spins & grows, and it dies (or fades)

    //Mutable PROPERTIES
    pos = createVector(0, 0);
    diam = 0;
    spd = createVector(0, 0);
    rot = 0;
    
    //Immutable PROPERTIES
    growthRate = 0;
    rotSpd = 0;
    age = 0;
    maxAge = 0;
    gravity = 0;

    //adding further PROPERTIES based on new methods I want to add
    //shapeType will be called via the javascript string or "" method
    shapeType = ""; //"star", "leaf", or "bubble"

    

    constructor(pos, diam, spd, rot) {

        this.pos = pos;
        this.diam = diam;
        this.spd = spd;
        this.rot = rot;
        
        this.growthRate = random(.1, .5);
        this.rotSpd = random(-2, 2);
        this.age = 0;
        this.maxAge = random(180, 600);//frame count is 60fps, so 3 seconds is 180 frames
        this.gravity = random(.1, .25);
       

        //want to add a shapeType property that will be set based on the zoneType
        //don't want people to be able to change it
        this.shapeType = this.getZoneType(); // "star", "leaf", or "bubble"
        //shapeType will be set based on the zoneType
    }

    //METHODS
    update() {
        this.pos.x += this.spd.x;
        this.pos.y += this.spd.y;
        this.spd.y += this.gravity;
        this.rot += this.rotSpd;
        this.diam += this.growthRate;
        this.age += 1;
        if (this.age > this.maxAge) {//this section marks my particle as dead so my emitter can remove it
            this.diam = 0;
            this.age = 0;
        }
        
        // this.shapeType = this.getZoneType();//update shapeType based on zoneType
    }

    getOpacity() {
        //map(value, start1, stop1, start2, stop2)
        let opacity = map(this.age, 0, this.maxAge, 255, 0);
        return opacity;

    }

    shapeType() {
        //want particles to morph and want particle class to track and adjust shapeType
        //In Particle.draw()
        if (this.shapeType === "star") {
            //draw star
        } else if (this.shapeType === "leaf") {
            //draw leaf  
        } else if (this.shapeType === "bubble") {
            //draw bubble
        }
    }

    getZoneType() {
    //zones will be divided into thirds based on the height or y of the canvas
    //top third will be stars, middle third will be leaves, bottom third will be bubbles
    //want to keep this in the particle class since particle class also contains shapeType
    if (this.pos.y < height/3) {
        return "star";
    } else if (this.pos.y < 2*height/3) {
        return "leaf";
    } else {
        return "bubble";
    }
}
    

    draw() {
        fill(255, this.getOpacity());
        stroke(255, this.getOpacity());
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, this.diam, this.diam);
    }

}