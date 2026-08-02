import Dexie from 'dexie';

export const db = new Dexie('FloodGuardDB');

// Define database schema
db.version(1).stores({
  districtPredictions: 'id, name, riskScore, impactScore, severity, lastUpdated',
  alertLogs: '++id, districtId, districtName, level, smsText, recipientCount, timestamp, status',
  mapCache: 'districtId, wards, routes, camps, hospitals, timestamp'
});

// Cache all district data locally to IndexedDB
export async function saveDistrictsToIndexedDB(districts) {
  try {
    const items = Object.values(districts).map(d => ({
      id: d.id,
      name: d.name,
      riskScore: d.riskScore,
      impactScore: d.impactScore,
      impactLevel: d.impactLevel,
      severity: d.severity,
      explanation: d.explanation,
      populationAtRisk: d.populationAtRisk,
      expectedHours: d.expectedHours,
      confidence: d.confidence,
      wards: d.wards,
      safeRoute: d.safeRoute,
      avoidRoad: d.avoidRoad,
      nearestCamp: d.nearestCamp,
      lastUpdated: new Date().toISOString()
    }));
    await db.districtPredictions.bulkPut(items);
  } catch (err) {
    console.warn('IndexedDB saveDistricts error:', err);
  }
}

// Get cached districts from IndexedDB
export async function getDistrictsFromIndexedDB() {
  try {
    const items = await db.districtPredictions.toArray();
    return items;
  } catch (err) {
    console.warn('IndexedDB getDistricts error:', err);
    return [];
  }
}

// Log SMS Alert sent to IndexedDB
export async function logAlertToIndexedDB(alertData) {
  try {
    await db.alertLogs.add({
      ...alertData,
      timestamp: alertData.timestamp || new Date().toISOString()
    });
  } catch (err) {
    console.warn('IndexedDB logAlert error:', err);
  }
}

// Get Alert Logs from IndexedDB
export async function getAlertLogsFromIndexedDB() {
  try {
    return await db.alertLogs.orderBy('id').reverse().toArray();
  } catch (err) {
    console.warn('IndexedDB getAlertLogs error:', err);
    return [];
  }
}

// Cache GIS map layers for offline use
export async function cacheMapLayersToIndexedDB(districtId, mapData) {
  try {
    await db.mapCache.put({
      districtId,
      ...mapData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.warn('IndexedDB mapCache error:', err);
  }
}

export async function getCachedMapLayers(districtId) {
  try {
    return await db.mapCache.get(districtId);
  } catch (err) {
    console.warn('IndexedDB getCachedMapLayers error:', err);
    return null;
  }
}
