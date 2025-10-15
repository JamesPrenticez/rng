export class SceneManager {
  currentScene: any;

  setScene(scene: any) {
    this.currentScene = scene;
  }

  update() {
    this.currentScene?.update();
  }

  draw() {
    this.currentScene?.draw();
  }
}
