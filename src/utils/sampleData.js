/**
 * Sample starter data for Science, Maths, Social Studies (SST), and Study Tools
 */

export const INITIAL_SUBJECTS = [
  {
    id: 'science',
    name: 'Science',
    code: 'SCI-101',
    description: 'Physics, Chemistry & Biology concepts, experiments and formulas',
    theme: 'emerald',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    bannerPattern: 'circles',
    icon: 'FlaskConical',
    teacher: 'Dr. Sarah Verma',
    room: 'Lab-A',
    topics: ['Chemical Reactions & Equations', 'Electricity & Magnetism', 'Life Processes & Cells', 'Light & Optics', 'Periodic Classification'],
  },
  {
    id: 'maths',
    name: 'Mathematics',
    code: 'MTH-201',
    description: 'Algebra, Geometry, Trigonometry, Calculus & Probability',
    theme: 'violet',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    bannerPattern: 'polygons',
    icon: 'Calculator',
    teacher: 'Prof. Ramesh Sharma',
    room: 'Room 204',
    topics: ['Quadratic Equations', 'Trigonometric Identities', 'Triangles & Coordinate Geometry', 'Arithmetic Progressions', 'Surface Areas & Volumes'],
  },
  {
    id: 'sst',
    name: 'Social Studies (SST)',
    code: 'SST-301',
    description: 'History, Geography, Democratic Politics (Civics) & Economics',
    theme: 'orange',
    gradient: 'from-amber-600 via-orange-600 to-rose-600',
    bannerPattern: 'waves',
    icon: 'Globe',
    teacher: 'Ms. Ananya Roy',
    room: 'Block C-12',
    topics: ['Nationalism in Europe & India', 'Resources & Development', 'Power Sharing & Federalism', 'Money, Credit & Globalization', 'Water & Agriculture'],
  }
];

