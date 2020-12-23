import GameObject from "./GameObject";

let _store: GameObject[] = [];

export default class GameObjectStore {
  add(object: GameObject) {
    _store.push(object);
  }
  remove(object: GameObject) {
    _store = _store.filter(o => o !== object);
  }

  get store() {
    return _store;
  }
}
