// District Data for Tamil Nadu Flood Risk & Evacuation System

export const DISTRICTS = {
  CUDDALORE: {
    id: 'cuddalore',
    name: 'Cuddalore',
    tamilName: 'கடலூர்',
    riskScore: 86,
    severity: 'EVACUATE', // EVACUATE (85-100), WARNING (75-84), WATCH (60-74), SAFE (0-59)
    color: '#ef4444', // Red
    expectedFlood: '8–14 hours',
    affectedWards: ['Ward 3 (Semmandalam)', 'Ward 7 (Tirupapuliyur)', 'Ward 11 (Panruti Rd)'],
    wardNumbers: [3, 7, 11],
    populationAtRisk: 14200,
    confidence: 81,
    safeRoute: 'SH45 North (Panruti Highway)',
    avoidRoad: 'NH32 (Flood-prone underpass near Gadilam river bridge)',
    nearestCamp: 'GHS Panruti School (1.8 km)',
    hospitalsAlerted: 3,
    highGroundPoints: 4,
    center: [11.7480, 79.7714], // [lat, lng]
    zoom: 12,
    
    // Formula breakdown: Rainfall (40%) + River level (35%) + Soil moisture (15%) + Historical index (10%)
    factors: {
      rainfall: { value: '142 mm / 24h', score: 92, weight: 0.40, label: 'Extreme Monsoonal Downpour' },
      riverLevel: { value: '+4.2 m above danger', score: 88, weight: 0.35, label: 'Gadilam & Pennaiyar Overflow' },
      soilMoisture: { value: '94% saturated', score: 80, weight: 0.15, label: 'Complete Soil Saturation' },
      historicalIndex: { value: '8.8 / 10 index', score: 75, weight: 0.10, label: 'High 2015 & 2021 Vulnerability' },
    },

    // 72-Hour Risk Forecast Trend
    forecast72h: Array.from({ length: 72 }, (_, i) => {
      const hour = i + 1;
      let score = 70 + Math.sin(i / 6) * 12 + (i <= 10 ? i * 1.6 : -((i - 10) * 0.7));
      if (i === 9) score = 86; // Hour 10 peak at 86
      score = Math.max(25, Math.min(98, Math.round(score)));
      return {
        hour: `H+${hour}`,
        hourNum: hour,
        score: score,
        rainfall: Math.round(15 + Math.sin(i / 4) * 12 + (i <= 10 ? i * 2.5 : 2)),
        riverLevel: (2.5 + Math.sin(i / 8) * 1.8).toFixed(1),
        thresholdYellow: 60,
        thresholdOrange: 75,
        thresholdRed: 85,
        isPeak: i === 9 // Hour 10 peak
      };
    }),

    // Evacuation GIS layers
    floodZones: [
      {
        id: 'zone-1',
        name: 'Gadilam Riverbank Inundation (Ward 3 & 7)',
        coords: [
          [11.7550, 79.7600],
          [11.7620, 79.7750],
          [11.7500, 79.7850],
          [11.7400, 79.7700],
        ],
        severity: 'Critical (1.5m depth)'
      },
      {
        id: 'zone-2',
        name: 'Lower Panruti Coastal Plain (Ward 11)',
        coords: [
          [11.7350, 79.7400],
          [11.7450, 79.7550],
          [11.7300, 79.7650],
          [11.7200, 79.7500],
        ],
        severity: 'High (0.9m depth)'
      }
    ],

    hazardRoads: [
      {
        id: 'road-hazard-1',
        name: 'NH32 Railway Underpass',
        coords: [
          [11.7450, 79.7650],
          [11.7480, 79.7780],
          [11.7520, 79.7890]
        ],
        status: 'SUBMERGED - DO NOT USE'
      }
    ],

    safeRoutes: [
      {
        id: 'route-safe-1',
        name: 'SH45 North Evacuation Corridor',
        coords: [
          [11.7400, 79.7680],
          [11.7520, 79.7620],
          [11.7650, 79.7550],
          [11.7800, 79.7450]
        ],
        status: 'OPEN & ELEVATED'
      }
    ],

    reliefCamps: [
      {
        id: 'camp-1',
        name: 'GHS Panruti Higher Secondary School',
        address: 'Main Road, Ward 4, Panruti North',
        lat: 11.7720,
        lng: 79.7500,
        distance: '1.8 km',
        capacity: 600,
        occupied: 410,
        facilities: ['Food Counter', 'First Aid Post', 'GenSet Power', 'Clean Water'],
        phone: '+91 4142 220101',
        status: 'OPEN'
      },
      {
        id: 'camp-2',
        name: 'St. Joseph Higher Secondary School',
        address: 'Tirupapuliyur High Road',
        lat: 11.7650,
        lng: 79.7750,
        distance: '3.2 km',
        capacity: 850,
        occupied: 590,
        facilities: ['Medical Center', 'Supply Depot', 'Ambulance Station'],
        phone: '+91 4142 220102',
        status: 'OPEN'
      },
      {
        id: 'camp-3',
        name: 'Cuddalore Town Hall Community Center',
        address: 'Beach Road, New Town',
        lat: 11.7420,
        lng: 79.7820,
        distance: '4.5 km',
        capacity: 500,
        occupied: 490,
        facilities: ['Relief Supplies', 'Helpline Booth'],
        phone: '+91 4142 220103',
        status: 'NEAR CAPACITY'
      }
    ],

    hospitals: [
      {
        id: 'hosp-1',
        name: 'Cuddalore District Government Headquarter Hospital',
        lat: 11.7500,
        lng: 79.7620,
        bedsAvailable: 45,
        traumaUnit: true,
        phone: '108 / 04142-230400'
      },
      {
        id: 'hosp-2',
        name: 'Krishna Urban Health Center',
        lat: 11.7610,
        lng: 79.7680,
        bedsAvailable: 12,
        traumaUnit: false,
        phone: '04142-231122'
      }
    ],

    highGrounds: [
      {
        id: 'hg-1',
        name: 'Panruti Elevated Water Tank Hill',
        lat: 11.7780,
        lng: 79.7420,
        elevation: '+28m above sea level'
      },
      {
        id: 'hg-2',
        name: 'Old Collectorate High Ground Complex',
        lat: 11.7580,
        lng: 79.7540,
        elevation: '+22m above sea level'
      }
    ]
  },

  CHENNAI: {
    id: 'chennai',
    name: 'Chennai',
    tamilName: 'சென்னை',
    riskScore: 45,
    severity: 'WATCH',
    color: '#eab308', // Yellow
    expectedFlood: '24–36 hours',
    affectedWards: ['Ward 142 (Velachery)', 'Ward 170 (Adyar)'],
    wardNumbers: [142, 170],
    populationAtRisk: 42500,
    confidence: 88,
    safeRoute: 'OMR Elevated Corridor',
    avoidRoad: 'Velachery Main Road Underpass',
    nearestCamp: 'Guru Nanak College Camp (2.4 km)',
    hospitalsAlerted: 8,
    highGroundPoints: 6,
    center: [13.0827, 80.2707],
    zoom: 12,
    factors: {
      rainfall: { value: '55 mm / 24h', score: 50, weight: 0.40, label: 'Moderate Coastal Rain' },
      riverLevel: { value: '+1.4 m Adyar river', score: 45, weight: 0.35, label: 'Adyar & Cooum Rising' },
      soilMoisture: { value: '68% saturated', score: 40, weight: 0.15, label: 'Urban Drainage Pressure' },
      historicalIndex: { value: '7.5 / 10 index', score: 35, weight: 0.10, label: 'Velachery Lowland Risk' },
    },
    forecast72h: Array.from({ length: 72 }, (_, i) => ({
      hour: `H+${i + 1}`,
      hourNum: i + 1,
      score: Math.round(40 + Math.sin(i / 5) * 15 + i * 0.2),
      rainfall: Math.round(10 + Math.cos(i / 4) * 8),
      riverLevel: (1.2 + i * 0.02).toFixed(1),
      thresholdYellow: 60,
      thresholdOrange: 75,
      thresholdRed: 85
    })),
    floodZones: [
      {
        id: 'ch-zone-1',
        name: 'Velachery Lake Overflow Zone',
        coords: [[12.975, 80.215], [12.985, 80.230], [12.965, 80.235], [12.960, 80.220]],
        severity: 'Moderate (0.4m depth)'
      }
    ],
    hazardRoads: [{ id: 'ch-h1', name: 'Velachery MRTS Underpass', coords: [[12.978, 80.222], [12.982, 80.225]], status: 'Waterlogging' }],
    safeRoutes: [{ id: 'ch-s1', name: 'OMR Expressway', coords: [[12.970, 80.245], [12.990, 80.250]], status: 'CLEAR' }],
    reliefCamps: [
      { id: 'ch-c1', name: 'Guru Nanak College Camp', address: 'Velachery Bypass', lat: 12.982, lng: 80.220, distance: '2.4 km', capacity: 1200, occupied: 320, facilities: ['Food', 'Shelter', 'Medical'], phone: '044-22451122', status: 'OPEN' }
    ],
    hospitals: [{ id: 'ch-hosp1', name: 'Apollo Speciality Hospital', lat: 12.975, lng: 80.240, bedsAvailable: 120, traumaUnit: true, phone: '1066' }],
    highGrounds: [{ id: 'ch-hg1', name: 'St. Thomas Mount Ridge', lat: 12.995, lng: 80.198, elevation: '+60m' }]
  },

  THANJAVUR: {
    id: 'thanjavur',
    name: 'Thanjavur',
    tamilName: 'தஞ்சாவூர்',
    riskScore: 62,
    severity: 'WATCH',
    color: '#f97316', // Orange
    expectedFlood: '18–24 hours',
    affectedWards: ['Ward 8 (Kaveri Delta)', 'Ward 12 (Thiruvaiyaru Rd)'],
    wardNumbers: [8, 12],
    populationAtRisk: 18900,
    confidence: 84,
    safeRoute: 'Trichy Bypass Elevated Road',
    avoidRoad: 'Vennar River Causeway',
    nearestCamp: 'Raja Serfoji College Camp (2.1 km)',
    hospitalsAlerted: 4,
    highGroundPoints: 3,
    center: [10.7870, 79.1378],
    zoom: 12,
    factors: {
      rainfall: { value: '88 mm / 24h', score: 65, weight: 0.40, label: 'Delta Basin Heavy Rain' },
      riverLevel: { value: '+2.8 m Cauvery/Vennar', score: 68, weight: 0.35, label: 'Grand Anicut Discharge Surge' },
      soilMoisture: { value: '82% saturated', score: 55, weight: 0.15, label: 'Paddy Field Inundation' },
      historicalIndex: { value: '6.2 / 10 index', score: 48, weight: 0.10, label: 'Seasonal Delta Overflow' },
    },
    forecast72h: Array.from({ length: 72 }, (_, i) => ({
      hour: `H+${i + 1}`,
      hourNum: i + 1,
      score: Math.round(55 + Math.sin(i / 7) * 14 + (i > 20 ? -5 : 5)),
      rainfall: Math.round(14 + Math.sin(i / 5) * 10),
      riverLevel: (2.1 + Math.sin(i / 6) * 0.9).toFixed(1),
      thresholdYellow: 60,
      thresholdOrange: 75,
      thresholdRed: 85
    })),
    floodZones: [{ id: 'th-z1', name: 'Vennar River Overflow', coords: [[10.790, 79.130], [10.800, 79.145], [10.780, 79.150]], severity: 'Moderate' }],
    hazardRoads: [{ id: 'th-h1', name: 'Old Vennar Causeway', coords: [[10.792, 79.135], [10.795, 79.140]], status: 'Water Overflow' }],
    safeRoutes: [{ id: 'th-s1', name: 'Trichy-Thanjavur Highway', coords: [[10.775, 79.120], [10.785, 79.135]], status: 'CLEAR' }],
    reliefCamps: [{ id: 'th-c1', name: 'Raja Serfoji College Camp', address: 'College Rd', lat: 10.775, lng: 79.140, distance: '2.1 km', capacity: 700, occupied: 310, facilities: ['Food', 'Power'], phone: '04362-220011', status: 'OPEN' }],
    hospitals: [{ id: 'th-hosp1', name: 'Thanjavur Medical College Hospital', lat: 10.762, lng: 79.115, bedsAvailable: 85, traumaUnit: true, phone: '04362-240001' }],
    highGrounds: [{ id: 'th-hg1', name: 'Thanjavur Palace High Ground', lat: 10.792, lng: 79.138, elevation: '+35m' }]
  },

  MADURAI: {
    id: 'madurai',
    name: 'Madurai',
    tamilName: 'மதுரை',
    riskScore: 31,
    severity: 'WATCH',
    color: '#eab308', // Yellow
    expectedFlood: '36–48 hours',
    affectedWards: ['Ward 22 (Vaigai North Bank)'],
    wardNumbers: [22],
    populationAtRisk: 6200,
    confidence: 89,
    safeRoute: 'Ring Road Bypass',
    avoidRoad: 'Vaigai Low Level Bridge',
    nearestCamp: 'American College Ground Camp (3.5 km)',
    hospitalsAlerted: 2,
    highGroundPoints: 4,
    center: [9.9252, 78.1198],
    zoom: 12,
    factors: {
      rainfall: { value: '28 mm / 24h', score: 30, weight: 0.40, label: 'Light Monsoons' },
      riverLevel: { value: '+0.8 m Vaigai river', score: 35, weight: 0.35, label: 'Vaigai Dam Discharge Moderate' },
      soilMoisture: { value: '45% saturated', score: 25, weight: 0.15, label: 'Dry Soil Absorption' },
      historicalIndex: { value: '4.1 / 10 index', score: 30, weight: 0.10, label: 'Moderate Historic Risk' },
    },
    forecast72h: Array.from({ length: 72 }, (_, i) => ({
      hour: `H+${i + 1}`,
      hourNum: i + 1,
      score: Math.round(28 + Math.sin(i / 8) * 8),
      rainfall: Math.round(5 + Math.sin(i / 6) * 4),
      riverLevel: (0.8 + i * 0.005).toFixed(1),
      thresholdYellow: 60,
      thresholdOrange: 75,
      thresholdRed: 85
    })),
    floodZones: [{ id: 'm-z1', name: 'Vaigai Bank Lowland', coords: [[9.928, 78.115], [9.932, 78.125], [9.922, 78.128]], severity: 'Low' }],
    hazardRoads: [{ id: 'm-h1', name: 'Goripalayam CauseWay', coords: [[9.930, 78.122], [9.932, 78.126]], status: 'MONITORED' }],
    safeRoutes: [{ id: 'm-s1', name: 'Madurai Ring Road', coords: [[9.910, 78.140], [9.940, 78.150]], status: 'CLEAR' }],
    reliefCamps: [{ id: 'm-c1', name: 'American College Ground Camp', address: 'Tallakulam', lat: 9.935, lng: 78.130, distance: '3.5 km', capacity: 900, occupied: 120, facilities: ['Water', 'Shelter'], phone: '0452-2530055', status: 'OPEN' }],
    hospitals: [{ id: 'm-hosp1', name: 'Government Rajaji Hospital', lat: 9.932, lng: 78.128, bedsAvailable: 160, traumaUnit: true, phone: '0452-2532535' }],
    highGrounds: [{ id: 'm-hg1', name: 'Pasumalai High Ridge', lat: 9.890, lng: 78.080, elevation: '+90m' }]
  },

  TRICHY: {
    id: 'trichy',
    name: 'Trichy (Tiruchirappalli)',
    tamilName: 'திருச்சிராப்பள்ளி',
    riskScore: 22,
    severity: 'SAFE',
    color: '#22c55e', // Green
    expectedFlood: 'No Flood Expected',
    affectedWards: [],
    wardNumbers: [],
    populationAtRisk: 0,
    confidence: 94,
    safeRoute: 'All National Highways Open',
    avoidRoad: 'None',
    nearestCamp: 'Trichy Central Bus Stand Camp (Standby)',
    hospitalsAlerted: 1,
    highGroundPoints: 5,
    center: [10.7905, 78.7047],
    zoom: 12,
    factors: {
      rainfall: { value: '12 mm / 24h', score: 18, weight: 0.40, label: 'Normal Showers' },
      riverLevel: { value: 'Normal Flow (Mettur Controlled)', score: 22, weight: 0.35, label: 'Cauvery River Safe' },
      soilMoisture: { value: '38% saturated', score: 20, weight: 0.15, label: 'Normal Dry Soil' },
      historicalIndex: { value: '3.5 / 10 index', score: 25, weight: 0.10, label: 'Low Vulnerability Zone' },
    },
    forecast72h: Array.from({ length: 72 }, (_, i) => ({
      hour: `H+${i + 1}`,
      hourNum: i + 1,
      score: Math.round(20 + Math.sin(i / 10) * 5),
      rainfall: Math.round(3 + Math.sin(i / 5) * 3),
      riverLevel: '0.4',
      thresholdYellow: 60,
      thresholdOrange: 75,
      thresholdRed: 85
    })),
    floodZones: [],
    hazardRoads: [],
    safeRoutes: [{ id: 'tr-s1', name: 'Trichy-Chennai NH45', coords: [[10.790, 78.700], [10.820, 78.720]], status: 'ALL CLEAR' }],
    reliefCamps: [{ id: 'tr-c1', name: 'Trichy Central Relief Hub', address: 'Cantonment', lat: 10.795, lng: 78.690, distance: '1.2 km', capacity: 1500, occupied: 0, facilities: ['Full Emergency Hub'], phone: '0431-2410100', status: 'STANDBY' }],
    hospitals: [{ id: 'tr-hosp1', name: 'MGM Government Hospital', lat: 10.805, lng: 78.685, bedsAvailable: 210, traumaUnit: true, phone: '0431-2401021' }],
    highGrounds: [{ id: 'tr-hg1', name: 'Rockfort Hill Sanctuary', lat: 10.827, lng: 78.697, elevation: '+83m' }]
  }
};

export const SEVERITY_CONFIG = {
  SAFE: {
    label: 'SAFE',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
    gaugeColor: '#22c55e',
    text: 'Normal Situation — Regular Telemetry Active'
  },
  WATCH: {
    label: 'WATCH',
    badgeBg: 'bg-yellow-950/80 border-yellow-500/40 text-yellow-400',
    gaugeColor: '#eab308',
    text: 'Watch Level — Officials Notified, Monitor River Surge'
  },
  WARNING: {
    label: 'WARNING',
    badgeBg: 'bg-orange-950/80 border-orange-500/40 text-orange-400',
    gaugeColor: '#f97316',
    text: 'Warning Level — Volunteer SMS Dispatched, Prepare Shelters'
  },
  EVACUATE: {
    label: 'EVACUATE NOW',
    badgeBg: 'bg-red-950/90 border-red-500/60 text-red-400 animate-pulse',
    gaugeColor: '#ef4444',
    text: 'CRITICAL EMERGENCY — Mass District SMS Blast Active'
  }
};
