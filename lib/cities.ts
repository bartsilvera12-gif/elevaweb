export interface Dept {
  name: string;
  cities: string[];
}

export const depts: Dept[] = [
  { name: "Central", cities: ["Asunción", "Fernando de la Mora", "Lambaré", "Luque", "Mariano Roque Alonso", "San Lorenzo", "Ñemby", "Villa Elisa", "Capiatá", "Itauguá", "Limpio", "Areguá"] },
  { name: "Alto Paraná", cities: ["Ciudad del Este", "Presidente Franco", "Hernandarias", "Minga Guazú", "Santa Rita"] },
  { name: "Itapúa", cities: ["Encarnación", "Hohenau", "Bella Vista", "Obligado", "Cambyretá"] },
  { name: "Cordillera", cities: ["Caacupé", "Piribebuy", "Tobatí", "Eusebio Ayala", "Atyrá"] },
  { name: "Guairá", cities: ["Villarrica", "Coronel Martínez", "Independencia"] },
  { name: "Caaguazú", cities: ["Coronel Oviedo", "Caaguazú", "Dr. Juan E. Estigarribia"] },
  { name: "Paraguarí", cities: ["Paraguarí", "Yaguarón", "Pirayú"] },
  { name: "Concepción", cities: ["Concepción", "Horqueta"] },
  { name: "San Pedro", cities: ["San Pedro", "Santaní"] },
  { name: "Amambay", cities: ["Pedro Juan Caballero"] },
  { name: "Canindeyú", cities: ["Salto del Guairá", "Curuguaty"] },
  { name: "Misiones", cities: ["San Juan Bautista", "Ayolas", "Santa María"] },
  { name: "Ñeembucú", cities: ["Pilar"] },
  { name: "Presidente Hayes", cities: ["Villa Hayes", "Benjamín Aceval"] },
  { name: "Boquerón", cities: ["Filadelfia", "Loma Plata", "Neuland"] },
  { name: "Alto Paraguay", cities: ["Fuerte Olimpo"] },
  { name: "Caazapá", cities: ["Caazapá", "San Juan Nepomuceno"] },
];
