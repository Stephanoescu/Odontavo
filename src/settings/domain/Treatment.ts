import { Entity } from '@shared/domain/Entity';

/**
 * ENTITY — Treatment (Catalog item)
 * Represents a configurable dental treatment with its price.
 */
export type TreatmentCategory =
  | 'Diagnóstico'
  | 'Preventivo'
  | 'Endodoncia'
  | 'Periodoncia'
  | 'Cirugía'
  | 'Restauradora'
  | 'Estética'
  | 'Ortodoncia'
  | 'Prótesis'
  | 'Otros';

export interface TreatmentProps {
  name: string;
  category: TreatmentCategory;
  price: number;
  duration: number; // minutes
  description?: string;
  active: boolean;
}

export class Treatment extends Entity<string> {
  private props: TreatmentProps;

  private constructor(id: string, props: TreatmentProps) {
    super(id);
    this.props = { ...props };
  }

  static create(id: string, props: TreatmentProps): Treatment {
    return new Treatment(id, props);
  }

  get name()        { return this.props.name; }
  get category()    { return this.props.category; }
  get price()       { return this.props.price; }
  get duration()    { return this.props.duration; }
  get description() { return this.props.description; }
  get active()      { return this.props.active; }

  updatePrice(newPrice: number): void {
    this.props.price = newPrice;
  }

  toPlain() {
    return {
      id:          this._id,
      name:        this.props.name,
      category:    this.props.category,
      price:       this.props.price,
      duration:    this.props.duration,
      description: this.props.description,
      active:      this.props.active,
    };
  }
}
