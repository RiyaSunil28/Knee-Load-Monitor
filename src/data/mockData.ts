import {
  SensorConnectivityItem,
  LoadTrendPoint,
  SessionSummaryRow,
  GaitCyclePoint,
  SystemActivityLog,
  PersonOption,
  SensorConfigOption,
  KneeMomentDataPoint
} from '../types';

/** Current telemetry overview metrics */
export const mockDashboardMetrics = {
  estimatedKAM: 0.42,
  kamUnit: '%BW·BH',
  kamLabel: 'Knee Adduction Moment',

  estimatedKFM: 0.68,
  kfmUnit: '%BW·BH',
  kfmLabel: 'Knee Flexion Moment',

  monitoringDuration: '12 min 35 sec',
  durationLabel: 'Elapsed session time',

  gaitCycles: 128,
  cyclesUnit: 'cycles',
  cyclesLabel: 'Recorded stride cycles',
};

/** Mock sensor connectivity statuses */
export const mockSensors: SensorConnectivityItem[] = [
  {
    id: 'imu-sensor-01',
    name: 'Sensor 1',
    role: 'Sensor 1',
    status: 'connected',
    simulatedState: 'Telemetry Stream Active (100 Hz)',
    lastUpdate: 'Just now',
    battery: 92,
    signalStrength: '-56 dBm (Simulated)',
  },
  {
    id: 'imu-sensor-02',
    name: 'Sensor 2',
    role: 'Sensor 2',
    status: 'connected',
    simulatedState: 'Telemetry Stream Active (100 Hz)',
    lastUpdate: 'Just now',
    battery: 88,
    signalStrength: '-61 dBm (Simulated)',
  },
  {
    id: 'ctrl-esp32-hub',
    name: 'ESP32 Controller',
    role: 'ESP32 Controller',
    status: 'connected',
    simulatedState: 'Wi-Fi Gateway Online (Simulated Feed)',
    lastUpdate: 'Just now',
    battery: 98,
    signalStrength: '-42 dBm (Simulated)',
  },
];

/**
 * Knee load trend time series (Simulated stance and swing gait loading)
 */
export const mockLoadTrend: LoadTrendPoint[] = [
  { time: '00:00', estimatedKAM: 0.32, estimatedKFM: 0.45 },
  { time: '01:00', estimatedKAM: 0.38, estimatedKFM: 0.58 },
  { time: '02:00', estimatedKAM: 0.45, estimatedKFM: 0.72 },
  { time: '03:00', estimatedKAM: 0.55, estimatedKFM: 0.82 },
  { time: '04:00', estimatedKAM: 0.48, estimatedKFM: 0.65 },
  { time: '05:00', estimatedKAM: 0.62, estimatedKFM: 0.90 },
  { time: '06:00', estimatedKAM: 0.52, estimatedKFM: 0.75 },
  { time: '07:00', estimatedKAM: 0.40, estimatedKFM: 0.60 },
  { time: '08:00', estimatedKAM: 0.58, estimatedKFM: 0.85 },
  { time: '09:00', estimatedKAM: 0.54, estimatedKFM: 0.78 },
  { time: '10:00', estimatedKAM: 0.46, estimatedKFM: 0.66 },
  { time: '11:00', estimatedKAM: 0.49, estimatedKFM: 0.70 },
  { time: '12:00', estimatedKAM: 0.47, estimatedKFM: 0.68 },
];

/** Recent monitoring sessions with extended metrics for reports */
export const mockRecentSessions: SessionSummaryRow[] = [
  {
    sessionId: 'KLM-SES-1048',
    date: 'Nov 08, 2026',
    duration: '12 min 35 sec',
    gaitCycles: 128,
    averageKAM: '0.42 %BW·BH',
    averageKFM: '0.68 %BW·BH',
    averageEstimatedLoad: '0.42 %BW·BH',
    peakKAM: '0.62 %BW·BH',
    peakKFM: '0.90 %BW·BH',
    status: 'Active',
    notes: 'Simulated sample session.',
    avgFlexion: '54.2°',
  },
  {
    sessionId: 'KLM-SES-1047',
    date: 'Nov 08, 2026',
    duration: '28 min 10 sec',
    gaitCycles: 364,
    averageKAM: '0.45 %BW·BH',
    averageKFM: '0.72 %BW·BH',
    averageEstimatedLoad: '0.45 %BW·BH',
    peakKAM: '0.65 %BW·BH',
    peakKFM: '0.95 %BW·BH',
    status: 'Completed',
    notes: 'Simulated sample session.',
    avgFlexion: '56.1°',
  },
];

