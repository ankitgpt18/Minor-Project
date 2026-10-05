export interface SectorDepot {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  altitudeFt: number;
  role: 'Logistics Command Hub' | 'Heavy Forward Depot' | 'Aerial Drone Base' | 'Isolated Frontier Post' | 'Mountain Transit Hub';
  cluster: 'Munitions & Heavy Ordnance' | 'Mobile Infantry & Polar Rations' | 'Aerial Drone Resupply';
  troopsAssigned: number;
  currentStock: {
    artilleryShells155mm: number; // in rounds
    winterDieselKL: number;       // in kilolitres
    highCalorieRationsDays: number;
    droneBatteryCells: number;
  };
  predicted30DayDemand: {
    artilleryShells155mm: number;
    winterDieselKL: number;
    highCalorieRationsDays: number;
    droneBatteryCells: number;
  };
  localModelMetrics: {
    loss: number;
    maeHours: number;
    localEpochs: number;
    dataPoints: number;
  };
  status: 'OPTIMAL' | 'CRITICAL_SHORTAGE' | 'DIL_JAMMED' | 'ACTIVE_TRANSFER';
  isJammed: boolean;
  isCompromised: boolean;
}

export interface MountainPass {
  id: string;
  name: string;
  altitudeFt: number;
  lat: number;
  lng: number;
  status: 'OPEN' | 'BLOCKED_SNOW' | 'AVALANCHE_ALERT' | 'RESTRICTED';
  activeTransitCorridor: string;
  closureHistoryDaysAnnual: number;
}

export interface TransitCorridor {
  id: string;
  sourceDepot: string;
  targetDepot: string;
  name: string;
  distanceKm: number;
  avgTravelTimeHours: number;
  transferType: 'Heavy Stallion 10T' | 'Light 4x4 Tata' | 'Heavy-Lift Logistics Drone (DRDO 200kg)';
  roadConditionScore: number; // 0-100
  enemyEWSpoofRisk: 'LOW' | 'MODERATE' | 'SEVERE';
  coordinates: [number, number][];
}

export interface TacticalMetrics {
  roundsCompleted: number;
  globalLeadTimeMaeHours: number;
  centralizedCloudMaeHours: number;
  isolatedDepotMaeHours: number;
  criticalStockoutProbPct: number;
  droneFlightSurvivabilityPct: number;
  formalEpsilonBound: number;
  formalDeltaBound: number;
  uncompressedPayloadMb: number;
  sparsifiedPayloadMb: number;
  burstDurationMs: number;
  byzantineRejectionRatePct: number;
  secAggActive: boolean;
  topkSparsificationActive: boolean;
  adaptiveDpActive: boolean;
  directionalCosineActive: boolean;
  clusteredFlActive: boolean;
}

