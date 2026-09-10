import { Entity } from '@shared/domain/Entity';

/**
 * ENTITY — OdontogramEntry
 * Represents a clinical finding/treatment for a specific FDI tooth number.
 */
export type ToothQuadrant = 1 | 2 | 3 | 4;

export interface OdontogramEntryProps {
  patientId: string;
  toothNumber: string;     // FDI notation: '11' to '48'
  surface?: string;        // Mesial, Distal, Oclusal, Vestibular, Palatino/Lingual
  diagnosis: string;
  treatment: string;
  notes?: string;
  date: string;
  dentistId: string;
}

export class OdontogramEntry extends Entity<string> {
  private readonly props: OdontogramEntryProps;

  private constructor(id: string, props: OdontogramEntryProps) {
    super(id);
    this.props = { ...props };
  }

  static create(id: string, props: OdontogramEntryProps): OdontogramEntry {
    return new OdontogramEntry(id, props);
  }

  get patientId()   { return this.props.patientId; }
  get toothNumber() { return this.props.toothNumber; }
  get surface()     { return this.props.surface; }
  get diagnosis()   { return this.props.diagnosis; }
  get treatment()   { return this.props.treatment; }
  get notes()       { return this.props.notes; }
  get date()        { return this.props.date; }
  get dentistId()   { return this.props.dentistId; }

  toPlain() {
    return {
      id: this._id,
      patientId:   this.props.patientId,
      toothNumber: this.props.toothNumber,
      surface:     this.props.surface,
      diagnosis:   this.props.diagnosis,
      treatment:   this.props.treatment,
      notes:       this.props.notes,
      date:        this.props.date,
      dentistId:   this.props.dentistId,
    };
  }
}

/** FDI tooth map: quadrant → tooth numbers */
export const FDI_TEETH: Record<string, string[]> = {
  'Sup. Derecho (1)':   ['18','17','16','15','14','13','12','11'],
  'Sup. Izquierdo (2)': ['21','22','23','24','25','26','27','28'],
  'Inf. Izquierdo (3)': ['31','32','33','34','35','36','37','38'],
  'Inf. Derecho (4)':   ['41','42','43','44','45','46','47','48'],
};

export const ALL_FDI_TEETH: string[] = Object.values(FDI_TEETH).flat();
