// Sistema de generación de mandalas terapéuticos para colorear

export interface MandalaDesign {
  id: string;
  name: string;
  description: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  theme: 'Naturaleza' | 'Geométrico' | 'Espiritual' | 'Floral' | 'Abstracto';
  benefits: string[];
}

export const mandalaDesigns: MandalaDesign[] = [
  {
    id: 'lotus-peace',
    name: 'Loto de la Paz',
    description: 'Mandala centrado en la flor de loto, símbolo de tranquilidad y renacimiento',
    difficulty: 'Fácil',
    theme: 'Espiritual',
    benefits: ['Reduce ansiedad', 'Promueve calma', 'Mejora concentración']
  },
  {
    id: 'geometric-harmony',
    name: 'Armonía Geométrica',
    description: 'Patrones geométricos simétricos que inducen estado meditativo',
    difficulty: 'Intermedio',
    theme: 'Geométrico',
    benefits: ['Mejora foco', 'Reduce estrés', 'Estimula creatividad']
  },
  {
    id: 'flower-garden',
    name: 'Jardín Florido',
    description: 'Diseño floral con pétalos y hojas para conectar con la naturaleza',
    difficulty: 'Fácil',
    theme: 'Floral',
    benefits: ['Conecta con naturaleza', 'Mejora estado ánimo', 'Relaja mente']
  },
  {
    id: 'sacred-geometry',
    name: 'Geometría Sagrada',
    description: 'Patrones basados en proporciones áureas y formas sagradas',
    difficulty: 'Avanzado',
    theme: 'Espiritual',
    benefits: ['Profundiza meditación', 'Desarrolla paciencia', 'Equilibra energía']
  },
  {
    id: 'ocean-waves',
    name: 'Ondas del Océano',
    description: 'Patrones fluidos inspirados en las olas del mar',
    difficulty: 'Intermedio',
    theme: 'Naturaleza',
    benefits: ['Calma ansiedad', 'Mejora respiración', 'Induce relajación']
  },
  {
    id: 'sun-rays',
    name: 'Rayos Solares',
    description: 'Mandala radiante que simboliza energía positiva y vitalidad',
    difficulty: 'Fácil',
    theme: 'Naturaleza',
    benefits: ['Aumenta energía', 'Mejora confianza', 'Eleva ánimo']
  },
  {
    id: 'butterfly-transformation',
    name: 'Transformación Mariposa',
    description: 'Alas de mariposa entrelazadas simbolizando cambio personal',
    difficulty: 'Intermedio',
    theme: 'Naturaleza',
    benefits: ['Abraza cambio', 'Desarrolla resiliencia', 'Inspira crecimiento']
  },
  {
    id: 'crystal-formation',
    name: 'Formación Cristalina',
    description: 'Estructuras cristalinas complejas para meditación profunda',
    difficulty: 'Avanzado',
    theme: 'Geométrico',
    benefits: ['Clarifica mente', 'Mejora concentración', 'Equilibra chakras']
  },
  {
    id: 'tree-of-life',
    name: 'Árbol de la Vida',
    description: 'Árbol sagrado con raíces y ramas entrelazadas',
    difficulty: 'Intermedio',
    theme: 'Espiritual',
    benefits: ['Conecta con propósito', 'Fortalece raíces', 'Inspira crecimiento']
  },
  {
    id: 'mandala-hearts',
    name: 'Corazones Entrelazados',
    description: 'Patrones de corazones para cultivar amor propio y compasión',
    difficulty: 'Fácil',
    theme: 'Espiritual',
    benefits: ['Cultiva amor propio', 'Desarrolla compasión', 'Sana corazón']
  },
  {
    id: 'spiral-galaxy',
    name: 'Espiral Galáctica',
    description: 'Espirales cósmicas que conectan con el universo infinito',
    difficulty: 'Avanzado',
    theme: 'Abstracto',
    benefits: ['Expande consciencia', 'Conecta con universo', 'Desarrolla perspectiva']
  },
  {
    id: 'feather-circle',
    name: 'Círculo de Plumas',
    description: 'Plumas delicadas formando un círculo de protección',
    difficulty: 'Intermedio',
    theme: 'Naturaleza',
    benefits: ['Siente protección', 'Desarrolla intuición', 'Conecta con guías']
  },
  {
    id: 'mandala-eyes',
    name: 'Ojos del Alma',
    description: 'Patrones oculares que representan visión interior y sabiduría',
    difficulty: 'Avanzado',
    theme: 'Espiritual',
    benefits: ['Desarrolla intuición', 'Mejora autoconocimiento', 'Clarifica visión']
  },
  {
    id: 'rose-window',
    name: 'Rosetón de Catedral',
    description: 'Inspirado en los rosetones de catedrales góticas',
    difficulty: 'Avanzado',
    theme: 'Geométrico',
    benefits: ['Inspira devoción', 'Eleva espíritu', 'Cultiva paciencia']
  },
  {
    id: 'water-lily',
    name: 'Nenúfar Flotante',
    description: 'Nenúfar sereno flotando en aguas tranquilas',
    difficulty: 'Fácil',
    theme: 'Floral',
    benefits: ['Promueve serenidad', 'Calma emociones', 'Induce paz']
  },
  {
    id: 'mandala-stars',
    name: 'Constelación Estelar',
    description: 'Estrellas y constelaciones formando patrones celestiales',
    difficulty: 'Intermedio',
    theme: 'Abstracto',
    benefits: ['Inspira sueños', 'Conecta con destino', 'Eleva aspiraciones']
  },
  {
    id: 'celtic-knot',
    name: 'Nudo Celta Sagrado',
    description: 'Nudos celtas entrelazados simbolizando eternidad',
    difficulty: 'Avanzado',
    theme: 'Espiritual',
    benefits: ['Representa eternidad', 'Conecta con ancestros', 'Desarrolla continuidad']
  },
  {
    id: 'mandala-leaves',
    name: 'Hojas de Otoño',
    description: 'Hojas de diferentes formas creando patrones naturales',
    difficulty: 'Fácil',
    theme: 'Naturaleza',
    benefits: ['Abraza cambios', 'Conecta con ciclos', 'Encuentra belleza']
  },
  {
    id: 'infinity-loops',
    name: 'Bucles Infinitos',
    description: 'Símbolos de infinito entrelazados en patrones complejos',
    difficulty: 'Intermedio',
    theme: 'Abstracto',
    benefits: ['Comprende infinito', 'Desarrolla paciencia', 'Trasciende límites']
  },
  {
    id: 'mandala-flames',
    name: 'Llamas Purificadoras',
    description: 'Llamas sagradas que purifican y transforman el alma',
    difficulty: 'Avanzado',
    theme: 'Espiritual',
    benefits: ['Purifica energía', 'Transforma aspectos', 'Renueva propósito']
  }
];

