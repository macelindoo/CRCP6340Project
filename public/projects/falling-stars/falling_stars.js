//This project is a mishmash of inspirations from the following:
//https://www.youtube.com/watch?v=UcdigVaIYAk
//https://www.youtube.com/watch?v=wDYD3JVtOys
//https://p5js.org/examples/math-and-physics-forces/

//let particles = [];
let emitter;//calling my emitter object


function setup() {
    createCanvas(600, 600);

    // // Particle(pos, diam, spd, rot) {
    // for(let i = 0; i < 100; i++) {
    //     let pos = createVector(random(width), random(height));
    //     let diam = random(5, 20);
    //     let spd = createVector(random(-2, 2), random(-2, 2));
    //     let rot = random(TWO_PI);

        //particles[i] = new Particle(pos, diam, spd, rot); 
        //particles[i] = new Star(pos, diam, spd, rot);
        //particles[i] = new Leaf(pos, diam, spd, rot); 
        //particles[i] = new Bubble(pos, diam, spd, rot);    
    // }

    emitter = new Emitter(createVector(width/2, 0));
}
function draw() {
    //Make emitter follow the mouse
    emitter.pos.x = mouseX;
    emitter.pos.y = mouseY;

    //background(0);
    //Want to add a semi-transparent background for trail effect
    //Stars background (top third)
    push();
    fill(2, 1, 48, 90);
    rect(0, 0, width, height/3);
    pop();
    //Leaves background (middle third)
    push();
    fill(89, 194, 255, 10);
    rect(0, height/3, width, height/3);
    pop();
    //Bubbles background (bottom third)
    push();
    fill(81, 116, 232, 60);
    rect(0, height * 2/3, width, height/3);
    pop();

    // //Emit new particles occasionally (every 30 frames = 0.5 seconds)
    // if (frameCount % 20 === 0) {
    //     emitter.emit();
    // }

    //Update and draw emitter
    emitter.update();
    emitter.draw();

}

//Mouse interaction - emit particles when mouse is pressed
function mousePressed() {
    emitter.emit();
}

//Keyboard interaction - spacebar clears the frame
function keyPressed() {
    if (key === ' ') {
        //Clear all particles
        emitter.particles = [];
        //Also clear the canvas to remove trails
        clear();
    }
}
