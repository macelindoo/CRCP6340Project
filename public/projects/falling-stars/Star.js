class Star extends Particle {
    //star will need an inner radius and an outer radius
    //star will need a diam
    //star will need a number of points
    //star will need a position
    //start will need a speed
    //star will need a rotation

    //DO NOT NEED TO REDECLARE PROPERTIES FROM PARTICLE (it breaks the code, cause it breaks the inheritance chain)

    //Immutable PROPERTIES
    numPoints;//I think I might want this to be immutable or at least default to 5 unless you dig into the code 
    
    constructor(pos, diam, spd, rot) {
        super(pos, diam, spd, rot);

        this.numPoints = 5;//default to 5 points for a star
    }

    //METHODS
    //will need translate to allow for correct positioning of stars
    //will need rotate to allow for correct rotation of stars
    //will need beginShape and endShape to draw the star
    //will need vertex to draw the points of the star
    //will need to calculate the inner and outer radius based on the diam and numPoints
    draw() {
        let opacity = this.getOpacity();
        fill(255, 215, 0, opacity);//Gold color with opacity from Particle.getOpacity()
        noStroke();
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rot);
        beginShape();
        let theta = TWO_PI/this.numPoints;//increments of angle for each inner point
        let angle = 0;//increments the angle of each outer point
        let innerRadius = this.diam/2 * 0.5;//inner radius is half of the outer radius
        let outerRadius = this.diam/2;//dividing by 2 because radius is half of diameter
        for (let i = 0; i < this.numPoints; i++) {
            angle = theta * i;//increments angle of each outer point
            let x = cos(angle) * outerRadius;
            let y = sin(angle) * outerRadius;
            vertex(x, y);
            angle += theta / 2;
            x = cos(angle) * innerRadius;
            y = sin(angle) * innerRadius;
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }
}