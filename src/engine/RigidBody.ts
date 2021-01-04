import GameObject from "./GameObject";
import { distanceBetweenPoints } from "../services/Utils";
import CanvasWrapper from "./CanvasWrapper";
import Vector2 from "./Vector2";

export default class RigidBody extends GameObject {
  nearbyObjectsThreshold: number;
  force: Vector2;
  mass: number;
  minSpeed: number;
  maxSpeed: number;
  collisionRadius: number;
  constructor(position: Vector2, size: number, color = { r: 255, g: 0, b: 0 }) {
    super(position, size, color);
    this.nearbyObjectsThreshold = 256;
    this.force = new Vector2();
    this.mass = 1;
    this.minSpeed = 0;
    this.maxSpeed = 10;
    this.collisionRadius = this.radius;
  }

  // GETTERS
  get speed() {
    return Math.abs(this.vector.x) + Math.abs(this.vector.y);
  }

  // METHODS
  public getNearbyBodies(
    position: Vector2,
    rigidBodies: RigidBody[],
    limit: number
  ) {
    return rigidBodies.filter(body => {
      const distance = distanceBetweenPoints(position, body.position);
      return distance < limit && body !== this;
    });
  }
  public collisionDetection(source: RigidBody, bodies: RigidBody[]) {
    return bodies.filter(body => {
      return distanceBetweenPoints(source.position, body.position) <
        source.collisionRadius + body.collisionRadius
        ? true
        : false;
    });
  }
  public drawDebug(context: CanvasRenderingContext2D) {
    // object center
    context.beginPath();
    context.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI);
    context.strokeStyle = "rgb(250, 0, 0)";
    context.stroke();

    // vector
    context.strokeStyle = "white";
    context.lineCap = "round";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(
      this.position.x + this.vector.x * 500,
      this.position.y + this.vector.y * 500
    );
    context.stroke();

    // size
    context.lineWidth = 1;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.strokeStyle = "white";
    context.stroke();

    // collision radius
    context.lineWidth = 1;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.collisionRadius,
      0,
      2 * Math.PI
    );
    context.strokeStyle = "red";
    context.stroke();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected collisionInteraction(target: RigidBody) {
    return true;
  }
  protected collideMass(a: RigidBody, b: RigidBody) {
    // skip physics calc if either of the objects doesn't want to
    if (!a.collisionInteraction(b) || !b.collisionInteraction(a)) {
      return;
    }

    const m1 = a.mass;
    const m2 = b.mass;
    const x = a.position.x - b.position.x;
    const y = a.position.y - b.position.y;
    const d = Math.pow(x, 2) + Math.pow(y, 2);

    const u1 = (a.vector.x * x + a.vector.y * y) / d;
    const u2 = (x * a.vector.y - y * a.vector.x) / d;
    const u3 = (b.vector.x * x + b.vector.y * y) / d;
    const u4 = (x * b.vector.y - y * b.vector.x) / d;

    const mm = m1 + m2;
    const vu3 = ((m1 - m2) / mm) * u1 + ((2 * m2) / mm) * u3;
    const vu1 = ((m2 - m1) / mm) * u3 + ((2 * m1) / mm) * u1;

    // resolve overlap
    const distance = Math.sqrt(
      (a.position.x - b.position.x) * (a.position.x - b.position.x) +
        (a.position.y - b.position.y) * (a.position.y - b.position.y)
    );
    const overlap = 0.5 * (distance - a.radius - b.radius);

    a.position.x -= (overlap * (a.position.x - b.position.x)) / distance;
    a.position.y -= (overlap * (a.position.y - b.position.y)) / distance;

    b.position.x += (overlap * (a.position.x - b.position.x)) / distance;
    b.position.y += (overlap * (a.position.y - b.position.y)) / distance;

    // set new vectors
    b.vector.x = x * vu1 - y * u4;
    b.vector.y = y * vu1 + x * u4;
    // b.vector = {
    //   x: x * vu1 - y * u4,
    //   y: y * vu1 + x * u4
    // };
    // a.vector = {
    //   x: x * vu3 - y * u2,
    //   y: y * vu3 + x * u2
    // };
    a.vector.x = x * vu3 - y * u2;
    a.vector.y = y * vu3 + x * u2;

    const newX = a.position.x - b.position.x;
    const newY = a.position.y - b.position.y;
    // const newd = Math.pow(newX, 2) + Math.pow(newY, 2);
    const dist = Math.sqrt(Math.pow(newX, 2) + Math.pow(newY, 2));

    if (dist < a.radius + b.radius) {
      console.log("invalid collision!");
      console.log(
        "dist after collision:",
        dist,
        "should be over:",
        a.radius + b.radius
      );
    }
  }
  protected handleCollision(rigidBodies: RigidBody[]) {
    // collision detection, only if we are moving
    if (Math.abs(this.vector.x) > 0 || Math.abs(this.vector.y) > 0) {
      const nearby = this.getNearbyBodies(
        this.position,
        rigidBodies,
        this.nearbyObjectsThreshold
      );
      if (nearby.length > 0) {
        const hits = this.collisionDetection(this, nearby);
        if (hits.length > 0) {
          hits.forEach(h => this.collideMass(this, h));
        }
      }
    }
  }
  protected updateTransform(dt: number) {
    this.vector.x += this.force.x;
    this.vector.y += this.force.y;

    // if we are not accelerating and speed is below min, stop
    if (
      this.force.x === 0 &&
      this.force.y === 0 &&
      Math.abs(this.vector.x) < this.minSpeed &&
      Math.abs(this.vector.y) < this.minSpeed
    ) {
      this.vector.x = 0;
      this.vector.y = 0;
    }

    // limit max speed
    if (this.speed > this.maxSpeed) {
      const overSpeed = this.speed - this.maxSpeed;
      this.vector.x *= (1 - overSpeed) / 2;
      this.vector.y *= (1 - overSpeed) / 2;
    }

    this.rotation += this.torque * dt;
    this.position.x += this.vector.x * dt;
    this.position.y += this.vector.y * dt;

    this.force.x = 0;
    this.force.y = 0;
  }
  public update(dt: number, canvas: CanvasWrapper) {
    if (this.isMoving)
      this.handleCollision(
        this.objectStore.store.filter(
          go => go instanceof RigidBody
        ) as RigidBody[]
      );
    this.handleInput(canvas);
    this.updateTransform(dt);
  }
}
