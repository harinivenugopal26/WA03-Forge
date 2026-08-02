// FloodGuard AI Data Service & Analytics Engine

export const INITIAL_DISTRICTS = {
  cuddalore: {
    id: 'cuddalore',
    name: 'Cuddalore',
    coords: [11.7480, 79.7714], // Leaflet [lat, lng]
    path: 'M 220,180 L 260,170 L 275,205 L 240,225 L 210,210 Z', // SVG TN Map path representation
    svgPos: { x: 240, y: 195 },
    rainfall48h: 310, // mm
    riverCapacity: 94, // %
    soilMoisture: 88, // %
    historicalIndex: 90, // %
    riskScore: 86,
    severity: 'EVACUATE', // WATCH | WARNING | EVACUATE
    severityColor: 'red',
    expectedHours: '8–14 hours',
    populationAtRisk: 14200,
    popDensityFactor: 1.4,
    hasHospital: true,
    hasSchool: true,
    hospitalName: 'Government General Hospital Cuddalore',
    schoolName: 'GHS Panruti School',
    confidence: 81,
    wards: [3, 7, 11],
    safeRoute: 'SH45 North',
    avoidRoad: 'NH32 (flood-prone underpass)',
    nearestCamp: 'GHS Panruti School (1.8km)',
    explanation: 'High risk due to: 310mm rainfall in 48hrs + river at 94% capacity + saturated soil from prior week\'s rain',
    peakHour: 10,
    phoneCount: 1847
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai',
    coords: [13.0827, 80.2707],
    path: 'M 255,100 L 290,95 L 300,125 L 265,130 Z',
    svgPos: { x: 275, y: 110 },
    rainfall48h: 185,
    riverCapacity: 76,
    soilMoisture: 72,
    historicalIndex: 85,
    riskScore: 68,
    severity: 'WARNING',
    severityColor: 'orange',
    expectedHours: '18–24 hours',
    populationAtRisk: 45000,
    popDensityFactor: 1.8,
    hasHospital: true,
    hasSchool: true,
    hospitalName: 'Rajiv Gandhi Govt General Hospital',
    schoolName: 'Loyola Matric High School',
    confidence: 84,
    wards: [4, 9, 12],
    safeRoute: 'GST Road West bound',
    avoidRoad: 'Velachery Main Road & Kathipara Flyover Underpass',
    nearestCamp: 'St. Thomas Community Center (2.4km)',
    explanation: 'Elevated risk due to: 185mm rainfall in 48hrs + Adyar river at 76% capacity + urban drainage saturation',
    peakHour: 16,
    phoneCount: 5420
  },
  thanjavur: {
    id: 'thanjavur',
    name: 'Thanjavur',
    coords: [10.7870, 79.1378],
    path: 'M 190,215 L 235,210 L 245,245 L 195,250 Z',
    svgPos: { x: 215, y: 230 },
    rainfall48h: 140,
    riverCapacity: 68,
    soilMoisture: 65,
    historicalIndex: 70,
    riskScore: 62,
    severity: 'WARNING',
    severityColor: 'yellow',
    expectedHours: '24–36 hours',
    populationAtRisk: 22000,
    popDensityFactor: 1.2,
    hasHospital: false,
    hasSchool: true,
    hospitalName: 'Rajah Mirasdar Hospital',
    schoolName: 'St. Antony Higher Sec School',
    confidence: 78,
    wards: [2, 5],
    safeRoute: 'Trichy Bypass East',
    avoidRoad: 'Cauvery Riverbed Road',
    nearestCamp: 'Thanjavur Municipal Indoor Stadium (3.1km)',
    explanation: 'Moderate warning due to: 140mm rainfall in 48hrs + Cauvery delta river rise',
    peakHour: 22,
    phoneCount: 2310
  },
  madurai: {
    id: 'madurai',
    name: 'Madurai',
    coords: [9.9252, 78.1198],
    path: 'M 130,260 L 175,255 L 180,290 L 135,295 Z',
    svgPos: { x: 155, y: 275 },
    rainfall48h: 75,
    riverCapacity: 42,
    soilMoisture: 38,
    historicalIndex: 45,
    riskScore: 38,
    severity: 'WATCH',
    severityColor: 'yellow',
    expectedHours: '36–48 hours',
    populationAtRisk: 11500,
    popDensityFactor: 1.1,
    hasHospital: false,
    hasSchool: false,
    hospitalName: 'Grace Kennett Hospital',
    schoolName: 'TV S Sundaram School',
    confidence: 75,
    wards: [1],
    safeRoute: 'Ring Road South',
    avoidRoad: 'Vaigai Riverbank Road',
    nearestCamp: 'Madurai Corporation Marriage Hall (4.0km)',
    explanation: 'Low watch status: 75mm rainfall in 48hrs + Vaigai dam outflow manageable',
    peakHour: 32,
    phoneCount: 1100
  },
  trichy: {
    id: 'trichy',
    name: 'Trichy',
    coords: [10.7905, 78.7047],
    path: 'M 145,210 L 185,205 L 190,240 L 140,245 Z',
    svgPos: { x: 165, y: 225 },
    rainfall48h: 35,
    riverCapacity: 28,
    soilMoisture: 22,
    historicalIndex: 25,
    riskScore: 24,
    severity: 'WATCH',
    severityColor: 'green',
    expectedHours: 'None expected (>48h)',
    populationAtRisk: 8200,
    popDensityFactor: 1.0,
    hasHospital: false,
    hasSchool: false,
    hospitalName: 'KMC Speciality Hospital',
    schoolName: 'National College Higher Sec School',
    confidence: 88,
    wards: [],
    safeRoute: 'Karur Highway West',
    avoidRoad: 'Kollidam Bridge Approach',
    nearestCamp: 'Trichy Central Bus Stand Shelter (5.2km)',
    explanation: 'Normal condition: 35mm rainfall in 48hrs + soil moisture low',
    peakHour: 48,
    phoneCount: 750
  }
};

