export interface SectorDepot {
  id: string;
  name: string;
  shortCode: string;
  lat: number;
  lng: number;
  altitudeFt: number;
  assignedForce: number;
  cluster: 'Munitions & Heavy Shells' | 'Infantry & Extreme Rations' | 'UAV Drone Wings';
  stockLevel: {
    artillery155mm: number;
    winterDieselKL: number;
    dfrlRationsDays: number;
    droneBatteryCells: number;
  };
  predicted30D: {
    artillery155mm: number;
    winterDieselKL: number;
    dfrlRationsDays: number;
    droneBatteryCells: number;
  };
  status: 'OPTIMAL' | 'CRITICAL' | 'JAMMED';
  localMaeHours: number;
  localLoss: number;
  isJammed: boolean;
  isCompromised: boolean;
}

export interface StrategicPass {
  id: string;
  name: string;
  altitudeFt: number;
  lat: number;
  lng: number;
  status: 'OPEN' | 'BLOCKED' | 'ALERT';
  connectedSectors: string;
  annualClosureDays: number;
}

export interface TransitCorridor {
  id: string;
  name: string;
  fromId: string;
  toId: string;
  distanceKm: number;
  transitHours: number;
  transportMode: 'Stallion 10T HMV' | 'Tata 4x4 Light' | 'DRDO 200kg Logistics Drone';
  fuelBurnLiters: number;
  navigabilityPct: number;
  ewThreatLevel: 'LOW' | 'MODERATE' | 'SEVERE';
  coordinates: [number, number][];
}

export const SECTORS: SectorDepot[] = [
  {
    id: 'sec-leh',
    name: '14 Corps Master Logistics Base (Leh)',
    shortCode: 'SEC-1: LEH',
    lat: 34.1526,
    lng: 77.5771,
    altitudeFt: 11562,
    assignedForce: 12500,
    cluster: 'Munitions & Heavy Shells',
    stockLevel: {
      artillery155mm: 4800,
      winterDieselKL: 1450,
      dfrlRationsDays: 120,
      droneBatteryCells: 850
    },
    predicted30D: {
      artillery155mm: 1850,
      winterDieselKL: 620,
      dfrlRationsDays: 30,
      droneBatteryCells: 240
    },
    status: 'OPTIMAL',
    localMaeHours: 1.18,
    localLoss: 0.042,
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'sec-kargil',
    name: '8 Mountain Division Base (Kargil / Drass)',
    shortCode: 'SEC-2: KARGIL',
    lat: 34.5539,
    lng: 76.1349,
    altitudeFt: 8780,
    assignedForce: 6400,
    cluster: 'Infantry & Extreme Rations',
    stockLevel: {
      artillery155mm: 2200,
      winterDieselKL: 820,
      dfrlRationsDays: 75,
      droneBatteryCells: 340
    },
    predicted30D: {
      artillery155mm: 920,
      winterDieselKL: 410,
      dfrlRationsDays: 30,
      droneBatteryCells: 160
    },
    status: 'OPTIMAL',
    localMaeHours: 1.32,
    localLoss: 0.051,
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'sec-nyoma',
    name: '3 Infantry Division Staging Depot (Nyoma / Chushul)',
    shortCode: 'SEC-3: NYOMA',
    lat: 33.1945,
    lng: 78.6653,
    altitudeFt: 13700,
    assignedForce: 8200,
    cluster: 'Munitions & Heavy Shells',
    stockLevel: {
      artillery155mm: 1450,
      winterDieselKL: 410,
      dfrlRationsDays: 38,
      droneBatteryCells: 410
    },
    predicted30D: {
      artillery155mm: 1100,
      winterDieselKL: 380,
      dfrlRationsDays: 30,
      droneBatteryCells: 220
    },
    status: 'OPTIMAL',
    localMaeHours: 1.44,
    localLoss: 0.068,
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'sec-dbo',
    name: 'Sub-Sector North Advance Post (Daulat Beg Oldie - DBO)',
    shortCode: 'SEC-4: DBO',
    lat: 35.4022,
    lng: 77.9314,
    altitudeFt: 16614,
    assignedForce: 2800,
    cluster: 'Infantry & Extreme Rations',
    stockLevel: {
      artillery155mm: 680,
      winterDieselKL: 190,
      dfrlRationsDays: 22,
      droneBatteryCells: 190
    },
    predicted30D: {
      artillery155mm: 520,
      winterDieselKL: 180,
      dfrlRationsDays: 30,
      droneBatteryCells: 130
    },
    status: 'CRITICAL',
    localMaeHours: 1.58,
    localLoss: 0.089,
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'sec-diskit',
    name: 'Nubra Valley Autonomous Drone Hub (Diskit)',
    shortCode: 'SEC-5: DISKIT',
    lat: 34.5428,
    lng: 77.5619,
    altitudeFt: 10315,
    assignedForce: 1900,
    cluster: 'UAV Drone Wings',
    stockLevel: {
      artillery155mm: 410,
      winterDieselKL: 240,
      dfrlRationsDays: 60,
      droneBatteryCells: 780
    },
    predicted30D: {
      artillery155mm: 210,
      winterDieselKL: 160,
      dfrlRationsDays: 30,
      droneBatteryCells: 380
    },
    status: 'OPTIMAL',
    localMaeHours: 1.25,
    localLoss: 0.038,
    isJammed: false,
    isCompromised: false
  }
];