/** Gait Analysis physiological knee flexion curve (0% - 100% of gait cycle) */
export const mockGaitCycleData: GaitCyclePoint[] = [
  { cyclePercent: 0, flexionAngleDeg: 4.8, sessionPrev: 5.2, sessionBaseline: 4.5 },
  { cyclePercent: 5, flexionAngleDeg: 12.4, sessionPrev: 13.0, sessionBaseline: 11.8 },
  { cyclePercent: 10, flexionAngleDeg: 18.6, sessionPrev: 19.5, sessionBaseline: 17.9 },
  { cyclePercent: 15, flexionAngleDeg: 19.8, sessionPrev: 20.4, sessionBaseline: 19.0 },
  { cyclePercent: 20, flexionAngleDeg: 17.2, sessionPrev: 17.9, sessionBaseline: 16.5 },
  { cyclePercent: 25, flexionAngleDeg: 13.5, sessionPrev: 14.1, sessionBaseline: 13.0 },
  { cyclePercent: 30, flexionAngleDeg: 10.2, sessionPrev: 10.8, sessionBaseline: 9.8 },
  { cyclePercent: 35, flexionAngleDeg: 8.4, sessionPrev: 8.9, sessionBaseline: 8.0 },
  { cyclePercent: 40, flexionAngleDeg: 8.1, sessionPrev: 8.5, sessionBaseline: 7.9 },
  { cyclePercent: 45, flexionAngleDeg: 11.6, sessionPrev: 12.0, sessionBaseline: 11.0 },
  { cyclePercent: 50, flexionAngleDeg: 19.5, sessionPrev: 20.1, sessionBaseline: 18.9 },
  { cyclePercent: 55, flexionAngleDeg: 31.8, sessionPrev: 32.5, sessionBaseline: 30.5 },
  { cyclePercent: 60, flexionAngleDeg: 46.2, sessionPrev: 47.0, sessionBaseline: 44.8 },
  { cyclePercent: 65, flexionAngleDeg: 58.7, sessionPrev: 59.8, sessionBaseline: 57.2 },
  { cyclePercent: 70, flexionAngleDeg: 64.9, sessionPrev: 66.2, sessionBaseline: 63.4 },
  { cyclePercent: 75, flexionAngleDeg: 63.2, sessionPrev: 64.1, sessionBaseline: 61.8 },
  { cyclePercent: 80, flexionAngleDeg: 52.8, sessionPrev: 53.6, sessionBaseline: 51.5 },
  { cyclePercent: 85, flexionAngleDeg: 35.4, sessionPrev: 36.2, sessionBaseline: 34.0 },
  { cyclePercent: 90, flexionAngleDeg: 18.2, sessionPrev: 19.0, sessionBaseline: 17.5 },
  { cyclePercent: 95, flexionAngleDeg: 8.6, sessionPrev: 9.2, sessionBaseline: 8.1 },
  { cyclePercent: 100, flexionAngleDeg: 4.8, sessionPrev: 5.2, sessionBaseline: 4.5 },
];

/** Gait Analysis summary metrics */
export const mockGaitMetrics = {
  averageFlexionAngle: 54.2,
  maximumFlexionAngle: 68.5,
  averageCycleDuration: 1.12,
  totalGaitCycles: 128,
  stancePhasePercent: 60,
  swingPhasePercent: 40,
  strideCadence: 107,
  consistencyScore: 94.8,
};

/** System status transmission metrics */
export const mockDataTransmission = {
  packetsReceived: 48290,
  packetsProcessed: 48276,
  packetLossPercent: 0.03,
  lastDataUpdate: 'Just now (12ms ago)',
  transmissionRate: '100 Hz',
  bufferUsagePercent: 14,
};


