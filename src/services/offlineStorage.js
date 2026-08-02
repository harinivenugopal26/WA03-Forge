import localforage from 'localforage';

// Configure IndexedDB instance for FloodGuard AI
const floodStore = localforage.createInstance({
  name: 'FloodGuardAI',
  storeName: 'offline_cache'
});

export const saveDistrictCache = async (districtKey, data) => {
  try {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const payload = {
      ...data,
      cachedAt: timestamp,
      cachedDate: new Date().toISOString()
    };
    await floodStore.setItem(`district_${districtKey}`, payload);
    return payload;
  } catch (err) {
    console.error('IndexedDB Save Error:', err);
    return null;
  }
};

export const getDistrictCache = async (districtKey) => {
  try {
    return await floodStore.getItem(`district_${districtKey}`);
  } catch (err) {
    console.error('IndexedDB Fetch Error:', err);
    return null;
  }
};

export const saveAlertLog = async (alertItem) => {
  try {
    const currentLogs = (await floodStore.getItem('alert_history')) || [];
    const updated = [alertItem, ...currentLogs];
    await floodStore.setItem('alert_history', updated);
    return updated;
  } catch (err) {
    console.error('IndexedDB Alert Log Error:', err);
    return [];
  }
};

export const getAlertLogs = async () => {
  try {
    return (await floodStore.getItem('alert_history')) || [];
  } catch (err) {
    return [];
  }
};

export const cacheAllDistricts = async (districts) => {
  try {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    await floodStore.setItem('all_districts', districts);
    await floodStore.setItem('last_sync_timestamp', timestamp);
    return timestamp;
  } catch (err) {
    console.error('Batch cache error:', err);
  }
};

export const getLastSyncTime = async () => {
  try {
    return (await floodStore.getItem('last_sync_timestamp')) || '11:45 AM';
  } catch (err) {
    return '11:45 AM';
  }
};