export const INITIAL_DEPOTS: SectorDepot[] = [
  {
    id: 'depot-leh',
    name: '14 Corps Master Logistics Base (Leh)',
    code: 'SEC-HQ-LEH',
    lat: 34.1526,
    lng: 77.5771,
    altitudeFt: 11562,
    role: 'Logistics Command Hub',
    cluster: 'Munitions & Heavy Ordnance',
    troopsAssigned: 12500,
    currentStock: {
      artilleryShells155mm: 4800,
      winterDieselKL: 1450,
      highCalorieRationsDays: 120,
      droneBatteryCells: 850
    },
    predicted30DayDemand: {
      artilleryShells155mm: 1850,
      winterDieselKL: 620,
      highCalorieRationsDays: 30,
      droneBatteryCells: 240
    },
    localModelMetrics: {
      loss: 0.042,
      maeHours: 1.18,
      localEpochs: 4,
      dataPoints: 14200
    },
    status: 'OPTIMAL',
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'depot-kargil',
    name: '8 Mountain Division Supply Hub (Kargil / Drass)',
    code: 'SEC-DIV-KGL',
    lat: 34.5539,
    lng: 76.1349,
    altitudeFt: 8780,
    role: 'Mountain Transit Hub',
    cluster: 'Mobile Infantry & Polar Rations',
    troopsAssigned: 6400,
    currentStock: {
      artilleryShells155mm: 2200,
      winterDieselKL: 820,
      highCalorieRationsDays: 75,
      droneBatteryCells: 340
    },
    predicted30DayDemand: {
      artilleryShells155mm: 920,
      winterDieselKL: 410,
      highCalorieRationsDays: 30,
      droneBatteryCells: 160
    },
    localModelMetrics: {
      loss: 0.051,
      maeHours: 1.32,
      localEpochs: 3,
      dataPoints: 9800
    },
    status: 'OPTIMAL',
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'depot-nyoma',
    name: '3 Infantry Division Forward Staging Depot (Nyoma / Chushul)',
    code: 'SEC-FWD-NYM',
    lat: 33.1945,
    lng: 78.6653,
    altitudeFt: 13700,
    role: 'Heavy Forward Depot',
    cluster: 'Munitions & Heavy Ordnance',
    troopsAssigned: 8200,
    currentStock: {
      artilleryShells155mm: 1450,
      winterDieselKL: 410,
      highCalorieRationsDays: 38,
      droneBatteryCells: 410
    },
    predicted30DayDemand: {
      artilleryShells155mm: 1100,
      winterDieselKL: 380,
      highCalorieRationsDays: 30,
      droneBatteryCells: 220
    },
    localModelMetrics: {
      loss: 0.068,
      maeHours: 1.44,
      localEpochs: 5,
      dataPoints: 11400
    },
    status: 'OPTIMAL',
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'depot-dbo',
    name: 'Sub-Sector North Advance Logistics Post (Daulat Beg Oldie - DBO)',
    code: 'SEC-POST-DBO',
    lat: 35.4022,
    lng: 77.9314,
    altitudeFt: 16614,
    role: 'Isolated Frontier Post',
    cluster: 'Mobile Infantry & Polar Rations',
    troopsAssigned: 2800,
    currentStock: {
      artilleryShells155mm: 680,
      winterDieselKL: 190,
      highCalorieRationsDays: 22,
      droneBatteryCells: 190
    },
    predicted30DayDemand: {
      artilleryShells155mm: 520,
      winterDieselKL: 180,
      highCalorieRationsDays: 30,
      droneBatteryCells: 130
    },
    localModelMetrics: {
      loss: 0.089,
      maeHours: 1.58,
      localEpochs: 4,
      dataPoints: 6200
    },
    status: 'CRITICAL_SHORTAGE',
    isJammed: false,
    isCompromised: false
  },
  {
    id: 'depot-diskit',
    name: 'Nubra Valley Autonomous Drone Resupply Station (Diskit)',
    code: 'SEC-UAV-DSK',
    lat: 34.5428,
    lng: 77.5619,
    altitudeFt: 10315,
    role: 'Aerial Drone Base',
    cluster: 'Aerial Drone Resupply',
    troopsAssigned: 1900,
    currentStock: {
      artilleryShells155mm: 410,
      winterDieselKL: 240,
      highCalorieRationsDays: 60,
      droneBatteryCells: 780
    },
    predicted30DayDemand: {
      artilleryShells155mm: 210,
      winterDieselKL: 160,
      highCalorieRationsDays: 30,
      droneBatteryCells: 380
    },
    localModelMetrics: {
      loss: 0.038,
      maeHours: 1.25,
      localEpochs: 3,
      dataPoints: 7500
    },
    status: 'OPTIMAL',
    isJammed: false,
    isCompromised: false
  }
];