export const INITIAL_RESOURCES = [
  // Science Resources
  {
    id: 'res_sci_1',
    subjectId: 'science',
    title: 'Chemical Reactions & Equations - Complete Concept Map',
    description: 'Detailed formula sheet with balanced equations, exothermic/endothermic reaction examples, and redox concepts.',
    type: 'pdf',
    topic: 'Chemical Reactions & Equations',
    tags: ['Formula Sheet', 'Important', 'Exam Notes'],
    url: '',
    fileName: 'Chemical_Reactions_Complete_Summary.pdf',
    fileSize: 2450000,
    uploadedBy: 'Dr. Sarah Verma',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    pinned: true,
    textContent: `# Chemical Reactions & Equations - Core Revision Notes
1. Chemical Equation: Symbolic representation of a chemical reaction.
2. Balancing Equations: Law of Conservation of Mass must be satisfied.
3. Types of Reactions:
   - Combination Reaction: A + B -> AB (e.g., CaO + H2O -> Ca(OH)2 + Heat)
   - Decomposition: Thermal, Electrolytic, and Photochemical.
   - Displacement: Fe + CuSO4 -> FeSO4 + Cu
   - Double Displacement: Na2SO4 + BaCl2 -> BaSO4(ppt) + 2NaCl
   - Redox: Oxidation (loss of e-) and Reduction (gain of e-).
4. Effects: Corrosion and Rancidity.`
  },
  {
    id: 'res_sci_2',
    subjectId: 'science',
    title: 'Ohm\'s Law & Electric Circuits Animated Visual Experiment',
    description: 'Interactive video breakdown of Ohm\'s Law (V = IR), series vs parallel circuits, and resistor combinations.',
    type: 'video',
    topic: 'Electricity & Magnetism',
    tags: ['Video Lesson', 'Practical', 'Animation'],
    url: 'https://www.youtube.com/watch?v=8jB74K10U_g',
    fileName: '',
    fileSize: 0,
    uploadedBy: 'Tanush',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    pinned: false,
  },
  {
    id: 'res_sci_3',
    subjectId: 'science',
    title: 'Plant & Animal Cell Structure Master Diagram',
    description: 'High-resolution diagram comparing mitochondria, chloroplasts, nucleus, and endoplasmic reticulum.',
    type: 'photo',
    topic: 'Life Processes & Cells',
    tags: ['Diagrams', 'Biology', 'High-Res'],
    url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80',
    fileName: 'cell_structure_labeled_chart.png',
    fileSize: 1850000,
    uploadedBy: 'Tanush',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    pinned: false,
  },
  {
    id: 'res_sci_4',
    subjectId: 'science',
    title: 'Khan Academy Science Interactive Portal & Simulations',
    description: 'Link to free simulation sandbox for optics, ray diagrams, and chemical bonding.',
    type: 'link',
    topic: 'Light & Optics',
    tags: ['Simulations', 'Practice Portal'],
    url: 'https://www.khanacademy.org/science',
    fileName: '',
    fileSize: 0,
    uploadedBy: 'Dr. Sarah Verma',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    pinned: false,
  },

  // Maths Resources
  {
    id: 'res_mth_1',
    subjectId: 'maths',
    title: 'Trigonometry Formula Master Cheatsheet & Identities',
    description: 'Complete trigonometric ratios table (0° to 90°), complementary angles, and sin²θ + cos²θ = 1 proofs.',
    type: 'pdf',
    topic: 'Trigonometric Identities',
    tags: ['Cheatsheet', 'Formulas', 'Must-Revise'],
    url: '',
    fileName: 'Trigonometry_Formulas_Class10.pdf',
    fileSize: 1980000,
    uploadedBy: 'Prof. Ramesh Sharma',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    pinned: true,
    textContent: `# Trigonometry Quick Formulas
1. Ratios: sin θ = P/H, cos θ = B/H, tan θ = P/B, cot θ = B/P, sec θ = H/B, cosec θ = H/P
2. Reciprocal Relations:
   - sin θ = 1/cosec θ
   - cos θ = 1/sec θ
   - tan θ = sin θ / cos θ = 1/cot θ
3. Fundamental Identities:
   - sin² θ + cos² θ = 1
   - 1 + tan² θ = sec² θ  =>  sec² θ - tan² θ = 1
   - 1 + cot² θ = cosec² θ => cosec² θ - cot² θ = 1
4. Values at Standard Angles (0°, 30°, 45°, 60°, 90°).`
  },
  {
    id: 'res_mth_2',
    subjectId: 'maths',
    title: 'Quadratic Equations - 3 Methods of Solving Step-by-Step',
    description: 'Video tutorial covering Factorization method, Completing the Square, and the Quadratic Formula (Discriminant D = b² - 4ac).',
    type: 'video',
    topic: 'Quadratic Equations',
    tags: ['Video Lesson', 'Algebra', 'Step-by-Step'],
    url: 'https://www.youtube.com/watch?v=Ecf_TbL4pzA',
    fileName: '',
    fileSize: 0,
    uploadedBy: 'Tanush',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    pinned: false,
  },
  {
    id: 'res_mth_3',
    subjectId: 'maths',
    title: 'Geometry & Coordinate Geometry Slide Presentation',
    description: 'Class presentation slides covering Distance formula, Section formula, Area of Triangles, and Circle tangents.',
    type: 'presentation',
    topic: 'Triangles & Coordinate Geometry',
    tags: ['Slides', 'Lecture Notes', 'Presentation'],
    url: '',
    fileName: 'Coordinate_Geometry_Slides.pptx',
    fileSize: 4200000,
    uploadedBy: 'Prof. Ramesh Sharma',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    pinned: false,
  },

  // SST Resources
  {
    id: 'res_sst_1',
    subjectId: 'sst',
    title: 'The Rise of Nationalism in Europe - Complete Timeline Chart',
    description: 'Chronological timeline from 1789 French Revolution, Napoleonic Code 1804, Vienna Congress 1815, to German & Italian Unification.',
    type: 'pdf',
    topic: 'Nationalism in Europe & India',
    tags: ['Timeline', 'History', 'High Weightage'],
    url: '',
    fileName: 'Rise_of_Nationalism_Europe_Notes.pdf',
    fileSize: 3100000,
    uploadedBy: 'Ms. Ananya Roy',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    pinned: true,
    textContent: `# The Rise of Nationalism in Europe
Key Milestones:
- 1789: French Revolution introduces idea of 'la patrie' (fatherland) and 'le citoyen' (citizen).
- 1804: Civil Code (Napoleonic Code) establishes equality before law and secures property rights.
- 1815: Battle of Waterloo & Treaty of Vienna restored conservative regimes.
- 1830 & 1848: Revolutions in Europe; Greek War of Independence (Treaty of Constantinople 1832).
- 1861-1871: Unification of Italy (Cavour, Garibaldi, Victor Emmanuel II) & Germany (Otto von Bismarck).`
  },
  {
    id: 'res_sst_2',
    subjectId: 'sst',
    title: 'India Major Soil Types & Agriculture Map of India',
    description: 'High-res geographical map showcasing Alluvial, Black, Red & Yellow, Laterite, and Arid soil distributions.',
    type: 'photo',
    topic: 'Resources & Development',
    tags: ['Map Work', 'Geography', 'Exam Prep'],
    url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    fileName: 'soils_of_india_geography_map.png',
    fileSize: 2200000,
    uploadedBy: 'Tanush',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    pinned: false,
  },
  {
    id: 'res_sst_3',
    subjectId: 'sst',
    title: 'Money, Banking & Credit Systems - Visual Explainer',
    description: 'Learn how modern banking works: Demand deposits, Formal vs Informal sources of credit, and Self Help Groups (SHGs).',
    type: 'video',
    topic: 'Money, Credit & Globalization',
    tags: ['Economics', 'Video Lecture', 'Concept Video'],
    url: 'https://www.youtube.com/watch?v=PHe0bXAIuk8',
    fileName: '',
    fileSize: 0,
    uploadedBy: 'Ms. Ananya Roy',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 85).toISOString(),
    pinned: false,
  }
];

