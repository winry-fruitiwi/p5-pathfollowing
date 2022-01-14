/*
@author Winry
@date 2022-01-14

Coding plan:
    implement seek

 */
let font
let vehicle, target

function preload() {
    font = loadFont('data/meiryo.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)

    vehicle = new Vehicle(width/2, height/2)
}

function draw() {    
    background(234, 34, 24)

    noStroke()
    target = new p5.Vector(mouseX, mouseY)
    fill(120, 80, 90)
    circle(target.x, target.y, 32)

    vehicle.show()
    vehicle.update()
    vehicle.seek(target)
    // vehicle.applyForce(new p5.Vector(0, 0.1))
}


class Vehicle {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y)
        this.vel = new p5.Vector()
        this.acc = new p5.Vector(0, 0)
        this.r = 20
        this.maxSpeed = 4
        this.maxForce = 0.08
    }

    // one of the steering behaviors for autonomous characters in Craig
    // Reynolds' paper. The vehicle will seek the target passed into it.
    seek(target) {
        let force = p5.Vector.sub(target, this.pos)
        force.setMag(this.maxSpeed)
        force.sub(this.vel)
        force.limit(this.maxForce)
        this.applyForce(force)
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.pos.add(this.vel)
        this.vel.add(this.acc)
        this.acc.mult(0) // the same as setting acc to zero
    }

    show() {
        noStroke()
        fill(0, 0, 100)

        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.vel.heading())
        triangle(
            -this.r/2, this.r/2,
            this.r, 0,
            -this.r/2, -this.r/2
        )
        pop()
    }
}
