import { v4 } from "uuid";

export default function Id<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id = v4();
  };
}
