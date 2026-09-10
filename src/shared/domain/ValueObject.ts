/**
 * Base class for Value Objects.
 * A Value Object has no identity — it is defined entirely by its properties.
 * It is always immutable.
 */
export abstract class ValueObject<TProps extends object> {
  protected readonly props: Readonly<TProps>;

  constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  equals(other: ValueObject<TProps>): boolean {
    if (!(other instanceof ValueObject)) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  toPlain(): TProps {
    return { ...this.props };
  }
}