// Función para generar SVG de mandala
export const generateMandalaPath = (design: MandalaDesign): string => {
  const size = 400;
  const center = size / 2;
  const radius = 180;

  let path = '';

  switch (design.id) {
    case 'lotus-peace':
      // Generar pétalos de loto
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * (Math.PI / 180);
        const x1 = center + Math.cos(angle) * (radius * 0.7);
        const y1 = center + Math.sin(angle) * (radius * 0.7);
        const x2 = center + Math.cos(angle) * radius;
        const y2 = center + Math.sin(angle) * radius;
        
        path += `M ${center} ${center} Q ${x1} ${y1} ${x2} ${y2} `;
        
        // Pétalos internos
        const x3 = center + Math.cos(angle) * (radius * 0.4);
        const y3 = center + Math.sin(angle) * (radius * 0.4);
        path += `M ${center} ${center} L ${x3} ${y3} `;
      }
      
      // Círculos concéntricos
      for (let r = 30; r <= 150; r += 30) {
        path += `M ${center + r} ${center} A ${r} ${r} 0 1 1 ${center - r} ${center} A ${r} ${r} 0 1 1 ${center + r} ${center} `;
      }
      break;

    case 'geometric-harmony':
      // Polígonos regulares concéntricos
      for (let sides = 6; sides <= 12; sides += 2) {
        for (let r = 50; r <= 160; r += 40) {
          for (let i = 0; i < sides; i++) {
            const angle = (i * (360 / sides)) * (Math.PI / 180);
            const x = center + Math.cos(angle) * r;
            const y = center + Math.sin(angle) * r;
            
            if (i === 0) {
              path += `M ${x} ${y} `;
            } else {
              path += `L ${x} ${y} `;
            }
          }
          path += 'Z ';
        }
      }
      break;

    case 'flower-garden':
      // Patrones florales
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * (Math.PI / 180);
        for (let r = 60; r <= 160; r += 50) {
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          
          // Crear formas de pétalos
          const petalSize = 20;
          path += `M ${x} ${y} `;
          path += `Q ${x + petalSize} ${y - petalSize} ${x} ${y - petalSize * 2} `;
          path += `Q ${x - petalSize} ${y - petalSize} ${x} ${y} `;
        }
      }
      break;

    default:
      // Patrón genérico para otros diseños
      for (let i = 0; i < 16; i++) {
        const angle = (i * 22.5) * (Math.PI / 180);
        for (let r = 40; r <= 170; r += 30) {
          const x1 = center + Math.cos(angle) * r;
          const y1 = center + Math.sin(angle) * r;
          const x2 = center + Math.cos(angle + 0.2) * (r + 20);
          const y2 = center + Math.sin(angle + 0.2) * (r + 20);
          
          path += `M ${x1} ${y1} Q ${x2} ${y2} ${center + Math.cos(angle + 0.4) * r} ${center + Math.sin(angle + 0.4) * r} `;
        }
      }
      
      // Círculos decorativos
      for (let r = 20; r <= 180; r += 40) {
        path += `M ${center + r} ${center} A ${r} ${r} 0 1 1 ${center - r} ${center} A ${r} ${r} 0 1 1 ${center + r} ${center} `;
      }
  }

  return path;
};

