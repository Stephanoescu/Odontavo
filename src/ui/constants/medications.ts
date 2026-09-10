export interface MedicationOption {
  name: string;
  commonDoses: string[];
  category: string;
}

export const MEDICATIONS_DB: MedicationOption[] = [
  { name: 'Ibuprofeno',                       commonDoses: ['200mg','400mg','600mg','800mg'],      category: 'Analgésico / AINE' },
  { name: 'Paracetamol',                      commonDoses: ['500mg','1g'],                          category: 'Analgésico' },
  { name: 'Ketorolaco',                       commonDoses: ['10mg','30mg'],                         category: 'Analgésico / AINE' },
  { name: 'Naproxeno',                        commonDoses: ['250mg','500mg','550mg'],               category: 'Analgésico / AINE' },
  { name: 'Diclofenaco',                      commonDoses: ['25mg','50mg','75mg'],                  category: 'Analgésico / AINE' },
  { name: 'Metamizol',                        commonDoses: ['500mg','1g','2g'],                     category: 'Analgésico' },
  { name: 'Amoxicilina',                      commonDoses: ['250mg','500mg','875mg'],               category: 'Antibiótico' },
  { name: 'Amoxicilina + Ácido Clavulánico',  commonDoses: ['500/125mg','875/125mg'],              category: 'Antibiótico' },
  { name: 'Clindamicina',                     commonDoses: ['150mg','300mg','600mg'],               category: 'Antibiótico' },
  { name: 'Metronidazol',                     commonDoses: ['250mg','500mg'],                       category: 'Antibiótico' },
  { name: 'Azitromicina',                     commonDoses: ['250mg','500mg'],                       category: 'Antibiótico' },
  { name: 'Doxiciclina',                      commonDoses: ['100mg'],                              category: 'Antibiótico' },
  { name: 'Cefalexina',                       commonDoses: ['250mg','500mg','1g'],                  category: 'Antibiótico' },
  { name: 'Dexametasona',                     commonDoses: ['0.5mg','1mg','4mg','8mg'],             category: 'Corticosteroide' },
  { name: 'Prednisona',                       commonDoses: ['5mg','10mg','20mg','50mg'],            category: 'Corticosteroide' },
  { name: 'Clorhexidina 0.12%',              commonDoses: ['Enjuague bucal 15ml'],                category: 'Antiséptico Tópico' },
  { name: 'Clorhexidina 0.2%',               commonDoses: ['Enjuague bucal 10ml'],                category: 'Antiséptico Tópico' },
  { name: 'Omeprazol',                        commonDoses: ['20mg','40mg'],                         category: 'Protector Gástrico' },
  { name: 'Tramadol',                         commonDoses: ['50mg','100mg'],                        category: 'Analgésico Opioide' },
];

export const FREQUENCIES = [
  'Cada 4 horas', 'Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas',
  'Una vez al día', 'Dos veces al día', 'Tres veces al día',
  'Según el dolor', 'Antes de dormir',
];

export const DURATIONS = [
  '1 día', '2 días', '3 días', '5 días', '7 días',
  '10 días', '14 días', '1 mes', 'Hasta nueva indicación',
];