export const PASSES: StrategicPass[] = [
  {
    id: 'pass-zojila',
    name: 'Zojila Pass (NH-1D)',
    altitudeFt: 11578,
    lat: 34.2801,
    lng: 75.5033,
    status: 'OPEN',
    connectedSectors: 'Kargil <-> Srinagar Axis',
    annualClosureDays: 73
  },
  {
    id: 'pass-khardungla',
    name: 'Khardung La',
    altitudeFt: 17982,
    lat: 34.2787,
    lng: 77.6047,
    status: 'ALERT',
    connectedSectors: 'Leh <-> Diskit / Nubra',
    annualClosureDays: 42
  },
  {
    id: 'pass-changla',
    name: 'Chang La',
    altitudeFt: 17590,
    lat: 34.0483,
    lng: 77.9306,
    status: 'OPEN',
    connectedSectors: 'Leh <-> Nyoma / Pangong',
    annualClosureDays: 55
  },
  {
    id: 'pass-sasser',
    name: 'Sasser Pass',
    altitudeFt: 17753,
    lat: 34.9833,
    lng: 77.7833,
    status: 'BLOCKED',
    connectedSectors: 'Diskit <-> DBO Trail',
    annualClosureDays: 180
  }
];

export const CORRIDORS: TransitCorridor[] = [
  {
    id: 'corr-1',
    name: 'NH-1D Western Strategic Trunk',
    fromId: 'sec-leh',
    toId: 'sec-kargil',
    distanceKm: 216,
    transitHours: 5.8,
    transportMode: 'Stallion 10T HMV',
    fuelBurnLiters: 142,
    navigabilityPct: 96.5,
    ewThreatLevel: 'LOW',
    coordinates: [
      [34.1526, 77.5771],
      [34.2250, 77.2000],
      [34.3500, 76.8000],
      [34.4500, 76.4000],
      [34.5539, 76.1349]
    ]
  },
  {
    id: 'corr-2',
    name: 'Upshi-Chumathang High-Altitude Axis',
    fromId: 'sec-leh',
    toId: 'sec-nyoma',
    distanceKm: 182,
    transitHours: 6.2,
    transportMode: 'Tata 4x4 Light',
    fuelBurnLiters: 98,
    navigabilityPct: 88.0,
    ewThreatLevel: 'MODERATE',
    coordinates: [
      [34.1526, 77.5771],
      [33.9500, 77.7500],
      [33.6000, 78.1500],
      [33.3500, 78.4500],
      [33.1945, 78.6653]
    ]
  },
  {
    id: 'corr-3',
    name: 'Khardung La Vertical Lift Ridge Path',
    fromId: 'sec-leh',
    toId: 'sec-diskit',
    distanceKm: 118,
    transitHours: 4.1,
    transportMode: 'Tata 4x4 Light',
    fuelBurnLiters: 76,
    navigabilityPct: 79.2,
    ewThreatLevel: 'MODERATE',
    coordinates: [
      [34.1526, 77.5771],
      [34.2787, 77.6047],
      [34.4200, 77.5800],
      [34.5428, 77.5619]
    ]
  },
  {
    id: 'corr-4',
    name: 'Shyok-DBO Radar-Shadow Flight Corridor',
    fromId: 'sec-diskit',
    toId: 'sec-dbo',
    distanceKm: 165,
    transitHours: 1.8,
    transportMode: 'DRDO 200kg Logistics Drone',
    fuelBurnLiters: 32,
    navigabilityPct: 91.4,
    ewThreatLevel: 'SEVERE',
    coordinates: [
      [34.5428, 77.5619],
      [34.7800, 77.7000],
      [35.1200, 77.8500],
      [35.4022, 77.9314]
    ]
  }
];

export const LONGITUDINAL_ELEVATION_PROFILE = [
  { km: 0, distance: '0 km', elevationM: 3500, targetAltitude: 4500, passLabel: 'Leh Base' },
  { km: 25, distance: '25 km', elevationM: 3820, targetAltitude: 4500 },
  { km: 50, distance: '50 km', elevationM: 4680, targetAltitude: 4500 },
  { km: 78, distance: '78 km', elevationM: 5359, targetAltitude: 4500, passLabel: 'Khardung La (5,359m)' },
  { km: 110, distance: '110 km', elevationM: 3140, targetAltitude: 4500, passLabel: 'Nubra Valley' },
  { km: 140, distance: '140 km', elevationM: 3750, targetAltitude: 4500 },
  { km: 175, distance: '175 km', elevationM: 4420, targetAltitude: 4500 },
  { km: 218, distance: '218 km', elevationM: 4950, targetAltitude: 4500 },
  { km: 258, distance: '258 km', elevationM: 5064, targetAltitude: 4500, passLabel: 'Daulat Beg Oldie (5,064m)' }
];
