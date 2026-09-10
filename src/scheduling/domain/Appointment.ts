import { Entity } from '@shared/domain/Entity';
import { AppointmentStatus } from './AppointmentStatus';

export interface AppointmentProps {
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  time: string;
  type: string;
  status: AppointmentStatus;
}

export class Appointment extends Entity<string> {
  private props: AppointmentProps;

  private constructor(id: string, props: AppointmentProps) {
    super(id);
    this.props = { ...props };
  }

  static create(id: string, props: AppointmentProps): Appointment {
    return new Appointment(id, props);
  }

  get patientId()   { return this.props.patientId; }
  get patientName() { return this.props.patientName; }
  get dentistId()   { return this.props.dentistId; }
  get dentistName() { return this.props.dentistName; }
  get date()        { return this.props.date; }
  get time()        { return this.props.time; }
  get type()        { return this.props.type; }
  get status()      { return this.props.status; }

  toPlain() {
    return {
      id: this._id,
      patientId:   this.props.patientId,
      patientName: this.props.patientName,
      dentistId:   this.props.dentistId,
      dentistName: this.props.dentistName,
      date:        this.props.date,
      time:        this.props.time,
      type:        this.props.type,
      status:      this.props.status.toPlain(),
    };
  }
}
