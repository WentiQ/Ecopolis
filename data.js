/* ================================================================
   ECOPOLIS — data.js
   All game data strictly following the Blueprint document
   ================================================================ */

// Player colours & defaults
const PLAYER_COLORS = ['#2060c0','#c03020','#20a040','#9020b0'];
const PLAYER_NAMES_DEFAULT = ['Player 1','Player 2','Player 3','Player 4'];

/* ================================================================
   BUILDING CARDS  (all 75 unique City Assets from PPT)
   Fields: id, name, icon, cat, group, cost{capital,land},
           echo, production{capital,wellbeing,pollution,globalEco}, vp
   ================================================================ */
const BUILDING_CARDS = [
  // --- Environmental Health (eco) ---
  {id:'b01',name:'Sewage/Water Filtration',icon:'💧',cat:'eco',group:'Environmental Health',cost:{capital:4,land:5},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:1},vp:1},
  {id:'b02',name:'Solar Energy Farm',icon:'☀️',cat:'eco',group:'Environmental Health',cost:{capital:5,land:6},echo:0,production:{capital:1,wellbeing:2,pollution:0,globalEco:1},vp:2},
  {id:'b03',name:'Waste-to-Energy Plant',icon:'♻️',cat:'eco',group:'Environmental Health',cost:{capital:3,land:4},echo:1,production:{capital:1,wellbeing:2,pollution:0,globalEco:0},vp:1},
  {id:'b04',name:'Air Quality Monitoring',icon:'🌬️',cat:'eco',group:'Environmental Health',cost:{capital:2,land:3},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:1},vp:1},
  {id:'b05',name:'Air Filtration Towers',icon:'🍃',cat:'eco',group:'Environmental Health',cost:{capital:3,land:4},echo:0,production:{capital:0,wellbeing:5,pollution:-1,globalEco:1},vp:2},
  {id:'b06',name:'Permeable Pavements',icon:'🌿',cat:'eco',group:'Environmental Health',cost:{capital:2,land:4},echo:0,production:{capital:0,wellbeing:1,pollution:0,globalEco:1},vp:1},
  {id:'b07',name:'Hazardous Waste Sites',icon:'☣️',cat:'eco',group:'Environmental Health',cost:{capital:2,land:5},echo:2,production:{capital:0,wellbeing:3,pollution:0,globalEco:0},vp:1},
  // --- Transport & Mobility ---
  {id:'b08',name:'Subways',icon:'🚇',cat:'transport',group:'Transport & Mobility',cost:{capital:6,land:4},echo:0,production:{capital:0,wellbeing:6,pollution:-1,globalEco:0},vp:2},
  {id:'b09',name:'Bus Facility',icon:'🚌',cat:'transport',group:'Transport & Mobility',cost:{capital:3,land:3},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:0},vp:1},
  {id:'b10',name:'EV Hubs',icon:'⚡',cat:'transport',group:'Transport & Mobility',cost:{capital:4,land:2},echo:0,production:{capital:0,wellbeing:4,pollution:-1,globalEco:0},vp:1},
  {id:'b11',name:'Bike Lanes',icon:'🚲',cat:'transport',group:'Transport & Mobility',cost:{capital:1,land:2},echo:0,production:{capital:0,wellbeing:3,pollution:0,globalEco:0},vp:1},
  {id:'b12',name:'Pedestrian Bridges',icon:'🌉',cat:'transport',group:'Transport & Mobility',cost:{capital:2,land:2},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:0},vp:1},
  {id:'b13',name:'Traffic Management',icon:'🚦',cat:'transport',group:'Transport & Mobility',cost:{capital:2,land:1},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:0},vp:1},
  // --- Community & Culture ---
  {id:'b14',name:'Public Libraries',icon:'📚',cat:'community',group:'Community & Culture',cost:{capital:3,land:0},echo:0,production:{capital:0,wellbeing:5,pollution:0,globalEco:0},vp:1},
  {id:'b15',name:'Museums',icon:'🏛️',cat:'community',group:'Community & Culture',cost:{capital:4,land:1},echo:0,production:{capital:0,wellbeing:5,pollution:0,globalEco:0},vp:1},
  {id:'b16',name:'Theatre/Cinema',icon:'🎭',cat:'community',group:'Community & Culture',cost:{capital:2,land:1},echo:0,production:{capital:0,wellbeing:6,pollution:0,globalEco:0},vp:1},
  {id:'b17',name:'Amphitheatres',icon:'🎪',cat:'community',group:'Community & Culture',cost:{capital:2,land:0},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:0},vp:1},
  {id:'b18',name:'Public Schools',icon:'🏫',cat:'community',group:'Community & Culture',cost:{capital:4,land:1},echo:0,production:{capital:0,wellbeing:6,pollution:0,globalEco:0},vp:2},
  {id:'b19',name:'Job Training Schools',icon:'🎓',cat:'community',group:'Community & Culture',cost:{capital:5,land:1},echo:0,production:{capital:0,wellbeing:7,pollution:0,globalEco:0},vp:2},
  {id:'b20',name:'Farmers Market',icon:'🥕',cat:'community',group:'Community & Culture',cost:{capital:0,land:1},echo:0,production:{capital:3,wellbeing:4,pollution:0,globalEco:0},vp:1},
  // --- Health & Recreation ---
  {id:'b21',name:'Public Health Clinics',icon:'🏥',cat:'health',group:'Health & Recreation',cost:{capital:5,land:1},echo:0,production:{capital:0,wellbeing:7,pollution:0,globalEco:0},vp:2},
  {id:'b22',name:'Sports Complex',icon:'⚽',cat:'health',group:'Health & Recreation',cost:{capital:4,land:1},echo:0,production:{capital:0,wellbeing:5,pollution:0,globalEco:0},vp:1},
  {id:'b23',name:'Gyms',icon:'🏋️',cat:'health',group:'Health & Recreation',cost:{capital:3,land:1},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:0},vp:1},
  {id:'b24',name:'Pools',icon:'🏊',cat:'health',group:'Health & Recreation',cost:{capital:4,land:0},echo:0,production:{capital:0,wellbeing:3,pollution:0,globalEco:0},vp:1},
  {id:'b25',name:'Dog Parks',icon:'🐕',cat:'health',group:'Health & Recreation',cost:{capital:3,land:0},echo:0,production:{capital:0,wellbeing:5,pollution:0,globalEco:0},vp:1},
  {id:'b26',name:'Skating Rink',icon:'⛸️',cat:'health',group:'Health & Recreation',cost:{capital:2,land:0},echo:0,production:{capital:0,wellbeing:5,pollution:0,globalEco:0},vp:1},
  // --- Safety & Essential ---
  {id:'b27',name:'Police',icon:'👮',cat:'safety',group:'Safety & Essential',cost:{capital:4,land:1},echo:0,production:{capital:0,wellbeing:6,pollution:0,globalEco:0},vp:1},
  {id:'b28',name:'Fire Brigade',icon:'🚒',cat:'safety',group:'Safety & Essential',cost:{capital:5,land:1},echo:0,production:{capital:0,wellbeing:8,pollution:0,globalEco:0},vp:2},
  {id:'b29',name:'Crisis Shelters',icon:'🏠',cat:'safety',group:'Safety & Essential',cost:{capital:2,land:1},echo:0,production:{capital:0,wellbeing:5,pollution:0,globalEco:0},vp:1},
  {id:'b30',name:'Homeless Shelters',icon:'🛖',cat:'safety',group:'Safety & Essential',cost:{capital:3,land:0},echo:0,production:{capital:0,wellbeing:4,pollution:0,globalEco:0},vp:1},
  {id:'b31',name:'Emergency Sirens',icon:'🚨',cat:'safety',group:'Safety & Essential',cost:{capital:1,land:0},echo:0,production:{capital:0,wellbeing:3,pollution:0,globalEco:0},vp:1},
  {id:'b32',name:'Street Lights',icon:'💡',cat:'safety',group:'Safety & Essential',cost:{capital:1,land:1},echo:0,production:{capital:0,wellbeing:2,pollution:0,globalEco:0},vp:1},
  {id:'b33',name:'Fountains',icon:'⛲',cat:'safety',group:'Safety & Essential',cost:{capital:2,land:0},echo:0,production:{capital:0,wellbeing:3,pollution:0,globalEco:0},vp:1},
  // --- Heavy Industry (Side 1) ---
  {id:'b34',name:'Petrochemical Refineries',icon:'🏭',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:8},echo:8,production:{capital:8,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b35',name:'Metal Refineries',icon:'⚙️',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:7},echo:7,production:{capital:7,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b36',name:'Foundries',icon:'🔩',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:6},echo:6,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b37',name:'Cement',icon:'🏗️',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:4},echo:4,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b38',name:'Glass',icon:'🪟',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:5},echo:5,production:{capital:7,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b39',name:'Automobile',icon:'🚗',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:6},echo:6,production:{capital:8,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b40',name:'Heavy Machinery',icon:'🔧',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:4},echo:4,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b41',name:'Textile',icon:'🧵',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:2},echo:2,production:{capital:5,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b42',name:'Consumer Goods',icon:'📦',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:2},echo:2,production:{capital:4,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b43',name:'Rare Earth Processing',icon:'💎',cat:'industry',group:'Heavy Industry',cost:{capital:0,land:6},echo:6,production:{capital:9,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b44',name:'Quarrying',icon:'⛏️',cat:'industry',group:'Resource Extraction',cost:{capital:0,land:6},echo:6,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b45',name:'Heavy Equipment Rental',icon:'🚜',cat:'industry',group:'Resource Extraction',cost:{capital:0,land:3},echo:3,production:{capital:7,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b46',name:'Construction Sector',icon:'👷',cat:'industry',group:'Resource Extraction',cost:{capital:0,land:6},echo:6,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b47',name:'Logging',icon:'🪓',cat:'industry',group:'Resource Extraction',cost:{capital:0,land:4},echo:4,production:{capital:3,wellbeing:0,pollution:0,globalEco:-1},vp:1},
  // --- Tech & Finance (Side 2) ---
  {id:'b48',name:'Stock Exchange',icon:'📈',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:2},echo:2,production:{capital:9,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b49',name:'IT Company',icon:'💻',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:2},echo:2,production:{capital:8,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b50',name:'Data Centers',icon:'🗄️',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:5},echo:5,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b51',name:'Quantum Hubs',icon:'⚛️',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:3},echo:3,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b52',name:'Semiconductor Fabrication',icon:'🔬',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:5},echo:5,production:{capital:9,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b53',name:'Tech Incubators',icon:'🚀',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:3},echo:3,production:{capital:7,wellbeing:0,pollution:0,globalEco:0},vp:2},
  {id:'b54',name:'Cyber Centers',icon:'🌐',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:3},echo:3,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b55',name:'Special Economic Zones',icon:'🏙️',cat:'industry',group:'Tech & Finance',cost:{capital:0,land:5},echo:5,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b56',name:'Bio-Gas Bottling Plants',icon:'🌱',cat:'industry',group:'Green Industry',cost:{capital:0,land:0},echo:0,production:{capital:3,wellbeing:1,pollution:-3,globalEco:1},vp:2},
  {id:'b57',name:'Carbon Credit Trading',icon:'💚',cat:'industry',group:'Green Industry',cost:{capital:0,land:0},echo:0,production:{capital:5,wellbeing:0,pollution:-3,globalEco:2},vp:2},
  {id:'b58',name:'Sustainable Forestry',icon:'🌲',cat:'industry',group:'Green Industry',cost:{capital:0,land:2},echo:0,production:{capital:3,wellbeing:1,pollution:0,globalEco:2},vp:1},
  {id:'b59',name:'Agrochemical Hubs',icon:'🌾',cat:'industry',group:'Green Industry',cost:{capital:0,land:2},echo:2,production:{capital:4,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b60',name:'Standard Power Plants',icon:'🔌',cat:'industry',group:'Energy & Power',cost:{capital:0,land:6},echo:6,production:{capital:6,wellbeing:0,pollution:0,globalEco:0},vp:1},
  {id:'b61',name:'Nuclear Power Plants',icon:'☢️',cat:'industry',group:'Energy & Power',cost:{capital:0,land:5},echo:5,production:{capital:10,wellbeing:0,pollution:0,globalEco:0},vp:2},
];

/* ================================================================
   OUTER LOOP — 80 SPACES
   Exactly following Blueprint doc:
   4 Corners + 4 Sides of 19 spaces each = 80 total

   Corner 1 = space 1 = START (top-left)
   Corner 2 = space 21 = Terrorism Crisis (top-right)
   Corner 3 = space 41 = Deforestation Crisis (bottom-right)
   Corner 4 = space 61 = Pollution Disaster Crisis (bottom-left)

   Side 1 (top, spaces 2-20): Heavy Industry + Crises
   Side 2 (right, spaces 22-40): Tech/Green/Energy + Crises
   Side 3 (bottom, spaces 42-60): Community/Health/Transport + Crises
   Side 4 (left, spaces 62-80): Safety/Dilemmas/Chains
   ================================================================ */
const OUTER_SPACES = [
  // Corner 1
  {id:1,  type:'s-start',  label:'START',                icon:'★',  isCorner:true},
  // Side 1: Heavy Industry, Extraction & Crises (top, left→right)
  {id:2,  type:'s-asset',  label:'Petrochemical Ref.',   icon:'🏭'},
  {id:3,  type:'s-asset',  label:'Metal Refineries',     icon:'⚙️'},
  {id:4,  type:'s-asset',  label:'Foundries',            icon:'🔩'},
  {id:5,  type:'s-crisis', label:'Refugee Crisis',       icon:'🌊', cardRef:'Refugee Crisis'},
  {id:6,  type:'s-asset',  label:'Cement',               icon:'🏗️'},
  {id:7,  type:'s-asset',  label:'Glass',                icon:'🪟'},
  {id:8,  type:'s-crisis', label:'Social Inequality',    icon:'⚖️', cardRef:'Social Inequality'},
  {id:9,  type:'s-asset',  label:'Automobile',           icon:'🚗'},
  {id:10, type:'s-asset',  label:'Heavy Machinery',      icon:'🔧'},
  {id:11, type:'s-asset',  label:'Textile',              icon:'🧵'},
  {id:12, type:'s-crisis', label:'Oil Spill',            icon:'🛢️', cardRef:'Oil Spill'},
  {id:13, type:'s-asset',  label:'Consumer Goods',       icon:'📦'},
  {id:14, type:'s-asset',  label:'Rare Earth Process.',  icon:'💎'},
  {id:15, type:'s-asset',  label:'Quarrying',            icon:'⛏️'},
  {id:16, type:'s-crisis', label:'Overfishing',          icon:'🐟', cardRef:'Overfishing'},
  {id:17, type:'s-asset',  label:'Heavy Equip. Rental',  icon:'🚜'},
  {id:18, type:'s-asset',  label:'Construction Sector',  icon:'👷'},
  {id:19, type:'s-asset',  label:'Logging',              icon:'🪓'},
  {id:20, type:'s-crisis', label:'Biodiversity Loss',    icon:'🦋', cardRef:'Biodiversity Loss'},
  // Corner 2
  {id:21, type:'s-crisis', label:'Terrorism',            icon:'💣', isCorner:true, cardRef:'Terrorism'},
  // Side 2: Tech, Green Industry, Energy & Crises (right, top→bottom)
  {id:22, type:'s-asset',  label:'Stock Exchange',       icon:'📈'},
  {id:23, type:'s-asset',  label:'IT Company',           icon:'💻'},
  {id:24, type:'s-crisis', label:'AI Disruption',        icon:'🤖', cardRef:'AI Disruption'},
  {id:25, type:'s-asset',  label:'Data Centers',         icon:'🗄️'},
  {id:26, type:'s-asset',  label:'Quantum Hubs',         icon:'⚛️'},
  {id:27, type:'s-asset',  label:'Semiconductor Fab.',   icon:'🔬'},
  {id:28, type:'s-crisis', label:'Inflation',            icon:'📊', cardRef:'Inflation'},
  {id:29, type:'s-asset',  label:'Tech Incubators',      icon:'🚀'},
  {id:30, type:'s-asset',  label:'Cyber Centers',        icon:'🌐'},
  {id:31, type:'s-asset',  label:'Special Econ. Zones',  icon:'🏙️'},
  {id:32, type:'s-crisis', label:'Innovation Crisis',    icon:'🧑‍🔬', cardRef:'Innovation Crisis'},
  {id:33, type:'s-asset',  label:'Bio-Gas Plants',       icon:'🌱'},
  {id:34, type:'s-asset',  label:'Carbon Credit Trading',icon:'💚'},
  {id:35, type:'s-asset',  label:'Sustainable Forestry', icon:'🌲'},
  {id:36, type:'s-crisis', label:'Chip Shortage',        icon:'💾', cardRef:'Chip Shortage'},
  {id:37, type:'s-asset',  label:'Agrochemical Hubs',    icon:'🌾'},
  {id:38, type:'s-asset',  label:'Standard Power Plants',icon:'🔌'},
  {id:39, type:'s-asset',  label:'Nuclear Power Plants', icon:'☢️'},
  {id:40, type:'s-chain',  label:'Bird Pop. Increases',  icon:'🐦', cardRef:'Bird Population Growth'},
  // Corner 3
  {id:41, type:'s-crisis', label:'Deforestation',        icon:'🌲', isCorner:true, cardRef:'Deforestation'},
  // Side 3: Community, Health, Transport & Crises (bottom, right→left)
  {id:42, type:'s-asset',  label:'Public Libraries',     icon:'📚'},
  {id:43, type:'s-asset',  label:'Museums',              icon:'🏛️'},
  {id:44, type:'s-crisis', label:'Trust Crisis',         icon:'🎭', cardRef:'Trust Crisis'},
  {id:45, type:'s-asset',  label:'Theatre/Cinema',       icon:'🎭'},
  {id:46, type:'s-asset',  label:'Amphitheatres',        icon:'🎪'},
  {id:47, type:'s-asset',  label:'Public Schools',       icon:'🏫'},
  {id:48, type:'s-crisis', label:'Loneliness Crisis',    icon:'😔', cardRef:'Loneliness Crisis'},
  {id:49, type:'s-asset',  label:'Public Health Clinics',icon:'🏥'},
  {id:50, type:'s-asset',  label:'Sports Complex',       icon:'⚽'},
  {id:51, type:'s-asset',  label:'Gyms',                 icon:'🏋️'},
  {id:52, type:'s-crisis', label:'Food Security',        icon:'🍞', cardRef:'Food Security Crisis'},
  {id:53, type:'s-asset',  label:'Pools',                icon:'🏊'},
  {id:54, type:'s-asset',  label:'Dog Parks',            icon:'🐕'},
  {id:55, type:'s-asset',  label:'Subways',              icon:'🚇'},
  {id:56, type:'s-crisis', label:'Plastic Pollution',    icon:'🧴', cardRef:'Plastic Pollution'},
  {id:57, type:'s-asset',  label:'Bus Facility',         icon:'🚌'},
  {id:58, type:'s-asset',  label:'EV Hubs',              icon:'⚡'},
  {id:59, type:'s-asset',  label:'Bike Lanes',           icon:'🚲'},
  {id:60, type:'s-asset',  label:'Pedestrian Bridges',   icon:'🌉'},
  // Corner 4
  {id:61, type:'s-crisis', label:'Pollution Disaster',   icon:'🏭', isCorner:true, cardRef:'Pollution Disaster'},
  // Side 4: Safety, Dilemmas, Chain Reactions & Minor Positives (left, bottom→top)
  {id:62, type:'s-asset',  label:'Police',               icon:'👮'},
  {id:63, type:'s-asset',  label:'Fire Brigade',         icon:'🚒'},
  {id:64, type:'s-crisis', label:'Desertification',      icon:'🏜️', cardRef:'Desertification'},
  {id:65, type:'s-asset',  label:'Crisis Shelters',      icon:'🏠'},
  {id:66, type:'s-asset',  label:'Homeless Shelters',    icon:'🛖'},
  {id:67, type:'s-dilemma',label:'Traffic',              icon:'🚦', cardRef:'Traffic'},
  {id:68, type:'s-dilemma',label:'Mycelium Network',     icon:'🍄', cardRef:'Mycelium Network'},
  {id:69, type:'s-dilemma',label:'Green Spaces',         icon:'🌳', cardRef:'Green Spaces'},
  {id:70, type:'s-dilemma',label:'Wildlife Conservation',icon:'🐺', cardRef:'Wildlife Conservation'},
  {id:71, type:'s-dilemma',label:'Seeds',                icon:'🌱', cardRef:'Seeds'},
  {id:72, type:'s-dilemma',label:'Organic Farming',      icon:'🌾', cardRef:'Organic Farming'},
  {id:73, type:'s-dilemma',label:'Maintain Forests',     icon:'🌲', cardRef:'Maintain Forests'},
  {id:74, type:'s-dilemma',label:'River Fish Collapse',  icon:'🐟', cardRef:'River Fish Collapse'},
  {id:75, type:'s-dilemma',label:'Rare Plankton',        icon:'🌊', cardRef:'Rare Plankton'},
  {id:76, type:'s-chain',  label:'Predator Protection',  icon:'🐺', cardRef:'Predator Protection'},
  {id:77, type:'s-chain',  label:'Excess Fertilizer',    icon:'🌾', cardRef:'Excess Fertilizer Damage'},
  {id:78, type:'s-chain',  label:'Forest Destruction',   icon:'🌲', cardRef:'Forest Destruction Chain'},
  {id:79, type:'s-chain',  label:'Bee Pop. Decline',     icon:'🐝', cardRef:'Bee Population Decline'},
  {id:80, type:'s-event',  label:'Vertical Farm Pilot',  icon:'🌿', cardRef:'Vertical Farm Pilot'},
];

/* ================================================================
   CENTER LINES — 52 inner spaces
   Blueprint:
   4 Orthogonal lines × 6 spaces each = 24
   4 Diagonal lines  × 7 spaces each = 28
   Total = 52

   Directions: UP=north, RIGHT=east, DOWN=south, LEFT=west
   Diagonals: TR=NE, BR=SE, BL=SW, TL=NW

   Each inner space has:
   - id: string (e.g. 'UP1', 'TR3')
   - name, icon, type (s-inner-up/right/down/left/diag)
   - cardRef: matches a card in CRISIS/DILEMMA/EVENT/WONDER
   ================================================================ */
const INNER_SPACES = [
  // ORTHOGONAL UP (6 spaces, space 1=nearest outer, 6=nearest center)
  {id:'UP1',dir:'up',name:'Planet Regeneration',  icon:'🌍',type:'s-inner-up',  cardRef:'Planet Regeneration'},
  {id:'UP2',dir:'up',name:'Nuclear Strike',        icon:'💣',type:'s-inner-up',  cardRef:'Nuclear Strike'},
  {id:'UP3',dir:'up',name:'Economic Boom',         icon:'📈',type:'s-inner-up',  cardRef:'Economic Boom'},
  {id:'UP4',dir:'up',name:'Desert Expansion',      icon:'🏜️',type:'s-inner-up', cardRef:'Desert Expansion'},
  {id:'UP5',dir:'up',name:'Green Bond Issuance',   icon:'💵',type:'s-inner-up',  cardRef:'Green Bond Issuance'},
  {id:'UP6',dir:'up',name:'Ocean Plastic Cleanup', icon:'🌊',type:'s-inner-up',  cardRef:'Ocean Plastic Cleanup'},
  // ORTHOGONAL RIGHT (6 spaces)
  {id:'RI1',dir:'right',name:'Ozone Layer Repaired',        icon:'🌍',type:'s-inner-right',cardRef:'Ozone Layer Repaired'},
  {id:'RI2',dir:'right',name:'Pandemic',                    icon:'🦠',type:'s-inner-right',cardRef:'Pandemic'},
  {id:'RI3',dir:'right',name:'Carbon Capture Breakthrough', icon:'🔭',type:'s-inner-right',cardRef:'Carbon Capture Breakthrough'},
  {id:'RI4',dir:'right',name:'Forest Fire Prevention',      icon:'🔥',type:'s-inner-right',cardRef:'Forest Fire Prevention'},
  {id:'RI5',dir:'right',name:'Record Harvest',              icon:'🌾',type:'s-inner-right',cardRef:'Record Harvest'},
  {id:'RI6',dir:'right',name:'Carbon Capture Project',      icon:'🏭',type:'s-inner-right',cardRef:'Carbon Capture Project'},
  // ORTHOGONAL DOWN (6 spaces)
  {id:'DN1',dir:'down',name:'Freshwater Aquifer Disc.',    icon:'💧',type:'s-inner-down',cardRef:'Freshwater Aquifer Discovered'},
  {id:'DN2',dir:'down',name:'Grid Attack',                 icon:'⚡',type:'s-inner-down',cardRef:'Grid Attack'},
  {id:'DN3',dir:'down',name:'Sustainable City Award',      icon:'🏆',type:'s-inner-down',cardRef:'Sustainable City Award'},
  {id:'DN4',dir:'down',name:'Water Resource Decision',     icon:'💧',type:'s-inner-down',cardRef:'Water Resource Decision'},
  {id:'DN5',dir:'down',name:'Renewable Breakthrough',      icon:'⚡',type:'s-inner-down',cardRef:'Renewable Breakthrough'},
  {id:'DN6',dir:'down',name:'Climate Refugee Settlement',  icon:'🏠',type:'s-inner-down',cardRef:'Climate Refugee Settlement'},
  // ORTHOGONAL LEFT (6 spaces)
  {id:'LF1',dir:'left',name:'Philanthropic Donation',  icon:'🤝',type:'s-inner-left',cardRef:'Philanthropic Donation'},
  {id:'LF2',dir:'left',name:'Famine',                  icon:'🌾',type:'s-inner-left',cardRef:'Famine'},
  {id:'LF3',dir:'left',name:'Engineering Convention',  icon:'🔬',type:'s-inner-left',cardRef:'Engineering Convention'},
  {id:'LF4',dir:'left',name:'Forest Decision',         icon:'🌲',type:'s-inner-left',cardRef:'Forest Decision'},
  {id:'LF5',dir:'left',name:'Heritage Restoration',    icon:'🏛️',type:'s-inner-left',cardRef:'Heritage Restoration'},
  {id:'LF6',dir:'left',name:'River Dam',               icon:'💧',type:'s-inner-left',cardRef:'River Dam'},
  // DIAGONAL TOP-RIGHT (7 spaces)
  {id:'TR1',dir:'tr',name:'Butterfly Storm',      icon:'🦋',type:'s-inner-diag',cardRef:'Butterfly Storm'},
  {id:'TR2',dir:'tr',name:'Gov. Collapse',         icon:'🏛️',type:'s-inner-diag',cardRef:'Government Collapse'},
  {id:'TR3',dir:'tr',name:'Symphony of Birds',     icon:'🐦',type:'s-inner-diag',cardRef:'Symphony of Birds'},
  {id:'TR4',dir:'tr',name:'Rare Minerals',         icon:'⛰️',type:'s-inner-diag',cardRef:'Rare Minerals'},
  {id:'TR5',dir:'tr',name:'University Tech Park',  icon:'🎓',type:'s-inner-diag',cardRef:'University Tech Park'},
  {id:'TR6',dir:'tr',name:'War',                   icon:'⚔️',type:'s-inner-diag',cardRef:'War'},
  {id:'TR7',dir:'tr',name:'Energy Demand Spike',   icon:'⚡',type:'s-inner-diag',cardRef:'Energy Demand Spike'},
  // DIAGONAL BOTTOM-RIGHT (7 spaces)
  {id:'BR1',dir:'br',name:'Great Forest Awakening',  icon:'🌳',type:'s-inner-diag',cardRef:'Great Forest Awakening'},
  {id:'BR2',dir:'br',name:'Nuclear Accident',         icon:'☢️',type:'s-inner-diag',cardRef:'Nuclear Accident'},
  {id:'BR3',dir:'br',name:'Golden Pollination Season',icon:'🌸',type:'s-inner-diag',cardRef:'Golden Pollination Season'},
  {id:'BR4',dir:'br',name:'Sea Turtle Beach',         icon:'🐢',type:'s-inner-diag',cardRef:'Sea Turtle Beach'},
  {id:'BR5',dir:'br',name:'Plastic-Eating Bacteria',  icon:'🦠',type:'s-inner-diag',cardRef:'Plastic-Eating Bacteria'},
  {id:'BR6',dir:'br',name:'Climate Change',           icon:'🌡️',type:'s-inner-diag',cardRef:'Climate Change'},
  {id:'BR7',dir:'br',name:'Blue Whales Return',       icon:'🐋',type:'s-inner-diag',cardRef:'Blue Whales Return'},
  // DIAGONAL BOTTOM-LEFT (7 spaces)
  {id:'BL1',dir:'bl',name:'Firefly Night',         icon:'✨',type:'s-inner-diag',cardRef:'Firefly Night'},
  {id:'BL2',dir:'bl',name:'Financial Crisis',      icon:'📉',type:'s-inner-diag',cardRef:'Financial Crisis'},
  {id:'BL3',dir:'bl',name:'Biodiversity Jackpot',  icon:'🏆',type:'s-inner-diag',cardRef:'Biodiversity Jackpot'},
  {id:'BL4',dir:'bl',name:'Climate Summit Dilemma',icon:'🌏',type:'s-inner-diag',cardRef:'Climate Summit Dilemma'},
  {id:'BL5',dir:'bl',name:'Beehive Fence Success', icon:'🐝',type:'s-inner-diag',cardRef:'Beehive Fence Success'},
  {id:'BL6',dir:'bl',name:'Water Scarcity',        icon:'💧',type:'s-inner-diag',cardRef:'Water Scarcity'},
  {id:'BL7',dir:'bl',name:'Population',            icon:'🏙️',type:'s-inner-diag',cardRef:'Population Growth'},
  // DIAGONAL TOP-LEFT (7 spaces)
  {id:'TL1',dir:'tl',name:'Waste-to-Energy Plant', icon:'♻️',type:'s-inner-diag',cardRef:'Waste-to-Energy Positive'},
  {id:'TL2',dir:'tl',name:'Cyber Attacks',          icon:'💻',type:'s-inner-diag',cardRef:'Cyber Attacks'},
  {id:'TL3',dir:'tl',name:'Smart Grid Integration', icon:'💡',type:'s-inner-diag',cardRef:'Smart Grid Integration'},
  {id:'TL4',dir:'tl',name:'Wind Energy',            icon:'🌬️',type:'s-inner-diag',cardRef:'Wind Energy Proposal'},
  {id:'TL5',dir:'tl',name:'Coral Reef Restoration', icon:'🐠',type:'s-inner-diag',cardRef:'Coral Reef Restoration'},
  {id:'TL6',dir:'tl',name:'Old Trees',              icon:'🌳',type:'s-inner-diag',cardRef:'Old Trees'},
  {id:'TL7',dir:'tl',name:'Zero-Emission Fleet',    icon:'🚌',type:'s-inner-diag',cardRef:'Zero-Emission Fleet'},
];

/* ================================================================
   CARD DATA — lookup by cardRef
   ================================================================ */
const CARD_DATA = {
  // ---- CRISIS CARDS ----
  'Financial Crisis':    {type:'crisis',icon:'📉',desc:'Markets crash. Investors flee.',effects:{capital:-6,wellbeing:-2}},
  'Government Collapse': {type:'crisis',icon:'🏛️',desc:'Political instability disrupts all services.',effects:{wellbeing:-5,capital:-3}},
  'War':                 {type:'crisis',icon:'⚔️',desc:'Conflict breaks out. Resources devastated.',effects:{capital:-8,wellbeing:-6}},
  'Terrorism':           {type:'crisis',icon:'💣',desc:'Attack damages city infrastructure.',effects:{wellbeing:-4,capital:-4}},
  'Pandemic':            {type:'crisis',icon:'🦠',desc:'A deadly pandemic sweeps the city.',effects:{wellbeing:-8,capital:-3}},
  'Climate Change':      {type:'crisis',icon:'🌡️',desc:'Extreme climate events batter your city.',effects:{globalEco:-5,wellbeing:-3}},
  'Deforestation':       {type:'crisis',icon:'🌲',desc:'Illegal logging destroys nearby forests.',effects:{globalEco:-4,wellbeing:-2}},
  'Pollution Disaster':  {type:'crisis',icon:'🏭',desc:'Industrial accident spills toxins.',effects:{pollution:8,wellbeing:-3}},
  'Famine':              {type:'crisis',icon:'🌾',desc:'Food supplies collapse.',effects:{wellbeing:-6,capital:-3}},
  'Nuclear Accident':    {type:'crisis',icon:'☢️',desc:'Nuclear plant malfunctions.',effects:{pollution:10,globalEco:-6,wellbeing:-5}},
  'Refugee Crisis':      {type:'crisis',icon:'🌊',desc:'Climate refugees overwhelm resources.',effects:{wellbeing:-4,capital:-3}},
  'Cyber Attacks':       {type:'crisis',icon:'💻',desc:'Hackers cripple infrastructure.',effects:{capital:-5,wellbeing:-2}},
  'Grid Attack':         {type:'crisis',icon:'⚡',desc:'Power grid attacked. City goes dark.',effects:{capital:-4,wellbeing:-4}},
  'Nuclear Strike':      {type:'crisis',icon:'💣',desc:'Nuclear threat forces emergency measures.',effects:{capital:-10,wellbeing:-8,globalEco:-5}},
  'Social Inequality':   {type:'crisis',icon:'⚖️',desc:'Rising inequality causes unrest.',effects:{wellbeing:-4,capital:-2}},
  'Water Scarcity':      {type:'crisis',icon:'💧',desc:'Drought hits water supply.',effects:{wellbeing:-3,globalEco:-2}},
  'Oil Spill':           {type:'crisis',icon:'🛢️',desc:'Massive oil spill poisons coastal waters.',effects:{globalEco:-6,wellbeing:-2}},
  'Overfishing':         {type:'crisis',icon:'🐟',desc:'Fish populations collapse.',effects:{globalEco:-3,wellbeing:-2}},
  'Biodiversity Loss':   {type:'crisis',icon:'🦋',desc:'Species after species disappears.',effects:{globalEco:-4}},
  'AI Disruption':       {type:'crisis',icon:'🤖',desc:'Rapid AI causes mass unemployment.',effects:{capital:-3,wellbeing:-4}},
  'Inflation':           {type:'crisis',icon:'📊',desc:'Runaway inflation erodes finances.',effects:{capital:-5,wellbeing:-2}},
  'Innovation Crisis':   {type:'crisis',icon:'🧑‍🔬',desc:'Key researchers leave the city.',effects:{capital:-4}},
  'Chip Shortage':       {type:'crisis',icon:'💾',desc:'Semiconductor shortages disrupt industry.',effects:{capital:-3,wellbeing:-1}},
  'Trust Crisis':        {type:'crisis',icon:'🎭',desc:'Citizens lose faith in leadership.',effects:{wellbeing:-5}},
  'Loneliness Crisis':   {type:'crisis',icon:'😔',desc:'Mass social isolation.',effects:{wellbeing:-4}},
  'Food Security Crisis':{type:'crisis',icon:'🍞',desc:'Food prices soar as chains break.',effects:{wellbeing:-3,capital:-2}},
  'Plastic Pollution':   {type:'crisis',icon:'🧴',desc:'Plastic waste overwhelms environment.',effects:{globalEco:-3,wellbeing:-1}},
  'Desertification':     {type:'crisis',icon:'🏜️',desc:'Topsoil erodes, farmland becomes desert.',effects:{globalEco:-4,capital:-2}},
  // ---- POSITIVE EVENTS ----
  'Economic Boom':              {type:'positive',icon:'📈',desc:'The economy booms — city thrives.',effects:{pollution:-3}},
  'Green Bond Issuance':        {type:'positive',icon:'💵',desc:'Green bonds raise capital.',effects:{capital:3}},
  'Ozone Layer Repaired':       {type:'positive',icon:'🌍',desc:'Scientists confirm ozone layer healing.',effects:{pollution:-1,capital:1}},
  'Carbon Capture Breakthrough':{type:'positive',icon:'🔭',desc:'New carbon capture technology deployed.',effects:{pollution:-2}},
  'Record Harvest':             {type:'positive',icon:'🌾',desc:'Exceptional harvest boosts economy.',effects:{capital:3}},
  'Freshwater Aquifer Discovered':{type:'positive',icon:'💧',desc:'New freshwater aquifer discovered.',effects:{capital:3}},
  'Sustainable City Award':     {type:'positive',icon:'🏆',desc:'Your city wins a sustainability award!',effects:{wellbeing:1,capital:2}},
  'Renewable Breakthrough':     {type:'positive',icon:'⚡',desc:'Breakthrough in renewable energy.',effects:{wellbeing:2}},
  'Philanthropic Donation':     {type:'positive',icon:'🤝',desc:'Wealthy donor funds green projects.',effects:{capital:3}},
  'Engineering Convention':     {type:'positive',icon:'🔬',desc:'Global convention brings investment.',effects:{capital:2,wellbeing:1}},
  'Heritage Restoration':       {type:'positive',icon:'🏛️',desc:'Historic buildings restored.',effects:{wellbeing:2}},
  'University Tech Park':       {type:'positive',icon:'🎓',desc:'New tech park opens.',effects:{capital:1}},
  'Plastic-Eating Bacteria':    {type:'positive',icon:'🦠',desc:'Scientists deploy plastic-eating bacteria.',effects:{capital:1,pollution:-2}},
  'Blue Whales Return':         {type:'positive',icon:'🐋',desc:'Blue whales return to nearby waters.',effects:{pollution:-2}},
  'Beehive Fence Success':      {type:'positive',icon:'🐝',desc:'Beehive fences protect crops and wildlife.',effects:{capital:1,pollution:-1}},
  'Coral Reef Restoration':     {type:'positive',icon:'🐠',desc:'Coral reefs restored.',effects:{pollution:-2}},
  'Zero-Emission Fleet':        {type:'positive',icon:'🚌',desc:'City fleet goes fully electric.',effects:{wellbeing:1,pollution:-1}},
  'Smart Grid Integration':     {type:'positive',icon:'💡',desc:'Smart grid reduces costs.',effects:{capital:1}},
  'Waste-to-Energy Positive':   {type:'positive',icon:'♻️',desc:'Waste converted to energy.',effects:{capital:1,pollution:-1}},
  'Vertical Farm Pilot':        {type:'positive',icon:'🌿',desc:'Vertical farming pilot succeeds.',effects:{capital:1}},
  // ---- WORLD WONDERS ----
  'Planet Regeneration':     {type:'wonder',icon:'🌍',desc:'Nature heals itself: −5 Pollution globally. Cooperation rewarded.',effects:{pollution:-5,globalEco:10},allPlayers:true},
  'Butterfly Storm':         {type:'wonder',icon:'🦋',desc:'Millions of butterflies fill the sky.',effects:{pollution:-5,wellbeing:3,vp:1},allPlayers:true},
  'Symphony of Birds':       {type:'wonder',icon:'🐦',desc:'Hundreds of species begin nesting.',effects:{globalEco:5,wellbeing:2},allPlayers:true},
  'Great Forest Awakening':  {type:'wonder',icon:'🌳',desc:'Ecosystem becomes fully interconnected.',effects:{pollution:-10,globalEco:5},allPlayers:true},
  'Golden Pollination Season':{type:'wonder',icon:'🌸',desc:'Record pollination season transforms the region.',effects:{capital:4,wellbeing:3},allPlayers:true},
  'Firefly Night':           {type:'wonder',icon:'✨',desc:'Millions of fireflies light up the city.',effects:{pollution:-20,land:-1},allPlayers:true},
  'Biodiversity Jackpot':    {type:'wonder',icon:'🏆',desc:'No Pollution Damage for 1 Round.',effects:{vp:2},allPlayers:true},
  // ---- DILEMMAS ----
  'Forest Decision':     {type:'dilemma',icon:'🌲',desc:'A large forest is discovered near your city.',
    options:[{text:'Cut for Timber: +4 Capital, −6 Global Eco',effects:{capital:4,globalEco:-6}},
             {text:'Protect: −6 Echo Pollution (Biodiversity Bonus)',effects:{pollution:-6}},
             {text:'Eco Tourism: +2 Capital, +4 Well-being',effects:{capital:2,wellbeing:4}}]},
  'River Dam':          {type:'dilemma',icon:'🌊',desc:'A major river flows through your city.',
    options:[{text:'Hydroelectric Dam: +5 Capital, −4 Eco',effects:{capital:5,globalEco:-4}},
             {text:'Protect River: +5 Global Eco, +2 WB',effects:{globalEco:5,wellbeing:2}},
             {text:'Small Eco Dam: +3 Capital, −1 Eco',effects:{capital:3,globalEco:-1}}]},
  'Rare Minerals':      {type:'dilemma',icon:'⛰️',desc:'Minerals found in nearby mountains.',
    options:[{text:'Open Mine: +6 Capital, −6 Eco',effects:{capital:6,globalEco:-6}},
             {text:'Regulated Mining: +3 Capital, −2 Eco',effects:{capital:3,globalEco:-2}},
             {text:'Ban Mining: +5 Eco, −3 Capital',effects:{globalEco:5,capital:-3}}]},
  'Energy Demand Spike':{type:'dilemma',icon:'⚡',desc:'Energy demand suddenly surges.',
    options:[{text:'Coal Plant: +6 Capital, −7 Eco',effects:{capital:6,globalEco:-7}},
             {text:'Import Energy: +3 Capital',effects:{capital:3}},
             {text:'Solar Farms: +4 Capital, +4 Eco',effects:{capital:4,globalEco:4}}]},
  'Sea Turtle Beach':   {type:'dilemma',icon:'🐢',desc:'Turtle nesting beach discovered.',
    options:[{text:'Build Resort: +5 Capital, −7 Eco',effects:{capital:5,globalEco:-7}},
             {text:'Protect Nesting: +6 Eco, +2 WB',effects:{globalEco:6,wellbeing:2}},
             {text:'Seasonal Tourism: +3 Capital, +3 Eco',effects:{capital:3,globalEco:3}}]},
  'Desert Expansion':   {type:'dilemma',icon:'🏜️',desc:'Nearby land is becoming desert.',
    options:[{text:'Plant drought-resistant: −5 Eco, −3 Capital',effects:{globalEco:-5,capital:-3}},
             {text:'Solar Energy: −3 Eco, +2 Capital',effects:{globalEco:-3,capital:2}},
             {text:'Ignore: +2 Eco lost, +1 Capital',effects:{globalEco:2,capital:1}}]},
  'Ocean Plastic Cleanup':{type:'dilemma',icon:'🌊',desc:'Plastic waste is harming marine life.',
    options:[{text:'Major Cleanup: −3 Capital, −5 Eco impact',effects:{capital:-3,globalEco:-5}},
             {text:'Limited Cleanup: −2 Eco, −1 Capital',effects:{globalEco:-2,capital:-1}},
             {text:'Ignore: +2 Capital, +4 Eco lost',effects:{capital:2,globalEco:4}}]},
  'Forest Fire Prevention':{type:'dilemma',icon:'🔥',desc:'Authorities propose fire prevention.',
    options:[{text:'Build system: −3 Capital, −4 Eco',effects:{capital:-3,globalEco:-4}},
             {text:'Limited monitoring: −2 Eco, −1 Capital',effects:{globalEco:-2,capital:-1}},
             {text:'Ignore: +2 Capital, +3 Eco lost',effects:{capital:2,globalEco:3}}]},
  'Carbon Capture Project':{type:'dilemma',icon:'🏭',desc:'Scientists propose CO2 capture from factories.',
    options:[{text:'Install carbon capture: −6 Echo, −4 Capital',effects:{pollution:-6,capital:-4}},
             {text:'Limit emissions: −3 Echo, −1 Capital',effects:{pollution:-3,capital:-1}},
             {text:'Ignore: +3 Capital, +5 Echo Pol.',effects:{capital:3,pollution:5}}]},
  'Water Resource Decision':{type:'dilemma',icon:'💧',desc:'Water shortage faces your city.',
    options:[{text:'Build Dam: +3 Resources, +3 Eco',effects:{capital:3,globalEco:3}},
             {text:'Rainwater harvesting: −2 Capital, −3 Eco',effects:{capital:-2,globalEco:-3}},
             {text:'Community gardening: −6 Eco, +4 awareness',effects:{globalEco:-6,wellbeing:4}}]},
  'Climate Refugee Settlement':{type:'dilemma',icon:'🏠',desc:'People displaced by climate disasters arrive.',
    options:[{text:'Build eco housing: −2 Eco, −3 Capital, +3 WB',effects:{globalEco:-2,capital:-3,wellbeing:3}},
             {text:'Temporary shelters: −1 Capital, +1 WB',effects:{capital:-1,wellbeing:1}},
             {text:'Reject: +2 Capital, −3 WB',effects:{capital:2,wellbeing:-3}}]},
  'Climate Summit Dilemma':{type:'dilemma',icon:'🌏',desc:'Your city is invited to an international climate summit.',
    options:[{text:'Aggressive Pact: −6 Eco, −3 Capital',effects:{globalEco:-6,capital:-3}},
             {text:'Moderate Agreement: −3 Eco',effects:{globalEco:-3}},
             {text:'Reject: +2 Capital, −4 WB',effects:{capital:2,wellbeing:-4}}]},
  'Population Growth':  {type:'dilemma',icon:'🏙️',desc:'City population is growing rapidly.',
    options:[{text:'Expand into Green Land: +4 Capital, −5 Eco',effects:{capital:4,globalEco:-5}},
             {text:'High-Density Housing: −2 Eco, +4 Capital',effects:{globalEco:-2,capital:4}},
             {text:'Limit Expansion: −3 WB, −4 Eco',effects:{wellbeing:-3,globalEco:-4}}]},
  'Wind Energy Proposal':{type:'dilemma',icon:'🌬️',desc:'Windy hill near city — wind energy proposed.',
    options:[{text:'Large Wind Farm: +5 Capital, −6 Eco',effects:{capital:5,globalEco:-6}},
             {text:'Small Turbines: −3 Eco, −2 Capital',effects:{globalEco:-3,capital:-2}},
             {text:'Ignore: −2 Eco, −3 Capital',effects:{globalEco:-2,capital:-3}}]},
  'Old Trees':           {type:'dilemma',icon:'🌳',desc:'A 500-year-old tree discovered during construction.',
    options:[{text:'Declare Heritage: save −5 Eco',effects:{globalEco:-5}},
             {text:'Create Learning Site: +3 WB, −3 Eco',effects:{wellbeing:3,globalEco:-3}},
             {text:'Ignore: +2 Capital, +4 Eco lost',effects:{capital:2,globalEco:4}}]},
  'Traffic':             {type:'dilemma',icon:'🚦',desc:'Traffic congestion is increasing.',
    options:[{text:'Build Metro: −4 Capital, +6 WB',effects:{capital:-4,wellbeing:6}},
             {text:'Expand roads: −2 Capital, +3 WB, −3 Eco',effects:{capital:-2,wellbeing:3,globalEco:-3}},
             {text:'Promote cycling: −1 Capital, −5 Eco, +4 WB',effects:{capital:-1,globalEco:-5,wellbeing:4}}]},
  'Mycelium Network':    {type:'dilemma',icon:'🍄',desc:'Scientists discover massive underground mycelium network.',
    options:[{text:'Protect fungal ecosystem: −6 Eco',effects:{globalEco:-6}},
             {text:'Community gardening: −3 Eco, +4 WB',effects:{globalEco:-3,wellbeing:4}},
             {text:'Native plant distribution: −5 Eco',effects:{globalEco:-5}}]},
  'Green Spaces':        {type:'dilemma',icon:'🌳',desc:'Citizens request more green spaces.',
    options:[{text:'Tree planting: −3 Capital, −5 Eco, +3 WB',effects:{capital:-3,globalEco:-5,wellbeing:3}},
             {text:'Small park: −1 Capital, −2 Eco',effects:{capital:-1,globalEco:-2}},
             {text:'Ignore: +1 Capital, −3 WB',effects:{capital:1,wellbeing:-3}}]},
  'Wildlife Conservation':{type:'dilemma',icon:'🐺',desc:'Wildlife habitat is threatened.',
    options:[{text:'Wildlife Sanctuary: −2 Capital, −6 Eco',effects:{capital:-2,globalEco:-6}},
             {text:'Small park: −1 Capital, −2 Eco',effects:{capital:-1,globalEco:-2}},
             {text:'Ignore: +3 Capital, +5 Eco lost',effects:{capital:3,globalEco:5}}]},
  'Seeds':               {type:'dilemma',icon:'🌱',desc:'Botanists organise a native plant seed festival.',
    options:[{text:'Rare seeds exchange: −4 Eco, +3 Biodiversity WB',effects:{globalEco:-4,wellbeing:3}},
             {text:'Community workshops: −6 Eco, +4 awareness',effects:{globalEco:-6,wellbeing:4}},
             {text:'Native plant distribution: −5 Eco',effects:{globalEco:-5}}]},
  'Organic Farming':     {type:'dilemma',icon:'🌾',desc:'Farmers propose switching to organic farming.',
    options:[{text:'Subsidize organic: −3 Capital, −6 Eco',effects:{capital:-3,globalEco:-6}},
             {text:'Partial support: −4 Eco, +3 Capital',effects:{globalEco:-4,capital:3}},
             {text:'Eco Tourism: +2 Capital, +4 WB',effects:{capital:2,wellbeing:4}}]},
  'Maintain Forests':    {type:'dilemma',icon:'🌲',desc:'Communities volunteer to maintain forests.',
    options:[{text:'Training programs: −3 Eco',effects:{globalEco:-3}},
             {text:'Tree guardians: −4 Eco',effects:{globalEco:-4}},
             {text:'Youth forest camps: −3 Eco, +awareness',effects:{globalEco:-3,wellbeing:2}}]},
  'River Fish Collapse': {type:'dilemma',icon:'🐟',desc:'Fish population in the river is declining.',
    options:[{text:'Ban fishing: −5 Eco, −2 Capital',effects:{globalEco:-5,capital:-2}},
             {text:'Limit fishing: −2 Eco, +1 Capital',effects:{globalEco:-2,capital:1}},
             {text:'Continue fishing: +4 Eco lost, +3 Capital',effects:{globalEco:4,capital:3}}]},
  'Rare Plankton':       {type:'dilemma',icon:'🌊',desc:'Rare bioluminescent plankton discovered on the shore.',
    options:[{text:'Protect shoreline: −5 Eco, +2 Biodiversity WB',effects:{globalEco:-5,wellbeing:2}},
             {text:'Night observation areas: −3 Eco, +3 WB',effects:{globalEco:-3,wellbeing:3}},
             {text:'Ignore: +2 Eco lost, +1 Capital',effects:{globalEco:2,capital:1}}]},
  // ---- CHAIN REACTIONS ----
  'Bird Population Growth':  {type:'chain',icon:'🐦',desc:'Bird population increases! Birds eat pests → fewer pesticides → crops grow better.',effects:{capital:-1,globalEco:3},nextRound:{capital:2}},
  'Predator Protection':     {type:'chain',icon:'🐺',desc:'Wolves protected → herbivores decrease → forest grows healthier.',effects:{capital:-2,globalEco:5},nextRound:{globalEco:2}},
  'Excess Fertilizer Damage':{type:'chain',icon:'🌾',desc:'Fertilizers damage soil → fertility decreases → desertification begins.',effects:{capital:3,globalEco:-4},nextRound:{capital:-2}},
  'Bee Population Decline':  {type:'chain',icon:'🐝',desc:'Pesticides increase → bees die → crops fail → plants disappear.',effects:{capital:2,globalEco:-4},nextRound:{capital:-3}},
  'Forest Destruction Chain':{type:'chain',icon:'🌲',desc:'Forest destroyed → river health drops → fish die → food falls.',effects:{globalEco:-6},nextRound:{capital:-2}},
};

/* ================================================================
   GLOBAL EVENTS WHEEL — 8 segments
   ================================================================ */
const WHEEL_EVENTS = [
  {name:'Climate Summit',color:'#2d7a2d',icon:'🌍',desc:'World leaders meet.',effectText:'All players: Echo −2',
   effect:(players)=>players.forEach(p=>{if(!p.eliminated)p.echoInventory=Math.max(0,p.echoInventory-2)})},
  {name:'Drought',color:'#c87820',icon:'🌵',desc:'Severe drought.',effectText:'All players: WB −2',
   effect:(players)=>players.forEach(p=>{if(!p.eliminated)p.wellbeing=Math.max(0,p.wellbeing-2)})},
  {name:'Green Revolution',color:'#1a7a2d',icon:'🌿',desc:'Green wave sweeps globe.',effectText:'Global Eco +3',
   effect:(players,G)=>{G.globalEco=Math.min(100,G.globalEco+3)}},
  {name:'Industrial Boom',color:'#5a4030',icon:'🏭',desc:'Industrial surge.',effectText:'All: +3 Capital, +3 Echo Pol.',
   effect:(players)=>players.forEach(p=>{if(!p.eliminated){p.capital+=3;p.echoInventory+=3}})},
  {name:'Pollution Crisis',color:'#c83820',icon:'☣️',desc:'Global pollution crisis.',effectText:'All players: +5 Pollution',
   effect:(players)=>players.forEach(p=>{if(!p.eliminated)p.pollution+=5})},
  {name:'Eco Funding',color:'#1a8a4a',icon:'💵',desc:'International eco fund.',effectText:'All players: +4 Capital',
   effect:(players)=>players.forEach(p=>{if(!p.eliminated)p.capital+=4})},
  {name:'Market Crash',color:'#8a1a1a',icon:'📉',desc:'Markets crash worldwide.',effectText:'All players: −4 Capital',
   effect:(players)=>players.forEach(p=>{if(!p.eliminated)p.capital=Math.max(0,p.capital-4)})},
  {name:'Tech Advance',color:'#2a5a8a',icon:'🚀',desc:'Tech breakthrough.',effectText:'All: +2 Capital, +2 WB',
   effect:(players)=>players.forEach(p=>{if(!p.eliminated){p.capital+=2;p.wellbeing+=2}})},
];

/* ================================================================
   SET BONUSES
   ================================================================ */
const SET_BONUSES = {
  eco:       {label:'🌱 Eco Bonus',      fn:(p)=>{p.echoInventory=Math.max(0,p.echoInventory-1)}},
  transport: {label:'🚇 Transport Bonus',fn:(p)=>{p.capital+=1}},
  community: {label:'📚 Community Bonus',fn:(p)=>{p.wellbeing+=1}},
  health:    {label:'🏃 Health Bonus',   fn:(p)=>{p.wellbeing+=1}},
  safety:    {label:'🚨 Safety Bonus',   fn:(p)=>{p.capital+=1}},
  industry:  {label:'🏭 Industry Bonus', fn:(p)=>{p.capital+=1}},
};

/* ================================================================
   RULES HTML
   ================================================================ */
const RULES_HTML = `
<h3>🎯 Objective</h3>
<p>You are a city planner. Build a thriving city while managing resources and protecting the global environment. First to <strong>30 Victory Points</strong> wins.</p>
<h3>📊 The Four Resources</h3>
<ul>
  <li><strong>💰 Capital</strong> — Money. If reaches 0 → eliminated.</li>
  <li><strong>😊 Well-being</strong> — Public happiness. If reaches 0 → eliminated.</li>
  <li><strong>💨 Pollution</strong> — Harmful. If reaches 100 → eliminated.</li>
  <li><strong>🏆 Victory Points</strong> — Reach 30 to win.</li>
</ul>
<h3>🗺 Board Layout (Blueprint)</h3>
<ul>
  <li><strong>Outer Loop:</strong> 80 spaces — 4 corners + 4 sides of 19 spaces. Side 1: Heavy Industry. Side 2: Tech/Green. Side 3: Community/Health. Side 4: Safety/Dilemmas/Chains.</li>
  <li><strong>Center Lines:</strong> 52 inner spaces — 4 orthogonal (6 each) + 4 diagonal (7 each). Contains all Crisis cards, Dilemmas, Wonders, and positive events.</li>
  <li><strong>Center Hub:</strong> Global Eco Hub — land here exactly for big rewards.</li>
</ul>
<h3>🔄 Turn Structure (10 Phases)</h3>
<ul>
  <li><strong>1. Roll Dice</strong> — 2d6, add for Total Roll.</li>
  <li><strong>2. Echo Release</strong> — Release up to Total Roll from Echo Inventory to Personal Pollution. <strong>Doubles = Clean Roll: remove 2 from Echo permanently instead.</strong></li>
  <li><strong>3. Movement</strong> — Move forward on outer loop. Pass Start = +2 Capital. Land on intersection → may enter inner path. Must land EXACTLY on center.</li>
  <li><strong>4. Set Bonuses</strong> — Applied every turn for completed sets.</li>
  <li><strong>5. Resolve Space</strong> — Draw and apply card for space type.</li>
  <li><strong>6. Optional Building</strong> — Pay Capital + Land. Earn Echo pollution. Complete 3 in category = Set + 1 VP.</li>
  <li><strong>7. Production</strong> — Collect benefits from all buildings each turn.</li>
  <li><strong>8. Threshold Check</strong> — Pollution ≥ 100 / Capital = 0 / WB = 0 → eliminated.</li>
  <li><strong>9. Global Events Wheel</strong> — Spin affects ALL players simultaneously.</li>
  <li><strong>10. End of Turn</strong> — After last player: Global Eco Decay = ceil(avg personal pollution). If Eco reaches 0: all −1VP, reset to 50.</li>
</ul>
<h3>🌿 Echo System</h3>
<p>Echo Inventory holds pollution before it affects you. Buildings add echo; dice roll releases it. <strong>Doubles = Clean Roll:</strong> remove 2 from echo permanently, no release.</p>
<h3>🎯 Center Hub Rewards</h3>
<p>Land exactly: +2 Capital, +2 WB, −1 Pollution, +1 Global Eco, free Building Card. Every <strong>2nd visit</strong> = +1 VP.</p>
`;
