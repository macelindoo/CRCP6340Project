class Emitter {
    pos;

    constructor(pos){
        this.pos = pos;
        this.particles = [];
    }
//METHODS
update() {
    //Track & update particles based on zoneType and if they are dead
    for (let i = this.particles.length-1; i >= 0; i--) {//essential to remove particles from array to not slow down program
        this.particles[i].update();
        let currentZone;//creates a variable to hold the current zone type
        currentZone = this.particles[i].getZoneType();//sets the current zone type to the particle's zone type so it's tracked in real time
        if (this.particles[i].diam <= 0) {//if the particle is dead
            this.particles.splice(i, 1);//remove the particle
            //splice(position, howManyToRemove)//I'm removing 1 item at position i
        }
        //if the particle's zone type is not the same as the current zone type
        if (currentZone !== this.particles[i].shapeType) {
            this.morphParticle(i, currentZone);
        }
    }
}

//need to pass in which particle in array needs to morph, and the type
//it should be based on zone
morphParticle(index, currentZone) {//I really built this program the wrong way, but I'm in too deep now.
    //Since I created a separate class for each shape, I need to create a new particle of the correct type
    //and copy over the properties from the old particle to the new one.
    
    //Get the old particle to copy properties from
    //create a variable to hold the old particle
    //and set it to the particle at the index passed in
    let oldParticle = this.particles[index];
    
    //Copy essential particle properties (for all shapes)
    let pos = oldParticle.pos.copy();//Since this is a vector object, I  need to create a new object that is a copy of the current position
    let diam = oldParticle.diam;//don't need to copy b/c this isn't a vector, I can just set it to the old particle's diameter
    let spd = oldParticle.spd.copy();//creates a new object that is a copy of the current speed
    let rot = oldParticle.rot;//again, here I can just set it to the old particle's rotation
    
    //Create new particle of correct type
    let newParticle;
    if (currentZone === "star") {//checks the current zone type
        newParticle = new Star(pos, diam, spd, rot);//create new star particle
    } else if (currentZone === "leaf") {
        newParticle = new Leaf(pos, diam, spd, rot);
    } else if (currentZone === "bubble") {
        newParticle = new Bubble(pos, diam, spd, rot);
    }
    
    //Copy over aging and growth properties to maintain continuity
    newParticle.age = oldParticle.age;
    newParticle.maxAge = oldParticle.maxAge;
    newParticle.growthRate = oldParticle.growthRate;
    newParticle.shapeType = currentZone;

    //Replace old particle with new one
    this.particles[index] = newParticle;
}

//Method to determine what zone the emitter is currently in
getEmitterZone() {
    if (this.pos.y < height / 3) {
        return "star";  // Top third = star zone
    } else if (this.pos.y < height * 2/3) {
        return "leaf";  // Middle third = leaf zone
    } else {
        return "bubble"; // Bottom third = bubble zone
    }
}

emit() {
    //How my particles will be born:
    //I want the particles to have some horizontal spread to look interesting
    //I want the particles to shoot upwards and then fall down
    let pos = createVector(this.pos.x + random(-300, 300), this.pos.y);//y keeps emitter's y pos
    let spd = createVector(random(-1, 1), random(-3, -1)); //horizontal spread, upward trajectory to start
    let diam = random(5, 20);
    let rot = random(TWO_PI);
    
    //Determine what type of particle to create based on emitter's current zone
    let emitterZone = this.getEmitterZone();
    let particle;

    //Checks for emitter's current zone with string type match ("")
    if (emitterZone === "star") {
        particle = new Star(pos, diam, spd, rot);
    } else if (emitterZone === "leaf") {
        particle = new Leaf(pos, diam, spd, rot);
    } else if (emitterZone === "bubble") {
        particle = new Bubble(pos, diam, spd, rot);
    }
    
    this.particles.push(particle);//add the particle to the this.particles array using javascript's built in push method
}

draw() {
    for(let i=0; i < this.particles.length; i++) {
        this.particles[i].draw();
    }

}
}