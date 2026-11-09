import React from 'react';
import {
  ShieldAlert,
  Radio,
  Cpu,
  Wifi,
  BatteryMedium,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import {
  mockSensors,
  mockDataTransmission,
  mockActivityLogs
} from '../data';

const DATA_FLOW_STEPS = [
  { name: '2 IMU sensors', detail: 'Acceleration and angular velocity at 100 Hz.', state: 'Simulated' },
  { name: 'ESP32', detail: 'Collects both sensors and sends the readings.', state: 'Simulated' },
  { name: 'Wi-Fi link', detail: 'Sends the readings to the laptop.', state: 'Not built yet' },
  { name: 'Model on laptop', detail: 'Estimates KAM and KFM for each step.', state: 'Not built yet' },
  { name: 'Dashboard', detail: 'Shows the curves and result tables.', state: 'Working' },
];

export const SystemStatus: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D]">
          System Status
        </h2>
        <p className="text-xs sm:text-sm text-[#718096] mt-0.5">
          Monitor device availability and data-processing components.
        </p>
      </div>

      {/* ============================================================
          SECTION A: Overall System Status (Pale Orange Banner)
          ============================================================ */}
      <section className="rounded-lg border-2 border-[#F59E5B]/50 bg-[#FFF1E8] p-5 sm:p-6 shadow-sm" aria-labelledby="status-banner-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-md bg-[#E87532] text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 id="status-banner-heading" className="text-sm sm:text-base font-bold text-[#172B4D] tracking-wide uppercase">
                SIMULATION MODE — NO PHYSICAL HARDWARE CONNECTED
              </h3>
              <p className="text-xs sm:text-sm text-[#202B3C] mt-1 leading-relaxed max-w-3xl">
                The KneeLoad Monitor platform is currently executing in synthetic telemetry mode. All incoming IMU coordinates, stride frequency metrics, and estimated joint contact forces are algorithmically simulated for frontend evaluation.
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-[#E87532] border border-[#FFE4D4] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E87532] animate-pulse"></span>
              Virtual Engine Active
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION B: Hardware Status (Separate Cards)
          ============================================================ */}
      <section aria-labelledby="hardware-status-heading">
        <h3 id="hardware-status-heading" className="text-sm font-bold text-[#172B4D] uppercase tracking-wider mb-3">
          Peripheral Sensor Nodes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockSensors.map((sensor) => {
            const isController = sensor.role === 'ESP32 Controller';
            const Icon = isController ? Cpu : Radio;

            return (
              <div key={sensor.id} className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-md bg-[#FFF1E8] text-[#E87532]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#172B4D]">{sensor.name}</h4>
                      <span className="text-[11px] font-mono text-[#718096]">{sensor.id}</span>
                    </div>
                  </div>

                  {/* Connection indicator - Green #16A36A */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16A36A] border border-[#A7F3D0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]"></span>
                    Connected
                  </span>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded bg-[#F7F8FA] border border-[#E5E7EB]">
                    <span className="text-[10px] text-[#718096] block uppercase font-semibold">Simulated State</span>
                    <span className="text-[#172B4D] font-medium text-[11px] truncate block mt-0.5">
                      {sensor.simulatedState}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#F7F8FA] border border-[#E5E7EB]">
                    <span className="text-[10px] text-[#718096] block uppercase font-semibold">Signal Health</span>
                    <span className="text-[#E87532] font-mono text-[11px] block mt-0.5">
                      {sensor.signalStrength || '-58 dBm'}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-[#F7F8FA] flex items-center justify-between text-xs text-[#718096]">
                  <div className="flex items-center gap-1">
                    <BatteryMedium className="w-4 h-4 text-[#E87532]" />
                    <span className="font-semibold text-[#172B4D] tabular-nums">{sensor.battery ? `${sensor.battery}%` : 'USB 5V'}</span>
                    <span className="text-[10px]">charge</span>
                  </div>
                  <span>Last update: {sensor.lastUpdate}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
          <p className="text-xs font-semibold text-[#172B4D]">
            IMU Sensor Configuration
          </p>
          <p className="text-xs text-[#718096] mt-1">
            2 IMU sensors, placement to be decided after the sensor placement study.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION C: Data Transmission Metrics (4 Cards)
          ============================================================ */}
      <section aria-labelledby="data-transmission-heading">
        <h3 id="data-transmission-heading" className="text-sm font-bold text-[#172B4D] uppercase tracking-wider mb-3">
          Simulated Data Transmission
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Packets Received */}
          <MetricCard
            title="Packets Received"
            value={mockDataTransmission.packetsReceived.toLocaleString()}
            unit="pkts"
            label="Inbound telemetry frames"
            icon={Wifi}
            badge="100 Hz"
            iconBgColor="bg-[#FFF1E8]"
            iconTextColor="text-[#E87532]"
          />

          {/* Packets Processed */}
          <MetricCard
            title="Packets Processed"
            value={mockDataTransmission.packetsProcessed.toLocaleString()}
            unit="pkts"
            label="Forwarded to kinematics"
            icon={Cpu}
            badge="Nominal"
            iconBgColor="bg-[#F0F4F8]"
            iconTextColor="text-[#172B4D]"
          />

          {/* Packet Loss */}
          <MetricCard
            title="Packet Loss"
            value={`${mockDataTransmission.packetLossPercent}%`}
            label="Simulated channel dropout"
            icon={Activity}
            badge="Optimal"
            iconBgColor="bg-[#FFF1E8]"
            iconTextColor="text-[#E87532]"
          />

          {/* Last Data Update */}
          <MetricCard
            title="Last Data Update"
            value="12 ms"
            label="Simulated latency"
            icon={CheckCircle2}
            badge="Live"
            iconBgColor="bg-[#F0F4F8]"
            iconTextColor="text-[#172B4D]"
          />
        </div>
      </section>

      {/* ============================================================
          SECTION D: Data Flow
          ============================================================ */}
      <section className="bg-white border border-[#E5E7EB] rounded-lg p-5 sm:p-6 shadow-sm" aria-labelledby="data-flow-heading">
        <div className="mb-5 pb-3 border-b border-[#E5E7EB]">
          <h3 id="data-flow-heading" className="text-base font-bold text-[#172B4D] tracking-tight">
            Data Flow
          </h3>
          <p className="text-xs text-[#718096] mt-0.5">
            How the measurement travels from the body to this dashboard, and which steps are built.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {DATA_FLOW_STEPS.map((step, index) => (
            <li
              key={step.name}
              className="rounded-md border border-[#E5E7EB] bg-[#F7F8FA] p-3"
            >
              <div className="text-[10px] font-semibold text-[#718096] uppercase tracking-wider">
                Step {index + 1}
              </div>
              <div className="text-sm font-bold text-[#172B4D] mt-1">{step.name}</div>
              <p className="text-xs text-[#718096] mt-1">{step.detail}</p>
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  step.state === 'Working'
                    ? 'bg-[#ECFDF5] text-[#16A36A] border-[#A7F3D0]'
                    : step.state === 'Simulated'
                    ? 'bg-[#FFF1E8] text-[#E87532] border-[#FFE4D4]'
                    : 'bg-white text-[#718096] border-[#E5E7EB]'
                }`}
              >
                {step.state}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================================================
          SECTION E: System Activity Log Table
          ============================================================ */}
      <section className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden" aria-labelledby="activity-log-heading">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h3 id="activity-log-heading" className="text-base font-bold text-[#172B4D] tracking-tight">
              System Activity Log
            </h3>
            <p className="text-xs text-[#718096] mt-0.5">
              Chronological ledger of telemetry lifecycle events and synchronization signals.
            </p>
          </div>
          <span className="text-xs font-medium text-[#718096]">Latest 7 entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#718096] uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {mockActivityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F8FA]/80 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs text-[#172B4D]">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-3.5 text-xs font-semibold text-[#202B3C]">
                    {log.component}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#718096]">
                    {log.event}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${log.status === 'Success'
                        ? 'bg-[#ECFDF5] text-[#16A36A] border border-[#A7F3D0]'
                        : log.status === 'Warning'
                          ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                          : 'bg-[#F0F4F8] text-[#172B4D] border border-[#D9E2EC]'
                        }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
