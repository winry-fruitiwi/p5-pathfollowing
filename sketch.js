/*
@author Winry
@date 2022-01-14

Coding plan:
    implement seek

 */
let font
let vehicle, target, path

function preload() {
    font = loadFont('data/meiryo.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)

    vehicle = new Vehicle(10, 10)
    path = new Path(0, height/2, width, height/2)
}

function draw() {    
    background(234, 34, 24)

    // create a new target, which we don't need for path following.
    // noStroke()
    // target = new p5.Vector(mouseX, mouseY)
    // fill(120, 80, 90)
    // circle(target.x, target.y, 32)

    // render and update the vehicle.
    vehicle.show()
    vehicle.update()
    // vehicle.seek(target)
    vehicle.edges()
    vehicle.applyForce(vehicle.follow(path))

    // render path

    // path.end.y = mouseY
    path.show()
}

function findProjection(pos, a, b) {
    let v1 = p5.Vector.sub(a, pos)
    let v2 = p5.Vector.sub(b, pos)
    v2.normalize()
    let sp = v1.dot(v2)
    v2.mult(sp).add(pos)
    return v2
}


class Vehicle {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y)
        this.vel = new p5.Vector(3, 3)
        this.acc = new p5.Vector(0, 0)
        this.r = 10
        this.maxSpeed = 2
        this.maxForce = 0.03

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
        this.vel.add(this.acc).limit(this.maxSpeed)
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

    edges() {
        // right side
        if (this.pos.x > width) {
            this.pos.x = 0
        }

        // left side
        if (this.pos.x < 0) {
            this.pos.x = width
        }

        // top side
        if (this.pos.y > height) {
            this.pos.y = 0
        }

        // bottom side
        if (this.pos.y < 0) {
            this.pos.y = height
        }
    }

    // the path following algorithm!
    follow(path) {
        // Step 1:  Predict future position of vehicle
        let future = this.vel.copy()
        future.mult(20)
        future.add(this.pos)
        noStroke()
        fill(0, 80, 80)
        // circle(future.x, future.y, 16)

        // Step 2:  Is future on path?
        let target = findProjection(
            path.start,
            future,
            path.end
        )
        fill(120, 80, 80)
        noStroke()
        // circle(target.x, target.y, 16)

        let d = p5.Vector.dist(future, target)
        if (d > path.radius) {
            return this.seek(target)
        } else {
            return createVector(0, 0)
        }
    }
}


class Path {
    constructor(x1, y1, x2, y2) {
        this.start = createVector(x1, y1)
        this.end = createVector(x2, y2)

        // basically a road's radius. The vehicle is given a bit of slack if it
        // doesn't follow the path exactly, but still needs to be within radius.
        this.radius = 20
    }

    show() {
        stroke(0, 0, 100)
        strokeWeight(2)
        line(this.start.x, this.start.y, this.end.x, this.end.y)

        stroke(0, 0, 100, 20)
        strokeWeight(this.radius * 2)
        line(this.start.x, this.start.y, this.end.x, this.end.y)
    }
}
