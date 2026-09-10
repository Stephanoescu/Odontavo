import { Entity } from '@shared/domain/Entity';

/**
 * ENTITY — Transaction
 * Represents a financial transaction (payment, charge, budget) in the clinic.
 */
export type TransactionType = 'ingreso' | 'gasto' | 'presupuesto';
export type TransactionStatus = 'pagado' | 'pendiente' | 'cancelado';

export interface TransactionProps {
  patientId: string | null;
  patientName: string;
  concept: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  method?: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  notes?: string;
}

export class Transaction extends Entity<string> {
  private readonly props: TransactionProps;

  private constructor(id: string, props: TransactionProps) {
    super(id);
    this.props = { ...props };
  }

  static create(id: string, props: TransactionProps): Transaction {
    return new Transaction(id, props);
  }

  get patientId()   { return this.props.patientId; }
  get patientName() { return this.props.patientName; }
  get concept()     { return this.props.concept; }
  get amount()      { return this.props.amount; }
  get type()        { return this.props.type; }
  get status()      { return this.props.status; }
  get date()        { return this.props.date; }
  get method()      { return this.props.method; }
  get notes()       { return this.props.notes; }

  toPlain() {
    return {
      id:          this._id,
      patientId:   this.props.patientId,
      patientName: this.props.patientName,
      concept:     this.props.concept,
      amount:      this.props.amount,
      type:        this.props.type,
      status:      this.props.status,
      date:        this.props.date,
      method:      this.props.method,
      notes:       this.props.notes,
    };
  }
}
