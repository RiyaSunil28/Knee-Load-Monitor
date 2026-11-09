import React from 'react';
import {
  Activity,
  Gauge,
  Clock,
  Footprints,
  Radio,
  AlertCircle
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { SensorStatusCard } from '../components/SensorStatus';
import { LoadTrendChart } from '../components/LoadTrendChart';
import {
  mockDashboardMetrics,
  mockSensors,
  mockLoadTrend
} from '../data';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* ============================================================
          A. Welcome Section
          ============================================================ */}
      <section className="bg-white border border-[#E5E7EB] rounded-lg p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF1E8] border border-[#FFE4D4] text-[#E87532] text-xs font-semibold mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E87532]"></span>
              Simulation Mode
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D]">
              Welcome to KneeLoad Monitor
            </h2>
            <p className="text-sm text-[#718096] mt-1 leading-relaxed">
              Monitor knee biomechanics, analyze movement patterns and review estimated knee-loading data.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#718096] bg-[#F7F8FA] border border-[#E5E7EB] px-3.5 py-2 rounded-md self-start md:self-auto">
            <Radio className="w-4 h-4 text-[#E87532] shrink-0" />
            <span>Virtual Telemetry Engine Active (100 Hz)</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          B. Key Metrics (4 cards in one row on desktop)
          ============================================================ */}

      <section aria-labelledby="key-metrics-heading">
        <h3 id="key-metrics-heading" className="sr-only">
          Key Biomechanics Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {/* 1. Knee Adduction Moment */}
          <MetricCard
            title="Knee Adduction Moment (KAM)"
            value={mockDashboardMetrics.estimatedKAM}
            unit={mockDashboardMetrics.kamUnit}
            label={mockDashboardMetrics.kamLabel}
            icon={Activity}
            badge="Sample Value"
            iconBgColor="bg-[#FFF1E8]"
            iconTextColor="text-[#E87532]"
          />

          {/* 2. Knee Flexion Moment */}
          <MetricCard
            title="Knee Flexion Moment (KFM)"
            value={mockDashboardMetrics.estimatedKFM}
            unit={mockDashboardMetrics.kfmUnit}
            label={mockDashboardMetrics.kfmLabel}
            icon={Gauge}
            badge="Sample Value"
            iconBgColor="bg-[#F0F4F8]"
            iconTextColor="text-[#172B4D]"
          />

          {/* 3. Monitoring Duration */}
          <MetricCard
            title="Monitoring Duration"
            value={mockDashboardMetrics.monitoringDuration}
            label={mockDashboardMetrics.durationLabel}
            icon={Clock}
            badge="Simulated"
            iconBgColor="bg-[#FFF1E8]"
            iconTextColor="text-[#E87532]"
          />

          {/* 4. Gait Cycles */}
          <MetricCard
            title="Gait Cycles"
            value={mockDashboardMetrics.gaitCycles}
            unit={mockDashboardMetrics.cyclesUnit}
            label={mockDashboardMetrics.cyclesLabel}
            icon={Footprints}
            badge="Simulated"
            iconBgColor="bg-[#F0F4F8]"
            iconTextColor="text-[#172B4D]"
          />

        </div>
      </section>

      {/* ============================================================
          C. Sensor Connectivity
          ============================================================ */}
      <section className="space-y-3" aria-labelledby="sensor-connectivity-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 id="sensor-connectivity-heading" className="text-base font-bold text-[#172B4D] tracking-tight">
              Device Connectivity
            </h3>
            <p className="text-xs text-[#718096]">
              Simulated peripheral status and wearable inertial unit feeds.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[11px] bg-[#FFF1E8] border border-[#FFE4D4] text-[#E87532] px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Note: Displays simulated mock device states; no physical hardware attached.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockSensors.map((sensor) => (
            <SensorStatusCard key={sensor.id} sensor={sensor} />
          ))}
        </div>

        <p className="text-xs text-[#718096]">
          Sensor placement: To be decided after the placement study.
        </p>
      </section>

      {/* D. KAM and KFM Trend Chart */}
      <section aria-labelledby="knee-load-trend-heading" className="space-y-2">
        <LoadTrendChart data={mockLoadTrend} />

        <p className="text-xs text-[#718096] px-1">
          Confidence band: coming next. Uncertainty estimates have not yet been validated.
        </p>
      </section>
    </div>
  );
};
