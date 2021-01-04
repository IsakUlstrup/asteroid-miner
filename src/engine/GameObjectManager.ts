import GameObject from "./GameObject";
import CanvasWrapper from "./CanvasWrapper";
import config from "../config";
import { distanceBetweenPoints } from "../services/Utils";
import ObjectStore from "./GameObjectStore";
import ShipPlayer from "@/classes/ShipPlayer";
import Vector2 from "./Vector2";

export default class GameObjectManager {
  private canvas: CanvasWrapper;
  // public gameObjects: GameObject[] = [];
  public objectStore: ObjectStore;
  public parallaxObjects: GameObject[] = [];
  private parallaxAmount: number;
  private playerShip: ShipPlayer;
  constructor(context: CanvasRenderingContext2D, playerShip: ShipPlayer) {
    // this.cameraPosition = playerShip.transform;
    this.playerShip = playerShip;
    this.canvas = new CanvasWrapper(context);
    // 0 background, 1 foreground
    this.parallaxAmount = 0.5;
    this.objectStore = new ObjectStore();
  }

  public update(dt: number) {
    // set zoom based off of ship speed
    if (config.autoZoom && this.playerShip.speed > 0) {
      const zoom = 0.1 / (this.playerShip.speed * 0.8) + 0.1;
      this.canvas.setAbsoluteZoom(zoom);
    }

    this.updateObjects.forEach(object => {
      object.update(dt, this.canvas);
    });
  }
  public draw() {
    // reset context
    this.canvas.context.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas.context.clearRect(
      0,
      0,
      this.canvas.context.canvas.width,
      this.canvas.context.canvas.height
    );
    // zoom
    this.canvas.context.scale(this.canvas.cameraZoom, this.canvas.cameraZoom);

    // camera position for parallax objects
    this.canvas.context.translate(
      this.canvas.context.canvas.width / 2 / this.canvas.cameraZoom -
        this.playerShip.position.x * this.parallaxAmount,
      this.canvas.context.canvas.height / 2 / this.canvas.cameraZoom -
        this.playerShip.position.y * this.parallaxAmount
    );

    // parallax objects
    this.onScreenParallaxObjects.forEach(object => {
      object.draw(this.canvas.context);
    });

    // camera position for normal objects
    this.canvas.context.translate(
      -(this.playerShip.position.x * (1 - this.parallaxAmount)),
      -(this.playerShip.position.y * (1 - this.parallaxAmount))
    );

    // draw gameObjects
    this.onScreenObjects.forEach(object => {
      object.draw(this.canvas.context);
    });

    if (config.debug) {
      // onscreen object statistics
      console.log(
        "onscreen objects:",
        this.onScreenObjects.length,
        "/",
        this.objectStore.store.length,
        "\nUpdated objects:",
        this.updateObjects.length,
        "/",
        this.objectStore.store.length
      );

      // draw distance
      const context = this.canvas.context;
      context.beginPath();
      context.arc(
        this.playerShip.position.x,
        this.playerShip.position.y,
        this.drawDistance,
        0,
        2 * Math.PI
      );
      context.strokeStyle = "rgb(250, 0, 0)";
      context.stroke();

      // parallax draw distance
      context.beginPath();
      context.arc(
        this.playerShip.position.x,
        this.playerShip.position.y,
        this.drawDistance * (1 / (1 - this.parallaxAmount)),
        0,
        2 * Math.PI
      );
      context.strokeStyle = "rgb(250, 0, 0)";
      context.stroke();
    }
  }
  public addGameObject(object: GameObject) {
    // this.gameObjects.push(object);
    this.objectStore.add(object);
  }
  public addParallaxObject(object: GameObject) {
    this.parallaxObjects.push(object);
  }
  public removeGameObject(object: GameObject) {
    // const index = this.gameObjects.indexOf(object);
    // if (index) this.gameObjects.splice(index, 1);
    this.objectStore.remove(object);
  }
  get drawDistance() {
    const center = new Vector2(
      this.canvas.context.canvas.width / 2,
      this.canvas.context.canvas.height / 2
    );

    return (
      distanceBetweenPoints(new Vector2(0, 0), center) *
      config.drawDistanceModifier *
      (1 / this.canvas.cameraZoom)
    );
  }
  get parallaxDrawDistance() {
    const center = new Vector2(
      this.canvas.context.canvas.width / 2,
      this.canvas.context.canvas.height / 2
    );

    return (
      distanceBetweenPoints(new Vector2(0, 0), center) *
      config.drawDistanceModifier *
      (1 / this.canvas.cameraZoom) *
      (1 / (1 - this.parallaxAmount))
    );
  }
  get onScreenParallaxObjects() {
    return this.parallaxObjects.filter(o => {
      if (
        distanceBetweenPoints(this.playerShip.position, o.position) <
        this.parallaxDrawDistance + o.radius
      ) {
        return o;
      }
    });
  }
  get onScreenObjects() {
    return this.updateObjects.filter(o => {
      if (
        distanceBetweenPoints(this.playerShip.position, o.position) <
        this.drawDistance + o.radius
      ) {
        return o;
      }
    });
  }
  get updateObjects() {
    return this.objects.filter(o => {
      if (
        distanceBetweenPoints(this.playerShip.position, o.position) <
        config.updateDistance * (1 / this.canvas.cameraZoom)
      ) {
        return o;
      }
    });
  }
  get objects() {
    return this.objectStore.store;
  }
}
