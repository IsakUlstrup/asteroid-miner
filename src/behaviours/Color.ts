import EngineColor from "@/engine/Color";

export default function Color<TBase extends Constructor>(Base: TBase) {
  return class Color extends Base {
    color = new EngineColor();
  };
}
