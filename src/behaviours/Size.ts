export default function Size<TBase extends Constructor>(Base: TBase) {
  return class Size extends Base {
    size = 0;

    get radius() {
      return this.size / 2;
    }
  };
}
