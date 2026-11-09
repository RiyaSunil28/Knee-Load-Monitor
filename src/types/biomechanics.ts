export type LoadStatus = 'normal' | 'warning' | 'critical';

export type DeviceStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

export interface KneeLoadMetric {
  id: string;
  timestamp: string;
  kam: number; // Knee Adduction Moment (%BW·BH)
  kfm: number; // Knee Flexion Moment (%BW·BH)
  status: LoadStatus;
}

export interface WearableDevice {
  deviceId: string;
  name: string;
  batteryLevel: number;
  firmwareVersion: string;
  status: DeviceStatus;
  lastSync: string;
}

export interface MonitoringSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  stepCount: number;
  peakKAM: number;
  averageKAM: number;
  peakKFM: number;
  averageKFM: number;
  status: 'active' | 'completed' | 'paused';
}

/** Sensor connectivity status for dashboard display */
export interface SensorConnectivityItem {
  id: string;
  name: string;
  role: 'Sensor 1' | 'Sensor 2' | 'ESP32 Controller';
  status: 'connected' | 'syncing' | 'disconnected';
  simulatedState: string;
  lastUpdate: string;
  battery?: number;
  signalStrength?: string;
}

/** Trend data point for knee moment graph */
export interface LoadTrendPoint {
  time: string;
  estimatedKAM: number;
  estimatedKFM: number;
}

/** Table item for recent monitoring sessions */
export interface SessionSummaryRow {
  sessionId: string;
  date: string;
  duration: string;
  gaitCycles: number;
  averageKAM: string;
  averageKFM: string;
  averageEstimatedLoad?: string;
  peakKAM?: string;
  peakKFM?: string;
  peakEstimatedLoad?: string;
  status: 'Completed' | 'Active' | 'Archived';
  notes?: string;
  avgFlexion?: string;
}

/** IMU signal telemetry reading */
export interface IMUReading {
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  timestamp: string;
}

/** Point on a 0-100% gait cycle curve */
export interface GaitCyclePoint {
  cyclePercent: number;
  flexionAngleDeg: number;
  sessionPrev?: number;
  sessionBaseline?: number;
}

/** System activity log event */
export interface SystemActivityLog {
  id: string;
  timestamp: string;
  component: string;
  event: string;
  status: 'Success' | 'Info' | 'Warning';
}

/** Person selector options for biomechanics model evaluation */
export type PersonOption = string;

/** Sensor configuration selector options */
export type SensorConfigOption =
  | '8 IMUs (baseline)'
  | '2 IMUs: best pair';

/** Data point for KAM & KFM moment curves across stance phase */
export interface KneeMomentDataPoint {
  stancePercent: number;
  labKAM: number;
  modelKAM: number;
  labKFM: number;
  modelKFM: number;
}