// Función para crear SVG completo
export const createMandalaContent = (design: MandalaDesign): string => {
  const size = 400;
  const path = generateMandalaPath(design);
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .mandala-path {
            fill: none;
            stroke: #333;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .center-circle {
            fill: none;
            stroke: #333;
            stroke-width: 2;
          }
        </style>
      </defs>
      
      <!-- Fondo blanco -->
      <rect width="${size}" height="${size}" fill="white"/>
      
      <!-- Círculo central -->
      <circle cx="${size/2}" cy="${size/2}" r="15" class="center-circle"/>
      
      <!-- Patrón del mandala -->
      <path d="${path}" class="mandala-path"/>
      
      <!-- Círculo exterior -->
      <circle cx="${size/2}" cy="${size/2}" r="190" class="center-circle"/>
      
      <!-- Título del mandala -->
      <text x="${size/2}" y="30" text-anchor="middle" font-family="serif" font-size="16" fill="#333">
        ${design.name}
      </text>
    </svg>
  `;
};

// Función para generar todas las páginas de un PDF con múltiples mandalas
export const getMandalaCollections = (): { name: string; designs: MandalaDesign[] }[] => {
  return [
    {
      name: 'Mandalas para Principiantes',
      designs: mandalaDesigns.filter(d => d.difficulty === 'Fácil')
    },
    {
      name: 'Mandalas Intermedios',
      designs: mandalaDesigns.filter(d => d.difficulty === 'Intermedio')
    },
    {
      name: 'Mandalas Avanzados',
      designs: mandalaDesigns.filter(d => d.difficulty === 'Avanzado')
    },
    {
      name: 'Mandalas de Naturaleza',
      designs: mandalaDesigns.filter(d => d.theme === 'Naturaleza')
    },
    {
      name: 'Mandalas Espirituales',
      designs: mandalaDesigns.filter(d => d.theme === 'Espiritual')
    }
  ];
};