// Calculate Risk Score from Formula
// Rainfall (40%) + River level (35%) + Soil moisture (15%) + Historical index (10%)
export function calculateRiskScore(rainMM, riverPct, soilPct, histIdx) {
  // Normalize rainMM (0 - 400mm maps to 0-100)
  const rainScore = Math.min(100, (rainMM / 350) * 100);
  const score = (rainScore * 0.40) + (riverPct * 0.35) + (soilPct * 0.15) + (histIdx * 0.10);
  return Math.round(score);
}

// Calculate Impact Score Badge representation
export function calculateImpactScore(riskScore, popAtRisk, popDensityFactor, hasHospital) {
  const infraMultiplier = hasHospital ? 1.3 : 1.0;
  const rawImpact = (riskScore / 100) * popDensityFactor * infraMultiplier;
  
  let label = 'LOW';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
  if (rawImpact > 1.2 || riskScore >= 80) {
    label = 'CRITICAL / HIGH';
    badgeColor = 'bg-red-950/80 text-red-400 border-red-500/50 shadow-lg shadow-red-900/30';
  } else if (rawImpact > 0.8 || riskScore >= 60) {
    label = 'MODERATE';
    badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-500/50';
  }

  const infraText = hasHospital ? '+ 1 hospital' : 'standard infrastructure';
  const detailText = `${popAtRisk.toLocaleString()} people ${infraText} in affected zone`;

  return {
    rawImpact: rawImpact.toFixed(2),
    label,
    badgeColor,
    detailText,
    displayText: `Impact: ${label} — ${detailText}`
  };
}

// Get Severity from Score
export function getSeverityFromScore(score) {
  if (score >= 85) return { severity: 'EVACUATE', color: 'red', textClass: 'text-red-500', bgClass: 'bg-red-500/20 border-red-500/50' };
  if (score >= 75) return { severity: 'WARNING', color: 'orange', textClass: 'text-orange-500', bgClass: 'bg-orange-500/20 border-orange-500/50' };
  if (score >= 60) return { severity: 'WATCH', color: 'yellow', textClass: 'text-yellow-500', bgClass: 'bg-yellow-500/20 border-yellow-500/50' };
  return { severity: 'SAFE / WATCH', color: 'green', textClass: 'text-emerald-500', bgClass: 'bg-emerald-500/20 border-emerald-500/50' };
}

// Generate 72-hour forecast dataset for Recharts line chart
export function generate72HourForecast(baseScore, peakHour = 12) {
  const points = [];
  for (let h = 0; h <= 72; h += 2) {
    // Generate smooth curve peaking near peakHour
    const distFromPeak = Math.abs(h - peakHour);
    let score;
    if (h <= peakHour) {
      score = baseScore - (distFromPeak * 1.8) + (Math.sin(h) * 1.5);
    } else {
      score = baseScore - ((h - peakHour) * 1.1) + (Math.cos(h) * 2);
    }
    score = Math.max(15, Math.min(98, Math.round(score)));

    points.push({
      hour: `H+${h}`,
      hourNum: h,
      score: score,
      yellowThreshold: 60,
      orangeThreshold: 75,
      redThreshold: 85,
      isPeak: h === peakHour
    });
  }
  return points;
}

// Dynamic explanation builder based on input parameters
export function buildExplanationLine(rainMM, riverPct, soilPct) {
  let rainDesc = `${rainMM}mm rainfall in 48hrs`;
  let riverDesc = `river at ${riverPct}% capacity`;
  let soilDesc = soilPct > 80 ? `saturated soil from prior week's rain` : `partially absorbed soil moisture (${soilPct}%)`;

  let riskLevel = 'High risk';
  if (rainMM < 100 && riverPct < 50) riskLevel = 'Low risk';
  else if (rainMM < 200 && riverPct < 75) riskLevel = 'Moderate risk';

  return `${riskLevel} due to: ${rainDesc} + ${riverDesc} + ${soilDesc}`;
}
