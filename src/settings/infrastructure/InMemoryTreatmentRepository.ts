import { Treatment } from '@settings/domain/Treatment';

/**
 * ADAPTER — InMemoryTreatmentRepository
 * Configurable dental treatment catalog with prices.
 */

const CATALOG: Treatment[] = [
  // Diagnóstico
  Treatment.create('t-01', { name: 'Consulta inicial',        category: 'Diagnóstico',  price: 500,   duration: 30,  active: true }),
  Treatment.create('t-02', { name: 'Consulta de seguimiento', category: 'Diagnóstico',  price: 300,   duration: 20,  active: true }),
  Treatment.create('t-03', { name: 'Radiografía periapical',  category: 'Diagnóstico',  price: 200,   duration: 10,  active: true }),
  Treatment.create('t-04', { name: 'Panorámica digital',      category: 'Diagnóstico',  price: 650,   duration: 15,  active: true }),
  // Preventivo
  Treatment.create('t-05', { name: 'Profilaxis dental',       category: 'Preventivo',   price: 700,   duration: 45,  active: true }),
  Treatment.create('t-06', { name: 'Aplicación de fluoruro',  category: 'Preventivo',   price: 250,   duration: 15,  active: true }),
  Treatment.create('t-07', { name: 'Sellador de fisuras',     category: 'Preventivo',   price: 350,   duration: 20,  active: true, description: 'Por pieza' }),
  // Restauradora
  Treatment.create('t-08', { name: 'Resina compuesta',        category: 'Restauradora', price: 1200,  duration: 60,  active: true, description: 'Por cara/superficie' }),
  Treatment.create('t-09', { name: 'Amalgama',                category: 'Restauradora', price: 800,   duration: 45,  active: true }),
  Treatment.create('t-10', { name: 'Incrustación cerámica',   category: 'Restauradora', price: 5500,  duration: 90,  active: true }),
  // Endodoncia
  Treatment.create('t-11', { name: 'Endodoncia unirradicular', category: 'Endodoncia', price: 3500,  duration: 90,  active: true }),
  Treatment.create('t-12', { name: 'Endodoncia multirradicular',category: 'Endodoncia', price: 5000,  duration: 120, active: true }),
  Treatment.create('t-13', { name: 'Retratamiento endodóntico',category: 'Endodoncia', price: 4500,  duration: 120, active: true }),
  // Periodoncia
  Treatment.create('t-14', { name: 'Raspado y alisado radicular', category: 'Periodoncia', price: 2500, duration: 90, active: true, description: 'Por cuadrante' }),
  Treatment.create('t-15', { name: 'Cirugía periodontal',     category: 'Periodoncia', price: 6000,  duration: 120, active: true }),
  // Cirugía
  Treatment.create('t-16', { name: 'Extracción simple',       category: 'Cirugía',     price: 800,   duration: 30,  active: true }),
  Treatment.create('t-17', { name: 'Extracción quirúrgica',   category: 'Cirugía',     price: 2200,  duration: 60,  active: true }),
  Treatment.create('t-18', { name: 'Extracción muela del juicio', category: 'Cirugía', price: 3500,  duration: 60,  active: true }),
  // Estética
  Treatment.create('t-19', { name: 'Blanqueamiento dental',   category: 'Estética',    price: 3500,  duration: 90,  active: true }),
  Treatment.create('t-20', { name: 'Carilla de porcelana',    category: 'Estética',    price: 8000,  duration: 120, active: true, description: 'Por diente' }),
  // Ortodoncia
  Treatment.create('t-21', { name: 'Ortodoncia metálica',     category: 'Ortodoncia',  price: 25000, duration: 60,  active: true, description: 'Tratamiento completo' }),
  Treatment.create('t-22', { name: 'Ortodoncia estética',     category: 'Ortodoncia',  price: 32000, duration: 60,  active: true }),
  Treatment.create('t-23', { name: 'Alineadores transparentes', category: 'Ortodoncia', price: 45000, duration: 45, active: true }),
  // Prótesis
  Treatment.create('t-24', { name: 'Corona metal-cerámica',   category: 'Prótesis',    price: 6500,  duration: 60,  active: true }),
  Treatment.create('t-25', { name: 'Corona zirconia',         category: 'Prótesis',    price: 9000,  duration: 60,  active: true }),
  Treatment.create('t-26', { name: 'Prótesis total',          category: 'Prótesis',    price: 15000, duration: 90,  active: true }),
];

export class InMemoryTreatmentRepository {
  private catalog: Treatment[] = [...CATALOG];

  async findAll(): Promise<Treatment[]> {
    return this.catalog;
  }

  async findByCategory(category: string): Promise<Treatment[]> {
    return this.catalog.filter((t) => t.category === category);
  }

  async findById(id: string): Promise<Treatment | null> {
    return this.catalog.find((t) => t.id === id) ?? null;
  }

  async update(id: string, price: number): Promise<void> {
    const item = this.catalog.find((t) => t.id === id);
    if (item) item.updatePrice(price);
  }

  async save(treatment: Treatment): Promise<void> {
    this.catalog.push(treatment);
  }
}

export const treatmentRepository = new InMemoryTreatmentRepository();
