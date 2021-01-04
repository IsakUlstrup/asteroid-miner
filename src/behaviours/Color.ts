import EngineColor from "@/engine/Color";

export default function Color<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    color = new EngineColor();
  };
}
