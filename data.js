/* ============================================================
   ECOPOLIS — data.js
   All game data: building cards, event cards, spaces,
   ecological dilemmas, crisis cards, positive events,
   global events wheel, chain reactions, world wonders
   ============================================================ */

// ============================================================
// PLAYER COLORS
// ============================================================
const PLAYER_COLORS = ['#2060c0','#c03020','#20a040','#9020b0'];
const PLAYER_NAMES_DEFAULT = ['Player 1','Player 2','Player 3','Player 4'];

// ============================================================
// BUILDING CARDS — 140 total
// Groups: eco, transport, community, health, safety, industry_heavy,
//         industry_tech, industry_green, industry_energy, industry_food,
//         industry_resource
// Fields: name, icon, cat, group, capital(cost), land(cost),
//         echo(added to echo inventory), wellbeing(production), vp
// Note: "production" runs each turn: {capital, wellbeing, pollution, globalEco}
// ============================================================
const BUILDING_CARDS = [
  // -------- GROUP A: Environmental Health (eco) --------
  { id:'b01', name:'Sewage/Water Filtration', icon:'💧', cat:'eco', group:'Environmental Health',
    cost:{capital:4,land:5}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:1}, vp:1 },
  { id:'b02', name:'Solar Energy Farm', icon:'☀️', cat:'eco', group:'Environmental Health',
    cost:{capital:5,land:6}, echo:0, production:{capital:1,wellbeing:2,pollution:0,globalEco:1}, vp:2 },
  { id:'b03', name:'Waste-to-Energy Plant', icon:'♻️', cat:'eco', group:'Environmental Health',
    cost:{capital:3,land:4}, echo:1, production:{capital:1,wellbeing:2,pollution:0,globalEco:0}, vp:1 },
  { id:'b04', name:'Air Quality Monitoring', icon:'🌬️', cat:'eco', group:'Environmental Health',
    cost:{capital:2,land:3}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:1}, vp:1 },
  { id:'b05', name:'Air Filtration Towers', icon:'🍃', cat:'eco', group:'Environmental Health',
    cost:{capital:3,land:4}, echo:0, production:{capital:0,wellbeing:5,pollution:-1,globalEco:1}, vp:2 },
  { id:'b06', name:'Permeable Pavements', icon:'🌿', cat:'eco', group:'Environmental Health',
    cost:{capital:2,land:4}, echo:0, production:{capital:0,wellbeing:1,pollution:0,globalEco:1}, vp:1 },
  { id:'b07', name:'Hazardous Waste Sites', icon:'☣️', cat:'eco', group:'Environmental Health',
    cost:{capital:2,land:5}, echo:2, production:{capital:0,wellbeing:3,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP B: Transport & Mobility (transport) --------
  { id:'b08', name:'Subways', icon:'🚇', cat:'transport', group:'Transport & Mobility',
    cost:{capital:6,land:4}, echo:0, production:{capital:0,wellbeing:6,pollution:-1,globalEco:0}, vp:2 },
  { id:'b09', name:'Bus Facility', icon:'🚌', cat:'transport', group:'Transport & Mobility',
    cost:{capital:3,land:3}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:0}, vp:1 },
  { id:'b10', name:'EV Hubs', icon:'⚡', cat:'transport', group:'Transport & Mobility',
    cost:{capital:4,land:2}, echo:0, production:{capital:0,wellbeing:4,pollution:-1,globalEco:0}, vp:1 },
  { id:'b11', name:'Bike Lanes', icon:'🚲', cat:'transport', group:'Transport & Mobility',
    cost:{capital:1,land:2}, echo:0, production:{capital:0,wellbeing:3,pollution:0,globalEco:0}, vp:1 },
  { id:'b12', name:'Pedestrian Bridges', icon:'🌉', cat:'transport', group:'Transport & Mobility',
    cost:{capital:2,land:2}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:0}, vp:1 },
  { id:'b13', name:'Traffic Management', icon:'🚦', cat:'transport', group:'Transport & Mobility',
    cost:{capital:2,land:1}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP C: Community & Culture (community) --------
  { id:'b14', name:'Public Libraries', icon:'📚', cat:'community', group:'Community & Culture',
    cost:{capital:3,land:0}, echo:0, production:{capital:0,wellbeing:5,pollution:0,globalEco:0}, vp:1 },
  { id:'b15', name:'Museums', icon:'🏛️', cat:'community', group:'Community & Culture',
    cost:{capital:4,land:1}, echo:0, production:{capital:0,wellbeing:5,pollution:0,globalEco:0}, vp:1 },
  { id:'b16', name:'Theatre/Cinema', icon:'🎭', cat:'community', group:'Community & Culture',
    cost:{capital:2,land:1}, echo:0, production:{capital:0,wellbeing:6,pollution:0,globalEco:0}, vp:1 },
  { id:'b17', name:'Amphitheatres', icon:'🎪', cat:'community', group:'Community & Culture',
    cost:{capital:2,land:0}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:0}, vp:1 },
  { id:'b18', name:'Public Schools', icon:'🏫', cat:'community', group:'Community & Culture',
    cost:{capital:4,land:1}, echo:0, production:{capital:0,wellbeing:6,pollution:0,globalEco:0}, vp:2 },
  { id:'b19', name:'Job Training Schools', icon:'🎓', cat:'community', group:'Community & Culture',
    cost:{capital:5,land:1}, echo:0, production:{capital:0,wellbeing:7,pollution:0,globalEco:0}, vp:2 },
  { id:'b20', name:'Farmers Market', icon:'🥕', cat:'community', group:'Community & Culture',
    cost:{capital:0,land:1}, echo:0, production:{capital:3,wellbeing:4,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP D: Health & Recreation (health) --------
  { id:'b21', name:'Public Health Clinics', icon:'🏥', cat:'health', group:'Health & Recreation',
    cost:{capital:5,land:1}, echo:0, production:{capital:0,wellbeing:7,pollution:0,globalEco:0}, vp:2 },
  { id:'b22', name:'Sports Complex', icon:'⚽', cat:'health', group:'Health & Recreation',
    cost:{capital:4,land:1}, echo:0, production:{capital:0,wellbeing:5,pollution:0,globalEco:0}, vp:1 },
  { id:'b23', name:'Gyms', icon:'🏋️', cat:'health', group:'Health & Recreation',
    cost:{capital:3,land:1}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:0}, vp:1 },
  { id:'b24', name:'Pools', icon:'🏊', cat:'health', group:'Health & Recreation',
    cost:{capital:4,land:0}, echo:0, production:{capital:0,wellbeing:3,pollution:0,globalEco:0}, vp:1 },
  { id:'b25', name:'Dog Parks', icon:'🐕', cat:'health', group:'Health & Recreation',
    cost:{capital:3,land:0}, echo:0, production:{capital:0,wellbeing:5,pollution:0,globalEco:0}, vp:1 },
  { id:'b26', name:'Skating Rink', icon:'⛸️', cat:'health', group:'Health & Recreation',
    cost:{capital:2,land:0}, echo:0, production:{capital:0,wellbeing:5,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP E: Safety & Essential (safety) --------
  { id:'b27', name:'Police', icon:'👮', cat:'safety', group:'Safety & Essential',
    cost:{capital:4,land:1}, echo:0, production:{capital:0,wellbeing:6,pollution:0,globalEco:0}, vp:1 },
  { id:'b28', name:'Fire Brigade', icon:'🚒', cat:'safety', group:'Safety & Essential',
    cost:{capital:5,land:1}, echo:0, production:{capital:0,wellbeing:8,pollution:0,globalEco:0}, vp:2 },
  { id:'b29', name:'Crisis Shelters', icon:'🏠', cat:'safety', group:'Safety & Essential',
    cost:{capital:2,land:1}, echo:0, production:{capital:0,wellbeing:5,pollution:0,globalEco:0}, vp:1 },
  { id:'b30', name:'Homeless Shelters', icon:'🛖', cat:'safety', group:'Safety & Essential',
    cost:{capital:3,land:0}, echo:0, production:{capital:0,wellbeing:4,pollution:0,globalEco:0}, vp:1 },
  { id:'b31', name:'Emergency Sirens', icon:'🚨', cat:'safety', group:'Safety & Essential',
    cost:{capital:1,land:0}, echo:0, production:{capital:0,wellbeing:3,pollution:0,globalEco:0}, vp:1 },
  { id:'b32', name:'Street Lights', icon:'💡', cat:'safety', group:'Safety & Essential',
    cost:{capital:1,land:1}, echo:0, production:{capital:0,wellbeing:2,pollution:0,globalEco:0}, vp:1 },
  { id:'b33', name:'Fountains', icon:'⛲', cat:'safety', group:'Safety & Essential',
    cost:{capital:2,land:0}, echo:0, production:{capital:0,wellbeing:3,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP A INDUSTRY: Heavy Industry & Manufacturing (industry) --------
  { id:'b34', name:'Petrochemical Refineries', icon:'🏭', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:8}, echo:8, production:{capital:8,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b35', name:'Metal Refineries', icon:'⚙️', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:7}, echo:7, production:{capital:7,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b36', name:'Foundries', icon:'🔩', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:6}, echo:6, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b37', name:'Cement', icon:'🏗️', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:4}, echo:4, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b38', name:'Glass Factory', icon:'🪟', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:5}, echo:5, production:{capital:7,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b39', name:'Automobile Plant', icon:'🚗', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:6}, echo:6, production:{capital:8,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b40', name:'Heavy Machinery', icon:'🔧', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:4}, echo:4, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b41', name:'Textile Factory', icon:'🧵', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:2}, echo:2, production:{capital:5,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b42', name:'Consumer Goods', icon:'📦', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:2}, echo:2, production:{capital:4,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b43', name:'Rare Earth Processing', icon:'💎', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:6}, echo:6, production:{capital:9,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b44', name:'Sheet Metal Forming', icon:'🔨', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:2}, echo:2, production:{capital:4,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b45', name:'Ceramics Factory', icon:'🏺', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:2}, echo:2, production:{capital:3,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b46', name:'Machine Tools Industry', icon:'🛠️', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:2}, echo:2, production:{capital:4,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b47', name:'Electronic Industries', icon:'📱', cat:'industry', group:'Heavy Industry',
    cost:{capital:0,land:3}, echo:3, production:{capital:5,wellbeing:0,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP B INDUSTRY: Tech, Finance & Innovation --------
  { id:'b48', name:'Stock Exchange', icon:'📈', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:2}, echo:2, production:{capital:9,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b49', name:'IT Company', icon:'💻', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:2}, echo:2, production:{capital:8,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b50', name:'Data Centers', icon:'🗄️', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:5}, echo:5, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b51', name:'Quantum Hubs', icon:'⚛️', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:3}, echo:3, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b52', name:'Telecom Infrastructure', icon:'📡', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:3}, echo:3, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b53', name:'Semiconductor Fabrication', icon:'🔬', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:5}, echo:5, production:{capital:9,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b54', name:'Tech Incubators', icon:'🚀', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:3}, echo:3, production:{capital:7,wellbeing:0,pollution:0,globalEco:0}, vp:2 },
  { id:'b55', name:'Special Economic Zones', icon:'🏙️', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:5}, echo:5, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b56', name:'Cyber Centers', icon:'🌐', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:3}, echo:3, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b57', name:'Pharmaceuticals', icon:'💊', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:2}, echo:2, production:{capital:4,wellbeing:2,pollution:0,globalEco:0}, vp:1 },
  { id:'b58', name:'Industrial Testing Labs', icon:'🧪', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:2}, echo:2, production:{capital:4,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b59', name:'Vocational Training', icon:'📐', cat:'industry', group:'Tech & Finance',
    cost:{capital:0,land:3}, echo:0, production:{capital:2,wellbeing:3,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP C INDUSTRY: Green Industry --------
  { id:'b60', name:'Bio-Gas Bottling Plants', icon:'🌱', cat:'industry', group:'Green Industry',
    cost:{capital:0,land:0}, echo:0, production:{capital:3,wellbeing:1,pollution:-3,globalEco:1}, vp:2 },
  { id:'b61', name:'Carbon Credit Trading', icon:'💚', cat:'industry', group:'Green Industry',
    cost:{capital:0,land:0}, echo:0, production:{capital:5,wellbeing:0,pollution:-3,globalEco:2}, vp:2 },
  { id:'b62', name:'Sustainable Forestry', icon:'🌲', cat:'industry', group:'Green Industry',
    cost:{capital:0,land:2}, echo:0, production:{capital:3,wellbeing:1,pollution:0,globalEco:2}, vp:1 },
  { id:'b63', name:'Cold Chain Logistics', icon:'❄️', cat:'industry', group:'Green Industry',
    cost:{capital:0,land:1}, echo:1, production:{capital:4,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b64', name:'Agrochemical Hubs', icon:'🌾', cat:'industry', group:'Green Industry',
    cost:{capital:0,land:2}, echo:2, production:{capital:4,wellbeing:0,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP D INDUSTRY: Energy & Power --------
  { id:'b65', name:'Standard Power Plants', icon:'🔌', cat:'industry', group:'Energy & Power',
    cost:{capital:0,land:6}, echo:6, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b66', name:'Nuclear Power Plants', icon:'☢️', cat:'industry', group:'Energy & Power',
    cost:{capital:0,land:5}, echo:5, production:{capital:10,wellbeing:0,pollution:0,globalEco:0}, vp:2 },

  // -------- GROUP E INDUSTRY: Food Industry --------
  { id:'b67', name:'Dairy Processing Plants', icon:'🥛', cat:'industry', group:'Food Industry',
    cost:{capital:0,land:1}, echo:1, production:{capital:5,wellbeing:1,pollution:0,globalEco:0}, vp:1 },
  { id:'b68', name:'Food & Bev Processing', icon:'🍱', cat:'industry', group:'Food Industry',
    cost:{capital:0,land:1}, echo:1, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b69', name:'Construction Sector', icon:'👷', cat:'industry', group:'Food Industry',
    cost:{capital:0,land:6}, echo:6, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b70', name:'Logging (Standard)', icon:'🪓', cat:'industry', group:'Food Industry',
    cost:{capital:0,land:4}, echo:4, production:{capital:3,wellbeing:0,pollution:0,globalEco:-1}, vp:1 },
  { id:'b71', name:'Paper Mills', icon:'📄', cat:'industry', group:'Food Industry',
    cost:{capital:0,land:3}, echo:3, production:{capital:2,wellbeing:0,pollution:0,globalEco:0}, vp:1 },

  // -------- GROUP F INDUSTRY: Resource Extraction --------
  { id:'b72', name:'Quarrying', icon:'⛏️', cat:'industry', group:'Resource Extraction',
    cost:{capital:0,land:6}, echo:6, production:{capital:6,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b73', name:'Heavy Equipment Rental', icon:'🚜', cat:'industry', group:'Resource Extraction',
    cost:{capital:0,land:3}, echo:3, production:{capital:7,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b74', name:'Inland Container Depots', icon:'🏪', cat:'industry', group:'Resource Extraction',
    cost:{capital:0,land:1}, echo:1, production:{capital:3,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
  { id:'b75', name:'Agricultural Machinery', icon:'🌽', cat:'industry', group:'Resource Extraction',
    cost:{capital:0,land:2}, echo:2, production:{capital:4,wellbeing:0,pollution:0,globalEco:0}, vp:1 },
];

// ============================================================
// OUTER LOOP SPACES — 80 spaces
// type: start|eco|well|indus|crisis|event
// ============================================================
const OUTER_SPACES = [
  { id:1,  type:'start',  label:'START',            icon:'★',  tooltip:'Collect 2 Capital each pass!'},
  { id:2,  type:'eco',    label:'Solar Farm',        icon:'☀️'},
  { id:3,  type:'well',   label:'Bus Stop',          icon:'🚌'},
  { id:4,  type:'indus',  label:'Factory',           icon:'🏭'},
  { id:5,  type:'eco',    label:'Park',              icon:'🌳'},
  { id:6,  type:'well',   label:'Hospital',          icon:'🏥'},
  { id:7,  type:'indus',  label:'Market',            icon:'🏪'},
  { id:8,  type:'eco',    label:'Water Plant',       icon:'💧'},
  { id:9,  type:'event',  label:'Event',             icon:'🎲'},
  { id:10, type:'eco',    label:'Recycle',           icon:'♻️'},
  { id:11, type:'crisis', label:'CRISIS!',           icon:'⚠️'},
  { id:12, type:'well',   label:'Library',           icon:'📚'},
  { id:13, type:'indus',  label:'Refinery',          icon:'⚙️'},
  { id:14, type:'eco',    label:'Air Filter',        icon:'🌿'},
  { id:15, type:'well',   label:'Stadium',           icon:'⚽'},
  { id:16, type:'event',  label:'Event',             icon:'🃏'},
  { id:17, type:'indus',  label:'Foundry',           icon:'🔩'},
  { id:18, type:'eco',    label:'Green Bond',        icon:'💚'},
  { id:19, type:'well',   label:'Museum',            icon:'🏛️'},
  { id:20, type:'event',  label:'Event',             icon:'📋'},
  // right side
  { id:21, type:'event',  label:'Event',             icon:'🎲'},
  { id:22, type:'crisis', label:'CRISIS!',           icon:'☣️'},
  { id:23, type:'eco',    label:'Wind Farm',         icon:'🌬️'},
  { id:24, type:'well',   label:'Cinema',            icon:'🎭'},
  { id:25, type:'indus',  label:'Auto Plant',        icon:'🚗'},
  { id:26, type:'eco',    label:'Filtration',        icon:'💧'},
  { id:27, type:'well',   label:'Gym',               icon:'🏋️'},
  { id:28, type:'event',  label:'Event',             icon:'🃏'},
  { id:29, type:'indus',  label:'Rare Earth',        icon:'💎'},
  { id:30, type:'crisis', label:'CRISIS!',           icon:'🌪️'},
  { id:31, type:'eco',    label:'Eco Park',          icon:'🌲'},
  { id:32, type:'well',   label:'Clinic',            icon:'🏥'},
  { id:33, type:'indus',  label:'Metal Ref.',        icon:'⚙️'},
  { id:34, type:'eco',    label:'Tree Plant.',       icon:'🌳'},
  { id:35, type:'well',   label:'School',            icon:'🏫'},
  { id:36, type:'event',  label:'Event',             icon:'📋'},
  { id:37, type:'indus',  label:'Glass Fac.',        icon:'🪟'},
  { id:38, type:'eco',    label:'Perm. Pave.',       icon:'🌿'},
  { id:39, type:'crisis', label:'CRISIS!',           icon:'🚨'},
  { id:40, type:'well',   label:'Dog Park',          icon:'🐕'},
  // bottom side
  { id:41, type:'event',  label:'Event',             icon:'🎲'},
  { id:42, type:'indus',  label:'Factories',         icon:'🏭'},
  { id:43, type:'crisis', label:'CRISIS!',           icon:'💥'},
  { id:44, type:'indus',  label:'Data Center',       icon:'💻'},
  { id:45, type:'well',   label:'EV Hub',            icon:'⚡'},
  { id:46, type:'indus',  label:'Power Plant',       icon:'🔌'},
  { id:47, type:'well',   label:'Shelter',           icon:'🏠'},
  { id:48, type:'event',  label:'Event',             icon:'🃏'},
  { id:49, type:'crisis', label:'CRISIS!',           icon:'☣️'},
  { id:50, type:'well',   label:'Stadium',           icon:'🏟️'},
  { id:51, type:'crisis', label:'CRISIS!',           icon:'⚠️'},
  { id:52, type:'well',   label:'Fire Brigade',      icon:'🚒'},
  { id:53, type:'indus',  label:'Textile Fac.',      icon:'🧵'},
  { id:54, type:'eco',    label:'Solar Farm',        icon:'☀️'},
  { id:55, type:'well',   label:'Amphitheatre',      icon:'🎪'},
  { id:56, type:'event',  label:'Event',             icon:'📋'},
  { id:57, type:'indus',  label:'Refinery',          icon:'⚙️'},
  { id:58, type:'well',   label:'Bike Lane',         icon:'🚲'},
  { id:59, type:'crisis', label:'CRISIS!',           icon:'🌪️'},
  { id:60, type:'eco',    label:'Farmers Mkt.',      icon:'🥕'},
  // left side
  { id:61, type:'event',  label:'Event',             icon:'🎲'},
  { id:62, type:'well',   label:'Subway',            icon:'🚇'},
  { id:63, type:'crisis', label:'CRISIS!',           icon:'☣️'},
  { id:64, type:'eco',    label:'Waste Energy',      icon:'♻️'},
  { id:65, type:'well',   label:'Pool',              icon:'🏊'},
  { id:66, type:'indus',  label:'Petrochem.',        icon:'🏭'},
  { id:67, type:'well',   label:'Skating Rink',      icon:'⛸️'},
  { id:68, type:'event',  label:'Event',             icon:'🃏'},
  { id:69, type:'crisis', label:'CRISIS!',           icon:'🚨'},
  { id:70, type:'eco',    label:'Air Quality',       icon:'🍃'},
  { id:71, type:'eco',    label:'Air Filtration',    icon:'🌬️'},
  { id:72, type:'well',   label:'Job Training',      icon:'🎓'},
  { id:73, type:'indus',  label:'Heavy Mach.',       icon:'⚙️'},
  { id:74, type:'event',  label:'Event',             icon:'📋'},
  { id:75, type:'well',   label:'Traffic Mgt.',      icon:'🚦'},
  { id:76, type:'indus',  label:'Electronics',       icon:'📱'},
  { id:77, type:'well',   label:'Ped. Bridge',       icon:'🌉'},
  { id:78, type:'crisis', label:'CRISIS!',           icon:'💥'},
  { id:79, type:'eco',    label:'EV Station',        icon:'⚡'},
  { id:80, type:'event',  label:'Event',             icon:'🎲'},
];

// Inner path spaces: type 'inner'
// These connect intersections to the center
const INNER_SPACES = [
  // Horizontal left (well-being path): spaces W1-W6
  { id:'W1', label:'Sewage Plant', icon:'💧', type:'inner-eco' },
  { id:'W2', label:'Air Filter',   icon:'🌿', type:'inner-eco' },
  { id:'W3', label:'Green Park',   icon:'🌳', type:'inner-well' },
  { id:'W4', label:'Eco Event',    icon:'🎲', type:'inner-eco' },
  { id:'W5', label:'Energy',       icon:'⚡', type:'inner-eco' },
  // Horizontal right (industry path): I1-I5
  { id:'I1', label:'Foundry',      icon:'🔩', type:'inner-indus' },
  { id:'I2', label:'Refinery',     icon:'⚙️', type:'inner-indus' },
  { id:'I3', label:'Textile',      icon:'🧵', type:'inner-indus' },
  { id:'I4', label:'Tech Hub',     icon:'💻', type:'inner-indus' },
  { id:'I5', label:'Market',       icon:'📈', type:'inner-indus' },
  // Vertical top (eco path): E1-E4
  { id:'E1', label:'Solar Farm',   icon:'☀️', type:'inner-eco' },
  { id:'E2', label:'Water Filter', icon:'💧', type:'inner-eco' },
  { id:'E3', label:'Eco Event',    icon:'🎲', type:'inner-eco' },
  { id:'E4', label:'Wind Farm',    icon:'🌬️', type:'inner-eco' },
  // Vertical bottom (eco/well): E5-E8
  { id:'E5', label:'Recycle',      icon:'♻️', type:'inner-eco' },
  { id:'E6', label:'Health Clin.', icon:'🏥', type:'inner-well' },
  { id:'E7', label:'Eco Event',    icon:'🎲', type:'inner-eco' },
  { id:'E8', label:'Park',         icon:'🌳', type:'inner-well' },
];

// ============================================================
// EVENT CARDS
// Effects: {capital, wellbeing, pollution(to echo), globalEco, vp, land}
// ============================================================
const EVENT_CARDS_OUTER = [
  // Positive events (outer loop)
  {name:'Green Manufacturing Grant',    icon:'🏭', desc:'A government grant encourages factories to go green.',    effects:{pollution:-3},  type:'positive'},
  {name:'Factory Retrofit',             icon:'🔧', desc:'Factories upgrade to reduce emissions.',                  effects:{globalEco:1,pollution:-2}, type:'positive'},
  {name:'Sports Complex Construction',  icon:'⚽', desc:'A new sports complex is built for the community.',        effects:{wellbeing:3},   type:'positive'},
  {name:'Student Club Initiative',      icon:'🎓', desc:'Student clubs drive sustainability awareness.',            effects:{pollution:-2},  type:'positive'},
  {name:'Bicycle Lane Network',         icon:'🚲', desc:'New bike lanes reduce traffic and emissions.',             effects:{wellbeing:1,pollution:-2}, type:'positive'},
  {name:'Electric Vehicle Subsidy',     icon:'⚡', desc:'Citizens switch to electric vehicles.',                   effects:{pollution:-2},  type:'positive'},
  {name:'Bullet Train Proposal',        icon:'🚄', desc:'Proposal for high-speed rail wins public support.',        effects:{capital:1,wellbeing:2}, type:'positive'},
  {name:'Odd-Even Traffic Rule',        icon:'🚗', desc:'Traffic restrictions reduce pollution.',                   effects:{wellbeing:1,pollution:-2}, type:'positive'},
  {name:'Vertical Farm Pilot',          icon:'🌿', desc:'A vertical farming pilot succeeds, boosting food supply.', effects:{capital:1},     type:'positive'},
  {name:'Renewable Energy Transition',  icon:'☀️', desc:'City transitions to renewable energy sources.',            effects:{capital:1,pollution:-2}, type:'positive'},
  {name:'Smart Grid Integration',       icon:'💡', desc:'Smart grid reduces energy waste.',                         effects:{capital:1},     type:'positive'},
  {name:'Public Library Expansion',     icon:'📚', desc:'The public library expands its services.',                 effects:{wellbeing:2},   type:'positive'},
  {name:'Waste-to-Energy Plant',        icon:'♻️', desc:'Waste is converted to energy.',                            effects:{capital:1,pollution:-1}, type:'positive'},
  {name:'Heritage Restoration',        icon:'🏛️', desc:'Historic buildings are restored.',                         effects:{wellbeing:2},   type:'positive'},
  {name:'University Tech Park',         icon:'🎓', desc:'A new tech park opens next to the university.',            effects:{capital:1},     type:'positive'},
  // Positive — global triumphs
  {name:'Ozone Layer Repaired',         icon:'🌍', desc:'Scientists confirm the ozone layer is healing.',           effects:{pollution:-1,capital:1}, type:'positive'},
  {name:'Engineering Convention',       icon:'🔬', desc:'A global engineering convention brings investment.',       effects:{capital:2,wellbeing:1}, type:'positive'},
  {name:'Community Garden',             icon:'🌻', desc:'Community gardens bloom across the city.',                 effects:{capital:1,pollution:-1}, type:'positive'},
  {name:'Youth Leadership Program',     icon:'👶', desc:'Youth take the lead on sustainability.',                   effects:{wellbeing:1},   type:'positive'},
  {name:'Reforestation Success',        icon:'🌲', desc:'A major reforestation project succeeds.',                  effects:{pollution:-3},  type:'positive'},
  {name:'Endangered Species Sighted',   icon:'🦋', desc:'A rare species is spotted in your city!',                 effects:{pollution:-1},  type:'positive'},
  {name:'Renewable Breakthrough',       icon:'⚡', desc:'A breakthrough in renewable energy reaches your city.',    effects:{wellbeing:2},   type:'positive'},
  {name:'Economic Boom',                icon:'📈', desc:'The economy booms — city thrives.',                        effects:{pollution:-3},  type:'positive'},
  {name:'Green Bond Issuance',          icon:'💵', desc:'Green bonds issued, raising capital.',                     effects:{capital:3},     type:'positive'},
  {name:'Philanthropic Donation',       icon:'🤝', desc:'A wealthy donor funds city green projects.',               effects:{capital:3},     type:'positive'},
  {name:'Smart Grid Integration II',    icon:'⚡', desc:'Second-generation smart grid reduces costs.',              effects:{capital:1},     type:'positive'},
  {name:'Sustainable City Award',       icon:'🏆', desc:'Your city wins a sustainability award!',                   effects:{wellbeing:1,capital:2}, type:'positive'},
  {name:'Coral Reef Restoration',       icon:'🐠', desc:'Coral reefs in nearby waters are restored.',               effects:{pollution:-2},  type:'positive'},
  {name:'Plastic-Eating Bacteria',      icon:'🦠', desc:'Scientists deploy plastic-eating bacteria.',               effects:{capital:1,pollution:-2}, type:'positive'},
  {name:'Blue Whales Return',           icon:'🐋', desc:'Blue whales return to nearby waters.',                     effects:{pollution:-2},  type:'positive'},
  {name:'Beehive Fence Success',        icon:'🐝', desc:'Beehive fences protect crops and wildlife.',               effects:{capital:1,pollution:-1}, type:'positive'},
  {name:'Carbon Capture Breakthrough',  icon:'🔭', desc:'New carbon capture technology deployed.',                  effects:{pollution:-2},  type:'positive'},
  {name:'Record Harvest',               icon:'🌾', desc:'Exceptional harvest boosts the economy.',                  effects:{capital:3},     type:'positive'},
  {name:'Car-Free Sunday',              icon:'🚶', desc:'A car-free day improves air quality.',                     effects:{wellbeing:1,pollution:-1}, type:'positive'},
  {name:'Freshwater Aquifer Discovered',icon:'💧', desc:'A new freshwater aquifer discovered nearby.',               effects:{capital:3},     type:'positive'},
  {name:'Zero-Emission Fleet',          icon:'🚌', desc:'City fleet goes fully electric.',                          effects:{wellbeing:1,pollution:-1}, type:'positive'},
];

// ============================================================
// CRISIS CARDS
// ============================================================
const CRISIS_CARDS = [
  {name:'Financial Crisis',    icon:'📉', desc:'Markets crash. Investors flee. Capital drains fast.',                effects:{capital:-6, wellbeing:-2}},
  {name:'Government Collapse', icon:'🏛️', desc:'Political instability disrupts all city services.',                effects:{wellbeing:-5, capital:-3}},
  {name:'War',                 icon:'⚔️', desc:'Conflict breaks out. Resources and well-being devastated.',        effects:{capital:-8, wellbeing:-6}},
  {name:'Terrorism',           icon:'💣', desc:'Terrorist attack damages city infrastructure.',                     effects:{wellbeing:-4, capital:-4}},
  {name:'Pandemic',            icon:'🦠', desc:'A deadly pandemic sweeps the city. Well-being collapses.',          effects:{wellbeing:-8, capital:-3}},
  {name:'Climate Change',      icon:'🌡️', desc:'Extreme climate events batter your city.',                         effects:{globalEco:-5, wellbeing:-3}},
  {name:'Deforestation',       icon:'🌲', desc:'Illegal logging destroys nearby forests.',                          effects:{globalEco:-4, wellbeing:-2}},
  {name:'Pollution Disaster',  icon:'🏭', desc:'A major industrial accident spills toxins across the city.',        effects:{pollution:8, wellbeing:-3}},
  {name:'Famine',              icon:'🌾', desc:'Food supplies collapse. Citizens suffer.',                          effects:{wellbeing:-6, capital:-3}},
  {name:'Nuclear Accident',    icon:'☢️', desc:'A nuclear plant malfunctions. Radiation everywhere.',              effects:{pollution:10, globalEco:-6, wellbeing:-5}},
  {name:'Refugee Crisis',      icon:'🌊', desc:'Climate refugees overwhelm city resources.',                        effects:{wellbeing:-4, capital:-3}},
  {name:'Cyber Attacks',       icon:'💻', desc:'Hackers cripple critical infrastructure.',                          effects:{capital:-5, wellbeing:-2}},
  {name:'Grid Attack',         icon:'⚡', desc:'Power grid attacked. City goes dark.',                              effects:{capital:-4, wellbeing:-4}},
  {name:'Nuclear Strike',      icon:'💣', desc:'Nuclear threat forces costly emergency measures.',                  effects:{capital:-10, wellbeing:-8, globalEco:-5}},
  {name:'Social Inequality',   icon:'⚖️', desc:'Rising inequality causes unrest.',                                 effects:{wellbeing:-4, capital:-2}},
  {name:'Water Scarcity',      icon:'💧', desc:'Drought hits water supply.',                                        effects:{wellbeing:-3, globalEco:-2}},
  {name:'Oil Spill',           icon:'🛢️', desc:'A massive oil spill poisons coastal waters.',                      effects:{globalEco:-6, wellbeing:-2}},
  {name:'Overfishing',         icon:'🐟', desc:'Fish populations collapse from overfishing.',                       effects:{globalEco:-3, wellbeing:-2}},
  {name:'Biodiversity Loss',   icon:'🦋', desc:'Species after species disappears.',                                 effects:{globalEco:-4}},
  {name:'AI Disruption',       icon:'🤖', desc:'Rapid AI deployment causes mass unemployment.',                     effects:{capital:-3, wellbeing:-4}},
  {name:'Inflation',           icon:'📊', desc:'Runaway inflation erodes city finances.',                           effects:{capital:-5, wellbeing:-2}},
  {name:'Innovation Crisis',   icon:'🧑‍🔬', desc:'Key researchers leave the city.',                               effects:{capital:-4}},
  {name:'Chip Shortage',       icon:'💾', desc:'Semiconductor shortages disrupt industry.',                         effects:{capital:-3, wellbeing:-1}},
  {name:'Trust Crisis',        icon:'🎭', desc:'Citizens lose faith in city leadership.',                           effects:{wellbeing:-5}},
  {name:'Loneliness Crisis',   icon:'😔', desc:'Mass social isolation affects well-being.',                         effects:{wellbeing:-4}},
  {name:'Food Security Crisis',icon:'🍞', desc:'Food prices soar as supply chains break.',                          effects:{wellbeing:-3, capital:-2}},
  {name:'Plastic Pollution',   icon:'🧴', desc:'Plastic waste overwhelms environment.',                            effects:{globalEco:-3, wellbeing:-1}},
  {name:'Desertification',     icon:'🏜️', desc:'Topsoil erodes, farmland turns to desert.',                       effects:{globalEco:-4, capital:-2}},
];

// ============================================================
// ECOLOGICAL DILEMMAS
// ============================================================
const DILEMMAS = [
  {
    name: 'Forest Decision', icon: '🌲',
    desc: 'A large forest is discovered near your city. What do you do?',
    options: [
      { text:'▸ Cut for Timber: +4 Capital, −6 Global Eco',       effects:{capital:4, globalEco:-6} },
      { text:'▸ Protect: −6 Echo pollution (Biodiversity bonus)',  effects:{pollution:-6} },
      { text:'▸ Eco Tourism: +2 Capital, +4 Well-being',          effects:{capital:2, wellbeing:4} },
    ]
  },
  {
    name: 'River Dam', icon: '🌊',
    desc: 'A major river flows through your city. A dam has been proposed.',
    options: [
      { text:'▸ Hydroelectric Dam: +5 Capital, −4 Global Eco',    effects:{capital:5, globalEco:-4} },
      { text:'▸ Protect River: +5 Global Eco, +2 Well-being',     effects:{globalEco:5, wellbeing:2} },
      { text:'▸ Small Eco Dam: +3 Capital, −1 Global Eco',        effects:{capital:3, globalEco:-1} },
    ]
  },
  {
    name: 'Rare Minerals', icon: '⛰️',
    desc: 'Valuable minerals have been found in nearby mountains.',
    options: [
      { text:'▸ Open Mine: +6 Capital, −6 Global Eco',            effects:{capital:6, globalEco:-6} },
      { text:'▸ Regulated Mining: +3 Capital, −2 Global Eco',     effects:{capital:3, globalEco:-2} },
      { text:'▸ Ban Mining: +5 Global Eco, −3 Capital',           effects:{globalEco:5, capital:-3} },
    ]
  },
  {
    name: 'Energy Demand Spike', icon: '⚡',
    desc: 'Energy demand suddenly surges. Your city needs power now.',
    options: [
      { text:'▸ Coal Plant: +6 Capital, −7 Global Eco',           effects:{capital:6, globalEco:-7} },
      { text:'▸ Import Energy: +3 Capital, −3 Capital net',       effects:{capital:3} },
      { text:'▸ Solar Farms: +4 Capital, +4 Global Eco',          effects:{capital:4, globalEco:4} },
    ]
  },
  {
    name: 'Sea Turtle Beach', icon: '🐢',
    desc: 'A turtle nesting beach is discovered near your city.',
    options: [
      { text:'▸ Build Resort: +5 Capital, −7 Global Eco',         effects:{capital:5, globalEco:-7} },
      { text:'▸ Protect Nesting: +6 Global Eco, +2 Well-being',   effects:{globalEco:6, wellbeing:2} },
      { text:'▸ Seasonal Tourism: +3 Capital, +3 Global Eco',     effects:{capital:3, globalEco:3} },
    ]
  },
  {
    name: 'Climate Summit', icon: '🌏',
    desc: 'Your city is invited to an international climate summit.',
    options: [
      { text:'▸ Aggressive Pact: −6 Global Eco cost, −3 Capital', effects:{globalEco:-6, capital:-3} },
      { text:'▸ Moderate Agreement: −3 Global Eco impact',        effects:{globalEco:-3} },
      { text:'▸ Reject: +2 Capital, −4 Well-being',               effects:{capital:2, wellbeing:-4} },
    ]
  },
  {
    name: 'Wind Energy Proposal', icon: '🌬️',
    desc: 'A windy hill near the city presents a wind energy opportunity.',
    options: [
      { text:'▸ Large Wind Farm: +5 Capital, −6 Global Eco',      effects:{capital:5, globalEco:-6} },
      { text:'▸ Small Turbines: −3 Global Eco, −2 Capital',       effects:{globalEco:-3, capital:-2} },
      { text:'▸ Ignore Wind Energy: −2 Global Eco, −3 Capital',   effects:{globalEco:-2, capital:-3} },
    ]
  },
  {
    name: 'Population Growth', icon: '🏙️',
    desc: 'City population is growing rapidly. Housing needed.',
    options: [
      { text:'▸ Expand into Green Land: +4 Capital, −5 Global Eco', effects:{capital:4, globalEco:-5} },
      { text:'▸ High-Density Housing: −2 Global Eco, +4 Capital',  effects:{globalEco:-2, capital:4} },
      { text:'▸ Limit Expansion: −3 Well-being, −4 Global Eco',    effects:{wellbeing:-3, globalEco:-4} },
    ]
  },
  {
    name: 'Old Trees', icon: '🌳',
    desc: 'A 500-year-old tree is discovered during construction.',
    options: [
      { text:'▸ Declare Heritage Tree: −5 Global Eco saved',      effects:{globalEco:-5} },
      { text:'▸ Create Learning Site: +3 Well-being, −3 Eco',     effects:{wellbeing:3, globalEco:-3} },
      { text:'▸ Ignore: +2 Capital, +4 Global Eco lost',          effects:{capital:2, globalEco:4} },
    ]
  },
  {
    name: 'Ocean Plastic Cleanup', icon: '🌊',
    desc: 'Plastic waste is harming marine life in nearby oceans.',
    options: [
      { text:'▸ Major Cleanup: −3 Capital, −5 Global Eco impact', effects:{capital:-3, globalEco:-5} },
      { text:'▸ Limited Cleanup: −2 Global Eco, −1 Capital',      effects:{globalEco:-2, capital:-1} },
      { text:'▸ Ignore: +2 Capital, +4 Global Eco lost',          effects:{capital:2, globalEco:4} },
    ]
  },
  {
    name: 'Forest Fire Prevention', icon: '🔥',
    desc: 'Authorities propose a forest fire prevention program.',
    options: [
      { text:'▸ Build fire prevention system: −3 Capital, −4 Eco',effects:{capital:-3, globalEco:-4} },
      { text:'▸ Limited monitoring: −2 Eco, −1 Capital',          effects:{globalEco:-2, capital:-1} },
      { text:'▸ Ignore risk: +2 Capital, +3 Global Eco lost',     effects:{capital:2, globalEco:3} },
    ]
  },
  {
    name: 'Carbon Capture Project', icon: '🏭',
    desc: 'Scientists propose capturing CO2 from factories.',
    options: [
      { text:'▸ Install carbon capture: −6 Pollution, −4 Capital',effects:{pollution:-6, capital:-4} },
      { text:'▸ Limit Factory emissions: −3 Pollution, −1 Capital',effects:{pollution:-3, capital:-1} },
      { text:'▸ Ignore Emissions: +3 Capital, +5 Echo Pollution',  effects:{capital:3, pollution:5} },
    ]
  },
  {
    name: 'Organic Farming', icon: '🌾',
    desc: 'Farmers propose switching to organic farming.',
    options: [
      { text:'▸ Subsidize organic farming: −3 Capital, −6 Eco',   effects:{capital:-3, globalEco:-6} },
      { text:'▸ Protect: −4 Eco, +3 Capital',                     effects:{globalEco:-4, capital:3} },
      { text:'▸ Eco Tourism: +2 Capital, +4 Well-being',          effects:{capital:2, wellbeing:4} },
    ]
  },
  {
    name: 'Climate Refugee Settlement', icon: '🏠',
    desc: 'People displaced by climate disasters arrive seeking shelter.',
    options: [
      { text:'▸ Build eco housing: −2 Eco, −3 Capital, +3 WB',    effects:{globalEco:-2, capital:-3, wellbeing:3} },
      { text:'▸ Temporary shelters: −1 Capital, +1 Well-being',   effects:{capital:-1, wellbeing:1} },
      { text:'▸ Reject settlement: +2 Capital, −3 Well-being',    effects:{capital:2, wellbeing:-3} },
    ]
  },
  {
    name: 'Desert Expansion', icon: '🏜️',
    desc: 'Nearby land is becoming desert due to climate change.',
    options: [
      { text:'▸ Plant drought-resistant plants: −5 Eco, −3 Cap',  effects:{globalEco:-5, capital:-3} },
      { text:'▸ Use land for solar energy: −3 Eco, +2 Capital',   effects:{globalEco:-3, capital:2} },
      { text:'▸ Ignore desertification: +2 Global Eco lost, +1 Cap', effects:{globalEco:2, capital:1} },
    ]
  },
];

// ============================================================
// GLOBAL EVENTS WHEEL — 8 segments
// ============================================================
const WHEEL_EVENTS = [
  {
    name: 'Climate Summit',
    color: '#2d7a2d',
    icon: '🌍',
    desc: 'World leaders meet. All players reduce Echo Inventory by 2.',
    effect: (players) => players.forEach(p => { if(!p.eliminated) p.echoInventory = Math.max(0, p.echoInventory - 2); }),
    effectText: 'All players: Echo Inventory −2'
  },
  {
    name: 'Drought',
    color: '#c87820',
    icon: '🌵',
    desc: 'Severe drought hits all cities. All players lose 2 Well-being.',
    effect: (players) => players.forEach(p => { if(!p.eliminated) p.wellbeing = Math.max(0, p.wellbeing - 2); }),
    effectText: 'All players: Well-being −2'
  },
  {
    name: 'Green Revolution',
    color: '#1a7a2d',
    icon: '🌿',
    desc: 'A green revolution sweeps the globe. All players gain +3 Global Eco.',
    effect: (players, G) => { G.globalEco = Math.min(100, G.globalEco + 3); },
    effectText: 'Global Eco +3'
  },
  {
    name: 'Industrial Boom',
    color: '#5a4030',
    icon: '🏭',
    desc: 'Industrial output surges. All players gain 3 Capital but add 3 Echo Pollution.',
    effect: (players) => players.forEach(p => { if(!p.eliminated){ p.capital += 3; p.echoInventory += 3; } }),
    effectText: 'All players: +3 Capital, +3 Echo Pollution'
  },
  {
    name: 'Pollution Crisis',
    color: '#c83820',
    icon: '☣️',
    desc: 'A global pollution crisis erupts. All players gain 5 Personal Pollution.',
    effect: (players) => players.forEach(p => { if(!p.eliminated) p.pollution += 5; }),
    effectText: 'All players: Pollution +5'
  },
  {
    name: 'Eco Funding',
    color: '#1a8a4a',
    icon: '💵',
    desc: 'International eco fund grants money. All players gain +4 Capital.',
    effect: (players) => players.forEach(p => { if(!p.eliminated) p.capital += 4; }),
    effectText: 'All players: +4 Capital'
  },
  {
    name: 'Market Crash',
    color: '#8a1a1a',
    icon: '📉',
    desc: 'Markets crash worldwide. All players lose 4 Capital.',
    effect: (players) => players.forEach(p => { if(!p.eliminated) p.capital = Math.max(0, p.capital - 4); }),
    effectText: 'All players: −4 Capital'
  },
  {
    name: 'Tech Advance',
    color: '#2a5a8a',
    icon: '🚀',
    desc: 'A technological breakthrough benefits all cities. All players gain +2 Capital, +2 Well-being.',
    effect: (players) => players.forEach(p => { if(!p.eliminated){ p.capital += 2; p.wellbeing += 2; } }),
    effectText: 'All players: +2 Capital, +2 Well-being'
  },
];

// ============================================================
// ECOLOGICAL CHAIN REACTIONS
// ============================================================
const CHAIN_REACTIONS = [
  {
    name: 'Bird Population Growth',
    icon: '🐦',
    desc: 'Bird population increases! Birds eat crop pests → Farmers use fewer pesticides → Crops grow better.',
    triggerText: 'Protect bird habitat: −1 Capital, +3 Global Eco. Next round: +2 Capital (agriculture bonus)',
    effects: { capital: -1, globalEco: 3 },
    nextRound: { capital: 2 }
  },
  {
    name: 'Predator Protection',
    icon: '🐺',
    desc: 'Wolves/big predators are protected → Predator population increases → Herbivores decrease → Forest vegetation grows healthier.',
    triggerText: 'Protect predators: −2 Capital, +5 Global Eco. Next round: +2 Global Eco (forest health)',
    effects: { capital: -2, globalEco: 5 },
    nextRound: { globalEco: 2 }
  },
  {
    name: 'Excess Fertilizer Damage',
    icon: '🌾',
    desc: 'Excess fertilizers damage soil → Soil fertility decreases → Crop yields drop → Desertification begins.',
    triggerText: 'Intensive farming: +3 Capital, −4 Global Eco. Next round: −2 Capital (agriculture loss)',
    effects: { capital: 3, globalEco: -4 },
    nextRound: { capital: -2 }
  },
  {
    name: 'Bee Population Decline',
    icon: '🐝',
    desc: 'Pesticides increase → Bees die → Crops produce less → Flower plants disappear.',
    triggerText: 'Heavy pesticide farming: +2 Capital, −4 Global Eco. Next round: −3 Capital (agriculture output)',
    effects: { capital: 2, globalEco: -4 },
    nextRound: { capital: -3 }
  },
  {
    name: 'Forest Destruction Chain',
    icon: '🌲',
    desc: 'A forest is destroyed → River health decreases → Fish die → Food production falls. One bad action causes multiple consequences.',
    triggerText: 'Cut forest: −6 Global Eco. Next round: −2 Capital (agriculture output)',
    effects: { globalEco: -6 },
    nextRound: { capital: -2 }
  },
];

// ============================================================
// RARE WORLD WONDERS
// ============================================================
const WORLD_WONDERS = [
  {
    name: 'Butterfly Storm',
    icon: '🦋',
    desc: 'Millions of butterflies fill the sky in a breathtaking display.',
    effect: 'All players: −5 Pollution, +3 Well-being, +1 VP',
    effects: { pollution: -5, wellbeing: 3, vp: 1 }
  },
  {
    name: 'Symphony of Birds',
    icon: '🐦',
    desc: 'Hundreds of species begin nesting in a chorus of life.',
    effect: 'All players: +5 Global Eco, +2 Well-being',
    effects: { globalEco: 5, wellbeing: 2 }
  },
  {
    name: 'Great Forest Awakening',
    icon: '🌳',
    desc: 'The ecosystem becomes fully interconnected.',
    effect: 'All players: −10 Personal Pollution, +5 Global Eco',
    effects: { pollution: -10, globalEco: 5 }
  },
  {
    name: 'Golden Pollination Season',
    icon: '🌸',
    desc: 'A record pollination season transforms the entire region.',
    effect: 'All players: +4 Capital, +3 Well-being',
    effects: { capital: 4, wellbeing: 3 }
  },
  {
    name: 'Firefly Night',
    icon: '✨',
    desc: 'Millions of fireflies light up the city at night.',
    effect: 'All players: −20 Pollution instantly, but lose 1 Land',
    effects: { pollution: -20, land: -1 }
  },
  {
    name: 'Biodiversity Jackpot',
    icon: '🏆',
    desc: 'No Pollution Damage for 1 Round for all players.',
    effect: 'All players: No Echo Release next turn, +2 VP',
    effects: { vp: 2 }
  },
  {
    name: 'Planet Regeneration',
    icon: '🌍',
    desc: 'Nature heals itself: −5 Pollution globally. Cooperation rewarded.',
    effect: 'All players: −5 Personal Pollution, Global Eco +10',
    effects: { pollution: -5, globalEco: 10 }
  },
];

// ============================================================
// SET BONUSES (per turn, once you complete a set of 3 cards)
// ============================================================
const SET_BONUSES = {
  eco:       { label:'🌱 Eco Set Bonus',       effect:'Remove 1 Pollution from Echo Inventory', fn: (p) => { p.echoInventory = Math.max(0, p.echoInventory - 1); } },
  transport: { label:'🚇 Transport Set Bonus', effect:'Gain 1 Capital',                          fn: (p) => { p.capital += 1; } },
  community: { label:'📚 Community Set Bonus', effect:'Gain 1 Well-being',                       fn: (p) => { p.wellbeing += 1; } },
  health:    { label:'🏃 Health Set Bonus',    effect:'Gain 1 Well-being',                       fn: (p) => { p.wellbeing += 1; } },
  safety:    { label:'🚨 Safety Set Bonus',    effect:'Gain 1 Capital',                          fn: (p) => { p.capital += 1; } },
  industry:  { label:'🏭 Industry Set Bonus',  effect:'Gain 1 Capital',                          fn: (p) => { p.capital += 1; } },
};

// ============================================================
// RULES TEXT (for Rules screen)
// ============================================================
const RULES_HTML = `
<h3>🎯 Game Objective</h3>
<p>You are a city planner. Your goal is to build a thriving city while managing your resources and protecting the global environment. Every decision has benefits and consequences. Players must balance growth, capital, and environment.</p>

<h3>📊 The Four Personal Points</h3>
<ul>
  <li><strong>💰 Capital</strong> — Money & Investment. Spend to build assets. Earn from markets. <em>If it reaches zero, you lose.</em></li>
  <li><strong>😊 Well-being</strong> — Public Happiness. Built through culture, safety, and recreation. <em>If it reaches zero, you lose.</em></li>
  <li><strong>💨 Pollution</strong> — Affects ecological footprint. Handle it to attract investors. <em>If it reaches 100, you lose.</em></li>
  <li><strong>🏆 Victory Points</strong> — Need to collect these to win. <em>First to 30 VP wins.</em></li>
</ul>

<h3>🛠️ Setup</h3>
<ul>
  <li>Global Eco track starts at 100.</li>
  <li>Each player starts with: 100 Capital, 100 Well-being, 0 Pollution, 100 Land, 0 VP, empty Echo Inventory.</li>
  <li>All tokens placed on Space 1 (Start).</li>
</ul>

<h3>🔄 Turn Structure (10 Phases)</h3>
<ul>
  <li><strong>Phase 1 — Roll Dice:</strong> Roll both dice. Add together for Total Roll.</li>
  <li><strong>Phase 2 — Echo Release:</strong> Before moving, move Total Roll amount of pollution from Echo Inventory to Personal Pollution. If Echo has fewer tokens, move all. If you roll a DOUBLE (Clean Roll): instead of releasing, REMOVE 2 pollution from Echo Inventory permanently.</li>
  <li><strong>Phase 3 — Movement:</strong> Move forward by Total Roll. Passing Start gives +2 Capital. If you land on an intersection, you may enter an inner path. On inner paths you can move in either direction. To reach the center, you must land exactly on it.</li>
  <li><strong>Phase 4 — Set Bonuses:</strong> Eco set → remove 1 Echo pollution. Well-being set → +1 Well-being. Transport set → +1 Capital. Industry set → +1 Capital. Applied every turn.</li>
  <li><strong>Phase 5 — Resolve Space:</strong> Draw and resolve an event card for the space type.</li>
  <li><strong>Phase 6 — Optional Building:</strong> May build one building if you have Capital and Land. Pay the Capital cost. Remove Land pieces. Add Echo value to Echo Inventory. Complete 3 cards in same category → set bonus + 1 VP.</li>
  <li><strong>Phase 7 — Production:</strong> Collect ongoing benefits from all your buildings.</li>
  <li><strong>Phase 8 — Check Thresholds:</strong> Pollution ≥ 100 → eliminated. Capital = 0 → eliminated. Well-being = 0 → eliminated.</li>
  <li><strong>Phase 9 — Global Events Wheel:</strong> Spin the wheel. Effect applies to all players.</li>
  <li><strong>Phase 10 — End of Turn:</strong> Pass dice to next player. After last player: calculate average pollution → subtract from Global Eco (Decay).</li>
</ul>

<h3>🌿 Echo System (Pollution)</h3>
<p>Echo Inventory holds pollution before it affects you. When you build a polluting building, add echo value to inventory. On your next turn, your dice roll releases that much pollution to Personal Pollution. <strong>Clean Roll (doubles):</strong> Remove 2 from Echo Inventory instead of releasing.</p>

<h3>🎯 Center Hub Rewards</h3>
<p>Landing exactly on the center gives: +2 Capital, +2 Well-being, −1 Personal Pollution, +1 Global Eco, one free Building Card. Every <strong>second visit</strong> also gives +1 VP.</p>

<h3>🌍 End of Round — Global Eco Decay</h3>
<p>After all players' turns: sum all personal pollution ÷ number of players (round up) = Decay Amount. Subtract from Global Eco. If Global Eco reaches 0: all players −1 VP, reset Global Eco to 50. Check eliminations.</p>

<h3>🏆 Winning</h3>
<ul>
  <li>Reach <strong>30 Victory Points</strong> — immediate win.</li>
  <li>Only one player remains (others eliminated).</li>
  <li>Global Eco hits zero and all players are eliminated — nobody wins.</li>
</ul>
`;
