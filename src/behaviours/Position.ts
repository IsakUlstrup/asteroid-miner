import Vector2 from "@/engine/Vector2";

export default function Position<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    position = new Vector2();
    rotation = 0;
  };
}