export const INITIAL_FLASHCARDS = [
  {
    id: 'fc_1',
    subjectId: 'science',
    question: 'What is Ohm\'s Law and its mathematical formula?',
    answer: 'Ohm\'s Law states that the current flowing through a conductor is directly proportional to the potential difference across its ends, provided temperature remains constant.\nFormula: V = I × R (Voltage = Current × Resistance)',
    topic: 'Electricity & Magnetism',
    mastered: false,
  },
  {
    id: 'fc_2',
    subjectId: 'science',
    question: 'What is the chemical formula of Plaster of Paris and how is it prepared?',
    answer: 'Formula: CaSO4 · ½ H2O (Calcium sulphate hemihydrate).\nPrepared by heating Gypsum (CaSO4 · 2H2O) at 373 K (100°C).',
    topic: 'Chemical Reactions & Equations',
    mastered: true,
  },
  {
    id: 'fc_3',
    subjectId: 'maths',
    question: 'What is the Quadratic Formula to find roots of ax² + bx + c = 0?',
    answer: 'x = (-b ± √(b² - 4ac)) / (2a)\nWhere Discriminant D = b² - 4ac.\nIf D > 0 (two real distinct roots), D = 0 (two equal roots), D < 0 (no real roots).',
    topic: 'Quadratic Equations',
    mastered: false,
  },
  {
    id: 'fc_4',
    subjectId: 'maths',
    question: 'What is the formula for the distance between two points (x1, y1) and (x2, y2)?',
    answer: 'Distance = √((x2 - x1)² + (y2 - y1)²) units.',
    topic: 'Triangles & Coordinate Geometry',
    mastered: true,
  },
  {
    id: 'fc_5',
    subjectId: 'sst',
    question: 'What were the key provisions of the Civil Code of 1804 (Napoleonic Code)?',
    answer: '1. Abolished privileges based on birth.\n2. Established equality before the law.\n3. Secured the right to property.\n4. Removed guild restrictions in towns.',
    topic: 'Nationalism in Europe & India',
    mastered: false,
  },
  {
    id: 'fc_6',
    subjectId: 'sst',
    question: 'What are the two major advantages of Self Help Groups (SHGs)?',
    answer: '1. Helps rural poor (especially women) obtain collateral-free loans at reasonable interest rates.\n2. Provides a regular platform to discuss social issues like health, nutrition, and domestic empowerment.',
    topic: 'Money, Credit & Globalization',
    mastered: false,
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task_1',
    subjectId: 'science',
    title: 'Solve NCERT Back Exercises for Chapter 1 (Chemical Reactions)',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
  },
  {
    id: 'task_2',
    subjectId: 'maths',
    title: 'Practice 15 Trigonometry Proof Questions from sample paper',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
    priority: 'medium',
    completed: true,
  },
  {
    id: 'task_3',
    subjectId: 'sst',
    title: 'Mark Major Soil Types and Dams on Outline Map of India',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg_1',
    channel: 'general',
    sender: 'Tanush',
    avatarGradient: 'from-indigo-500 to-purple-600',
    text: 'Hey everyone! Welcome to the new EduStudy Hub. Uploaded formulas and notes for tomorrow\'s test in Science and Maths 🚀',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    reactions: { '🔥': 3, '👍': 2 },
    isBot: false,
  },
  {
    id: 'msg_2',
    channel: 'general',
    sender: 'Dr. Sarah Verma',
    avatarGradient: 'from-emerald-400 to-teal-600',
    text: 'Great work! Make sure to review the chemical reaction types and balanced equations in the Science stream before class.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reactions: { '🙌': 4 },
    isBot: false,
  },
  {
    id: 'msg_3',
    channel: 'science',
    sender: 'Tanush',
    avatarGradient: 'from-indigo-500 to-purple-600',
    text: '@StudyBot Can you explain the difference between exothermic and endothermic reactions with simple daily life examples?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reactions: {},
    isBot: false,
  },
  {
    id: 'msg_4',
    channel: 'science',
    sender: 'StudyBot AI',
    avatarGradient: 'from-cyan-500 to-blue-600',
    text: `⚡ **Exothermic vs Endothermic Reactions**:

1. **Exothermic Reaction (Releases Heat)**:
   - Energy is released into surroundings; temperature rises.
   - *Example*: Burning natural gas (CH₄ + 2O₂ → CO₂ + 2H₂O + Heat), Respiration, Quicklime in water.

2. **Endothermic Reaction (Absorbs Heat)**:
   - Energy is absorbed from surroundings; temperature drops.
   - *Example*: Photosynthesis (plants absorb sunlight), Baking a cake, Thermal decomposition of Limestone (CaCO₃ + Heat → CaO + CO₂).`,
    timestamp: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    reactions: { '💡': 5, '❤️': 3 },
    isBot: true,
  },
  {
    id: 'msg_5',
    channel: 'maths',
    sender: 'Prof. Ramesh Sharma',
    avatarGradient: 'from-indigo-600 to-purple-600',
    text: 'Tip for Trigonometry: Whenever stuck on a complex identity proof, try converting everything into terms of sin θ and cos θ first!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    reactions: { '💯': 6 },
    isBot: false,
  },
  {
    id: 'msg_6',
    channel: 'sst',
    sender: 'Ms. Ananya Roy',
    avatarGradient: 'from-amber-400 to-orange-600',
    text: 'Reminder: Map work carries 5 solid marks in the board examination. Practice locating the major soil belts and mineral reserves on the India outline map.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    reactions: { '📌': 4 },
    isBot: false,
  }
];