export const STRATEGIC_PASSES: MountainPass[] = [
  {
    id: 'pass-zojila',
    name: 'Zojila Pass (Srinagar-Leh Axis NH-1D)',
    altitudeFt: 11578,
    lat: 34.2801,
    lng: 75.5033,
    status: 'OPEN',
    activeTransitCorridor: 'Kargil <-> Srinagar Primary Convoy Line',
    closureHistoryDaysAnnual: 73
  },
  {
    id: 'pass-khardungla',
    name: 'Khardung La (Leh-Nubra Axis)',
    altitudeFt: 17982,
    lat: 34.2787,
    lng: 77.6047,
    status: 'RESTRICTED',
    activeTransitCorridor: 'Leh <-> Diskit Heavy Transfer Path',
    closureHistoryDaysAnnual: 42
  },
  {
    id: 'pass-changla',
    name: 'Chang La (Leh-Pangong/Nyoma Axis)',
    altitudeFt: 17590,
    lat: 34.0483,
    lng: 77.9306,
    status: 'OPEN',
    activeTransitCorridor: 'Leh <-> Nyoma Tank Resupply Route',
    closureHistoryDaysAnnual: 55
  },
  {
    id: 'pass-sasser',
    name: 'Sasser Pass (Karakoram Frontier)',
    altitudeFt: 17753,
    lat: 34.9833,
    lng: 77.7833,
    status: 'BLOCKED_SNOW',
    activeTransitCorridor: 'Diskit <-> DBO Mountain Track',
    closureHistoryDaysAnnual: 180
  }
];

export const TRANSIT_CORRIDORS: TransitCorridor[] = [
  {
    id: 'corr-leh-kargil',
    sourceDepot: 'depot-leh',
    targetDepot: 'depot-kargil',
    name: 'NH-1D Western Strategic Trunk',
    distanceKm: 216,
    avgTravelTimeHours: 5.8,
    transferType: 'Heavy Stallion 10T',
    roadConditionScore: 84,
    enemyEWSpoofRisk: 'LOW',
    coordinates: [
      [34.1526, 77.5771],
      [34.2250, 77.2000],
      [34.3500, 76.8000],
      [34.4500, 76.4000],
      [34.5539, 76.1349]
    ]
  },
  {
    id: 'corr-leh-nyoma',
    sourceDepot: 'depot-leh',
    targetDepot: 'depot-nyoma',
    name: 'Upshi-Chumathang High-Altitude Corridor',
    distanceKm: 182,
    avgTravelTimeHours: 6.2,
    transferType: 'Light 4x4 Tata',
    roadConditionScore: 71,
    enemyEWSpoofRisk: 'MODERATE',
    coordinates: [
      [34.1526, 77.5771],
      [33.9500, 77.7500],
      [33.6000, 78.1500],
      [33.3500, 78.4500],
      [33.1945, 78.6653]
    ]
  },
  {
    id: 'corr-leh-diskit',
    sourceDepot: 'depot-leh',
    targetDepot: 'depot-diskit',
    name: 'Khardung La Vertical Lift Ridge Channel',
    distanceKm: 118,
    avgTravelTimeHours: 4.1,
    transferType: 'Heavy-Lift Logistics Drone (DRDO 200kg)',
    roadConditionScore: 58,
    enemyEWSpoofRisk: 'MODERATE',
    coordinates: [
      [34.1526, 77.5771],
      [34.2787, 77.6047],
      [34.4200, 77.5800],
      [34.5428, 77.5619]
    ]
  },
  {
    id: 'corr-diskit-dbo',
    sourceDepot: 'depot-diskit',
    targetDepot: 'depot-dbo',
    name: 'Shyok-DBO Radar-Shadow Flight Corridor',
    distanceKm: 165,
    avgTravelTimeHours: 2.2,
    transferType: 'Heavy-Lift Logistics Drone (DRDO 200kg)',
    roadConditionScore: 45,
    enemyEWSpoofRisk: 'SEVERE',
    coordinates: [
      [34.5428, 77.5619],
      [34.7800, 77.7000],
      [35.1200, 77.8500],
      [35.4022, 77.9314]
    ]
  }
];

export const INITIAL_METRICS: TacticalMetrics = {
  roundsCompleted: 14,
  globalLeadTimeMaeHours: 1.38,
  centralizedCloudMaeHours: 1.20,
  isolatedDepotMaeHours: 2.85,
  criticalStockoutProbPct: 5.1,
  droneFlightSurvivabilityPct: 91.4,
  formalEpsilonBound: 1.85,
  formalDeltaBound: 0.00001,
  uncompressedPayloadMb: 14.2,
  sparsifiedPayloadMb: 1.42,
  burstDurationMs: 88,
  byzantineRejectionRatePct: 98.5,
  secAggActive: true,
  topkSparsificationActive: true,
  adaptiveDpActive: true,
  directionalCosineActive: true,
  clusteredFlActive: true
};