/** System activity log entries */
export const mockActivityLogs: SystemActivityLog[] = [
  {
    id: 'log-001',
    timestamp: '10:14:28',
    component: 'ESP32 Controller',
    event: 'Wi-Fi link to laptop established (Simulated)',
    status: 'Success',
  },
  {
    id: 'log-002',
    timestamp: '10:14:25',
    component: 'Sensor 1',
    event: 'Inertial calibration zero-offset applied',
    status: 'Success',
  },
  {
    id: 'log-003',
    timestamp: '10:14:22',
    component: 'Sensor 2',
    event: 'Synchronized sampling clock at 100 Hz',
    status: 'Success',
  },
  {
    id: 'log-004',
    timestamp: '10:13:50',
    component: 'Telemetry Engine',
    event: 'Stride cycle detection window initialized',
    status: 'Info',
  },
  {
    id: 'log-005',
    timestamp: '10:12:10',
    component: 'API Client',
    event: 'Virtual endpoint fallback engaged (VITE_USE_MOCK=true)',
    status: 'Info',
  },
  {
    id: 'log-006',
    timestamp: '10:08:44',
    component: 'ESP32 Controller',
    event: 'Simulated packet sequence counter reset',
    status: 'Success',
  },
  {
    id: 'log-007',
    timestamp: '10:05:12',
    component: 'Kinematics Model',
    event: 'Sample-data processing initialized (Simulated)',
    status: 'Info',
  },
];

/** Base simulated initial IMU reading buffer */
export const initialSensor1IMU = {
  ax: 0.42,
  ay: 9.78,
  az: 1.15,
  gx: 12.4,
  gy: -3.8,
  gz: 5.6,
};

export const initialSensor2IMU = {
  ax: -0.28,
  ay: 9.84,
  az: 2.34,
  gx: 24.1,
  gy: 4.2,
  gz: -8.7,
};

/* =========================================================================
   KNEE MOMENT ESTIMATION (KAM & KFM) GENERATOR FOR PERSONS & SENSORS
   ========================================================================= */

export const PERSON_OPTIONS: PersonOption[] = [
  'Sample person A',
  'Sample person B',
  'Sample person C',
];

export const SENSOR_OPTIONS: SensorConfigOption[] = [
  '8 IMUs (baseline)',
  '2 IMUs: best pair',
];

/**
 * Generates high-fidelity Knee Adduction Moment (KAM) and Knee Flexion Moment (KFM)
 * curves across 0% to 100% of Stance Phase based on Person, Sensor Set, and Step Number.
 */
export function getKneeMomentCurves(
  person: PersonOption,
  _sensorConfig: SensorConfigOption,
  stepNumber: number
): KneeMomentDataPoint[] {
  // Scaling factors per person
  let personScaleKAM = 1.0;
  let personScaleKFM = 1.0;

  if (person === 'Sample person B') {
    personScaleKAM = 1.15;
    personScaleKFM = 1.12;
  } else if (person === 'Sample person C') {
    personScaleKAM = 0.88;
    personScaleKFM = 0.86;
  }

  // Step variability (+/- 4%)
  const stepDrift = Math.sin(stepNumber * 1.35) * 0.04;

  // Same illustrative sample error for every sensor configuration.
  // No sensor-specific accuracy or lag is assumed.
  const noiseMultiplier = 0.035;

  const points: KneeMomentDataPoint[] = [];

  // Generate 41 stance phase points (every 2.5%)
  for (let p = 0; p <= 100; p += 2.5) {
    const t = p / 100;

    // Lab KAM (Bimodal double-peak curve)
    const peak1 = 1.04 * Math.exp(-Math.pow((t - 0.25) / 0.13, 2));
    const peak2 = 1.02 * Math.exp(-Math.pow((t - 0.68) / 0.14, 2));
    const baselineDip = 0.12 * Math.sin(Math.PI * t);

    const labKAM = Number(
      ((peak1 + peak2 + baselineDip) * (personScaleKAM + stepDrift)).toFixed(3)
    );

    // Model KAM Estimate (same sample error for all configurations)
    const kamNoise =
      Math.sin(t * 18 + stepNumber) * noiseMultiplier * 0.85 +
      Math.cos(t * 26) * noiseMultiplier * 0.6;

    const modelKAM = Number(
      Math.max(-0.2, labKAM + kamNoise).toFixed(3)
    );

    // Lab KFM
    const kfmPositive = 1.76 * Math.exp(-Math.pow((t - 0.30) / 0.18, 2));
    const kfmNegative = 0.88 * Math.exp(-Math.pow((t - 0.82) / 0.15, 2));

    const labKFM = Number(
      ((kfmPositive - kfmNegative) * (personScaleKFM + stepDrift)).toFixed(3)
    );

    // Model KFM Estimate (same sample error for all configurations)
    const kfmNoise =
      Math.sin(t * 16 + stepNumber) * noiseMultiplier * 1.1 +
      Math.cos(t * 22) * noiseMultiplier * 0.8;

    const modelKFM = Number((labKFM + kfmNoise).toFixed(3));

    points.push({
      stancePercent: p,
      labKAM,
      modelKAM,
      labKFM,
      modelKFM,
    });
  }

  return points;
}