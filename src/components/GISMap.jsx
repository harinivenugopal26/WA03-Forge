import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  CircleMarker,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Shield,
  Navigation,
  Hospital,
  Home,
  AlertTriangle,
  Compass,
  CheckCircle2,
  PhoneCall,
  WifiOff,
  Layers
} from 'lucide-react';

// Custom Leaflet DivIcons to ensure offline visual reliability without remote image dependencies
const createDivIcon = (type, label) => {
  let bgColor = '#3b82f6';
  let iconText = '⛺';
  if (type === 'hospital') {
    bgColor = '#ef4444';
    iconText = '🏥';
  } else if (type === 'assembly') {
    bgColor = '#eab308';
    iconText = '⛰️';
  } else if (type === 'hazard') {
    bgColor = '#dc2626';
    iconText = '⚠️';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: justify;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.6);
        border: 2px solid white;
      ">
        ${iconText}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component to dynamically re-center map view when district changes
function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 12, { animate: true });
    }
  }, [coords, map]);
  return null;
}

export default function GISMap({ districts, selectedDistrictId, networkMode, onSelectCamp }) {
  const district = districts[selectedDistrictId] || districts.cuddalore;

  // Selected map layer filters
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [showBadRoads, setShowBadRoads] = useState(true);
  const [showSafeRoutes, setShowSafeRoutes] = useState(true);
  const [showCamps, setShowCamps] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);

  // Selected Pin Detail Popup State
  const [selectedPinDetail, setSelectedPinDetail] = useState(null);

  // Cuddalore specific GIS geometry details
  const cuddaloreCenter = [11.7480, 79.7714];

  // Flood Ward Polygon Coordinates (Wards 3, 7, 11)
  const floodWardPolygons = [
    // Ward 7 - High Inundation Zone (Near Pennaiyar River)
    [
      [11.7580, 79.7600],
      [11.7650, 79.7800],
      [11.7450, 79.7900],
      [11.7380, 79.7650]
    ],
    // Ward 3 - Gadilam River Overflow Zone
    [
      [11.7300, 79.7400],
      [11.7400, 79.7550],
      [11.7250, 79.7680],
      [11.7180, 79.7450]
    ],
    // Ward 11 - Coastal Lowland Zone
    [
      [11.7600, 79.7850],
      [11.7720, 79.7980],
      [11.7550, 79.8050],
      [11.7480, 79.7900]
    ]
  ];

  // Red Flood Prone Road (NH32 Underpass)
  const badRoadPolyline = [
    [11.7350, 79.7500],
    [11.7420, 79.7620],
    [11.7500, 79.7700],
    [11.7580, 79.7780]
  ];

  // Green Safe Evacuation Route (SH45 North to Panruti High Ground)
  const safeRoutePolyline = [
    [11.7450, 79.7550],
    [11.7550, 79.7400],
    [11.7700, 79.7200],
    [11.7850, 79.7000]
  ];

  // GIS Markers (Camps, Hospitals, Assembly Points)
  const gisMarkers = [
    {
      id: 'camp-1',
      type: 'camp',
      name: 'GHS Panruti School Relief Camp',
      address: 'Main Road, Panruti High Ground, Ward 1',
      coords: [11.7850, 79.7000],
      distance: '1.8 km',
      capacityStatus: '65% Full (340 / 500 beds occupied)',
      foodWater: 'Sufficient (72h supply)',
      contact: '+91 4142 220199',
      isPrimary: true
    },
    {
      id: 'camp-2',
      type: 'camp',
      name: 'St. Joseph Community Shelter',
      address: 'Beach Road Extension, Cuddalore',
      coords: [11.7320, 79.7800],
      distance: '3.4 km',
      capacityStatus: '40% Full (200 / 500 beds occupied)',
      foodWater: 'Sufficient',
      contact: '+91 4142 220455',
      isPrimary: false
    },
    {
      id: 'hosp-1',
      type: 'hospital',
      name: 'Cuddalore Government General Hospital',
      address: 'Hospital Road, Cuddalore Ward 7',
      coords: [11.7510, 79.7650],
      distance: '1.2 km',
      emergencyBeds: '45 ICU Beds Reserved for Flood Evacuees',
      contact: '+91 4142 221200',
      status: 'CRITICAL ZONE — Ground Floor Sandbagged'
    },
    {
      id: 'assembly-1',
      type: 'assembly',
      name: 'Panruti Elevated Water Tank Assembly Point',
      address: 'High Ground Hillock, Ward 2',
      coords: [11.7750, 79.7150],
      distance: '2.1 km',
      elevation: '42 meters above sea level (Flood Safe)',
      capacityStatus: 'Open Assembly Field'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Module Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#151C2C] to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              MODULE 3: Offline GIS Evacuation & Navigation System
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pre-computed routes and map tiles are cached to <strong className="text-emerald-400">IndexedDB & Cache API</strong> when Risk Score &gt; 50.
          </p>
        </div>

        {/* Offline Cache Indicator Badge */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Map Layers Cached Offline (IndexedDB)
          </span>
        </div>
      </div>

      {/* Main Map & Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left GIS Leaflet Map (8 Cols) */}
        <div className="lg:col-span-8 bg-[#151C2C] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4 relative">
          
          {/* Map Filter Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              GIS Layers:
            </span>

            <div className="flex flex-wrap items-center gap-2 font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer bg-red-950/40 text-red-300 px-2.5 py-1 rounded border border-red-900/50">
                <input type="checkbox" checked={showFloodZones} onChange={() => setShowFloodZones(!showFloodZones)} className="accent-red-500" />
                <span>Flood Wards (Red)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer bg-red-950/40 text-red-400 px-2.5 py-1 rounded border border-red-900/50">
                <input type="checkbox" checked={showBadRoads} onChange={() => setShowBadRoads(!showBadRoads)} className="accent-red-500" />
                <span>Avoid Roads (Red Line)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer bg-emerald-950/40 text-emerald-300 px-2.5 py-1 rounded border border-emerald-900/50">
                <input type="checkbox" checked={showSafeRoutes} onChange={() => setShowSafeRoutes(!showSafeRoutes)} className="accent-emerald-500" />
                <span>Safe Routes (Green)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer bg-blue-950/40 text-blue-300 px-2.5 py-1 rounded border border-blue-900/50">
                <input type="checkbox" checked={showCamps} onChange={() => setShowCamps(!showCamps)} className="accent-blue-500" />
                <span>Camps ⛺</span>
              </label>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div className="w-full h-[480px] rounded-xl overflow-hidden border border-slate-800 relative z-10">
            <MapContainer
              center={cuddaloreCenter}
              zoom={12}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <MapRecenter coords={cuddaloreCenter} />

              {/* Standard OpenStreetMap TileLayer with dark filter */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Red Polygon Overlays = Flood Zones (Affected Wards 3, 7, 11) */}
              {showFloodZones && floodWardPolygons.map((poly, idx) => (
                <Polygon
                  key={`ward-${idx}`}
                  positions={poly}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#dc2626',
                    fillOpacity: 0.45,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans">
                      <strong className="text-red-400 text-xs block">FLOOD INUNDATION ZONE — WARD {idx === 0 ? 7 : idx === 1 ? 3 : 11}</strong>
                      <p className="text-[11px] text-slate-300 mt-1">Water Depth: 1.2m – 1.8m expected within 8 hours. Evacuate immediately.</p>
                    </div>
                  </Popup>
                </Polygon>
              ))}

              {/* Red Polyline = Historically Flood-Prone Road to Avoid (NH32 Underpass) */}
              {showBadRoads && (
                <Polyline
                  positions={badRoadPolyline}
                  pathOptions={{
                    color: '#ef4444',
                    weight: 5,
                    dashArray: '8 8',
                    opacity: 0.9
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans">
                      <strong className="text-red-400 text-xs block">ROAD TO AVOID: NH32 UNDERPASS</strong>
                      <p className="text-[11px] text-slate-300 mt-1">Submerged railway underpass. High waterlogging risk.</p>
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Green Polyline = Safe Evacuation Route (SH45 North to Panruti High Ground) */}
              {showSafeRoutes && (
                <Polyline
                  positions={safeRoutePolyline}
                  pathOptions={{
                    color: '#10b981',
                    weight: 6,
                    opacity: 0.95
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans">
                      <strong className="text-emerald-400 text-xs block font-bold">RECOMMENDED SAFE ROUTE: SH45 NORTH</strong>
                      <p className="text-[11px] text-slate-300 mt-1">Clear high-ground elevated bypass to Panruti Relief Camp.</p>
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Interactive GIS Markers */}
              {gisMarkers.map((marker) => {
                if (marker.type === 'camp' && !showCamps) return null;
                if (marker.type === 'hospital' && !showHospitals) return null;

                return (
                  <Marker
                    key={marker.id}
                    position={marker.coords}
                    icon={createDivIcon(marker.type, marker.name)}
                    eventHandlers={{
                      click: () => {
                        setSelectedPinDetail(marker);
                        if (onSelectCamp && marker.type === 'camp') {
                          onSelectCamp(marker);
                        }
                      }
                    }}
                  >
                    <Popup>
                      <div className="p-2 font-sans max-w-xs space-y-1">
                        <strong className="text-white text-xs font-bold block">{marker.name}</strong>
                        <p className="text-[11px] text-slate-300">{marker.address}</p>
                        <div className="pt-1 text-[11px] text-emerald-400 font-semibold flex items-center justify-between">
                          <span>Dist: {marker.distance}</span>
                          <span>{marker.capacityStatus}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            </MapContainer>

            {/* Offline Badge Overlay on Map */}
            {networkMode === 'OFFLINE' && (
              <div className="absolute top-3 right-3 bg-red-950/90 border border-red-500/60 text-white px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-2xl flex items-center gap-2 z-20">
                <WifiOff className="w-4 h-4 text-red-400" />
                <span>OFFLINE GIS MAP MODE — SERVED FROM INDEXEDDB CACHE</span>
              </div>
            )}
          </div>
        </div>

        {/* Right GIS Detail Inspector (4 Cols) */}
        <div className="lg:col-span-4 bg-[#151C2C] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-400" />
              Evacuation Point & Shelter Inspector
            </h2>
            <p className="text-xs text-slate-400">Tap any map pin to view capacity, route, and contact info</p>
          </div>

          {selectedPinDetail ? (
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 animate-fade-in shadow-inner">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedPinDetail.type === 'camp' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                    selectedPinDetail.type === 'hospital' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  }`}>
                    {selectedPinDetail.type.toUpperCase()} PIN
                  </span>
                  <h3 className="text-base font-black text-white mt-1 leading-tight">{selectedPinDetail.name}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                📍 {selectedPinDetail.address}
              </p>

              <div className="space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Distance from user:</span>
                  <strong className="text-emerald-400 text-sm">{selectedPinDetail.distance}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Capacity Status:</span>
                  <strong className="text-white">{selectedPinDetail.capacityStatus || 'Active Shelter'}</strong>
                </div>

                {selectedPinDetail.foodWater && (
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Food & Rations:</span>
                    <strong className="text-blue-400">{selectedPinDetail.foodWater}</strong>
                  </div>
                )}

                {selectedPinDetail.contact && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Emergency Helpline:</span>
                    <strong className="text-amber-300 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5" />
                      {selectedPinDetail.contact}
                    </strong>
                  </div>
                )}
              </div>

              {/* Recommended Navigation Route */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  PRE-COMPUTED SAFE NAVIGATION ROUTE:
                </span>
                <p className="text-xs font-bold text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40 flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>Take SH45 North &rarr; Avoid NH32 Underpass</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl text-center space-y-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-300">Tap Any Map Pin to Inspect</h4>
              <p className="text-xs text-slate-400">
                Default primary camp for Cuddalore demo: <strong className="text-white">GHS Panruti School Relief Camp (1.8km)</strong> on safe route SH45 North.
              </p>
              <button
                onClick={() => setSelectedPinDetail(gisMarkers[0])}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Inspect GHS Panruti Relief Camp
              </button>
            </div>
          )}

          {/* District Evacuation Metadata summary */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">DISTRICT EVACUATION SUMMARY</h4>
            <div className="flex justify-between text-slate-400">
              <span>Primary Safe Route:</span>
              <strong className="text-emerald-400">{district.safeRoute}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Road to Avoid:</span>
              <strong className="text-red-400">{district.avoidRoad}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Wards in Evacuation Zone:</span>
              <strong className="text-white">{district.wards.join(', ')}</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
