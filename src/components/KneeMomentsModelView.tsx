import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import {
  PersonOption,
  SensorConfigOption
} from '../types';
import {
  PERSON_OPTIONS,
  SENSOR_OPTIONS,
  getKneeMomentCurves
} from '../data';
import {
  checkAvailableConfigs,
  loadReplayIndex,
  loadReplayStep,
  ReplayDataResult,
  ReplayIndex
} from '../services/replayDataService';

export const KneeMomentsModelView: React.FC = () => {
  const [person, setPerson] = useState<PersonOption>(PERSON_OPTIONS[0]);
  const [sensors, setSensors] = useState<SensorConfigOption>('8 IMUs (baseline)');
  const [step, setStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeCursor, setActiveCursor] = useState<number | null>(null);

  const playTimerRef = useRef<number | null>(null);
  const [replayIndex, setReplayIndex] = useState<ReplayIndex | null>(null);
  const [replayData, setReplayData] = useState<ReplayDataResult | null>(null);
  const [replayProblem, setReplayProblem] = useState<string>('');
  const [availableConfigs, setAvailableConfigs] = useState<Partial<Record<SensorConfigOption, boolean>>>({});

  // People and step counts come from replay_data.json when it exists.
  const personOptions: string[] = replayIndex
    ? replayIndex.subjects.map((subject) => subject.id)
    : PERSON_OPTIONS;
  const maxStep = replayIndex
    ? Math.max(
        1,
        replayIndex.subjects.find((subject) => subject.id === person)?.stepCount ?? 1
      )
    : 10;

  // Generate sample curves as the fallback
  const sampleData = getKneeMomentCurves(person, sensors, step);

  // Find out which sensor options have a results file
  useEffect(() => {
    checkAvailableConfigs().then(setAvailableConfigs);
  }, []);

  // Read the list of people whenever the sensor option changes
  useEffect(() => {
    let cancelled = false;

    setReplayIndex(null);
    setReplayData(null);

    loadReplayIndex(sensors).then((result) => {
      if (cancelled) return;

      if (result.ok) {
        setReplayIndex(result.index);
        setReplayProblem('');
        setPerson(result.index.subjects[0].id);
        setStep(1);
      } else {
        setReplayProblem(result.reason);
        setPerson(PERSON_OPTIONS[0]);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sensors]);

  // Load the selected person and step
  useEffect(() => {
    if (!replayIndex) return;

    let cancelled = false;

    loadReplayStep(sensors, person, step).then((result) => {
      if (cancelled) return;

      if (result.ok) {
        setReplayData(result.result);
        setReplayProblem('');
      } else {
        setReplayData(null);
        setReplayProblem(result.reason);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [replayIndex, sensors, person, step]);

  // Prefer real experimental data; otherwise use sample curves
  const data = replayData?.data ?? sampleData;

  // Animate playback across stance phase when Play Step is active
  useEffect(() => {
    if (isPlaying) {
      let currentPercent = 0;
      playTimerRef.current = window.setInterval(() => {
        currentPercent += 2.5;
        if (currentPercent > 100) {
          currentPercent = 0;
          setStep((prev) => (prev % maxStep) + 1);
        }
        setActiveCursor(currentPercent);
      }, 50);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
      setActiveCursor(null);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, maxStep]);

  const handlePersonChange = (value: string) => {
    setPerson(value);
    setStep(1);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      {/* ============================================================
          1. Disclaimer Banner
          ============================================================ */}
      <div
        className={`rounded-md px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs border ${replayData
          ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
          : 'bg-[#FFF8E6] border-[#FDE68A] text-[#92400E]'
          }`}
      >
        {replayData ? (
          <>
            Experimental data loaded. Source: <strong>{replayData.source}</strong>.
            Model: <strong>{replayData.model}</strong>. Units: %BW·BH.
          </>
        ) : (
          <>
            Sample curves only. {replayProblem || 'No valid experimental results were found.'}{' '}
            These curves are illustrative and are not real data or model output.
          </>
        )}
      </div>

      {/* ============================================================
          2. Controls Toolbar (Person, Step, Sensors, Play Step)
          ============================================================ */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4 sm:gap-6">
          {/* Person Dropdown */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="person-select" className="text-xs font-medium text-[#718096]">
              Person
            </label>
            <div className="relative">
              <select
                id="person-select"
                value={person}
                onChange={(e) => handlePersonChange(e.target.value)}
                className="w-48 appearance-none bg-white border border-[#E5E7EB] hover:border-[#F59E5B] text-[#172B4D] text-xs sm:text-sm font-medium rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#E87532] focus:border-[#E87532] cursor-pointer shadow-2xs transition-colors"
              >
                {personOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#172B4D]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Step Range Slider */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="step-slider" className="text-xs font-medium text-[#718096]">
                Step
              </label>
              <span className="text-[11px] font-mono text-[#E87532] font-semibold ml-2">
                #{step}
              </span>
            </div>
            <div className="flex items-center h-8">
              <input
                id="step-slider"
                type="range"
                min={1}
                max={maxStep}
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
                className="w-32 sm:w-40 h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#E87532]"
              />
            </div>
          </div>

          {/* Sensors Dropdown */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="sensors-select" className="text-xs font-medium text-[#718096]">
              Sensors
            </label>
            <div className="relative">
              <select
                id="sensors-select"
                value={sensors}
                onChange={(e) => setSensors(e.target.value as SensorConfigOption)}
                className="w-64 appearance-none bg-white border border-[#E5E7EB] hover:border-[#F59E5B] text-[#172B4D] text-xs sm:text-sm font-medium rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#E87532] focus:border-[#E87532] cursor-pointer shadow-2xs transition-colors"
              >
                {SENSOR_OPTIONS.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    disabled={opt !== '8 IMUs (baseline)' && !availableConfigs[opt]}
                  >
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#172B4D]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Burnt Orange Play Step Button */}
          <div>
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-[#E87532] hover:bg-[#D46222] text-white rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isPlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span>Pause step</span>
                </>
              ) : (
                <span>Play step</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          3. Two Side-by-Side Moment Charts (KAM & KFM)
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Chart: Knee Adduction Moment (KAM) */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
          <h4 className="text-xs sm:text-sm font-bold text-[#172B4D] uppercase tracking-wider mb-2">
            KNEE ADDUCTION MOMENT (KAM), %BW&middot;BH
          </h4>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="stancePercent"
                  type="number"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(val) => `${val}%`}
                  stroke="#718096"
                  fontSize={11}
                  tickLine={false}
                  label={{
                    value: 'Stance phase',
                    position: 'insideBottom',
                    offset: -12,
                    fontSize: 11,
                    fill: '#718096'
                  }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  stroke="#718096"
                  fontSize={11}
                  tickLine={false}
                />
                <ReferenceLine y={0} stroke="#A0AEC0" strokeDasharray="3 3" />
                {activeCursor !== null && (
                  <ReferenceLine x={activeCursor} stroke="#E87532" strokeDasharray="2 2" />
                )}
                <Tooltip
                  formatter={(val: number, name: string) => [
                    `${val} %BW·BH`,
                    name === 'labKAM' ? 'Lab value' : 'Model estimate'
                  ]}
                  labelFormatter={(label) => `Stance: ${label}%`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    borderRadius: '0.375rem',
                    fontSize: '11px'
                  }}
                />
                {/* Lab Value: Primary Navy #172B4D */}
                <Line
                  type="monotone"
                  dataKey="labKAM"
                  stroke="#172B4D"
                  strokeWidth={2}
                  dot={false}
                  name="labKAM"
                  isAnimationActive={false}
                />
                {/* Model Estimate: Primary Orange #E87532 */}
                <Line
                  type="monotone"
                  dataKey="modelKAM"
                  stroke="#E87532"
                  strokeWidth={2}
                  dot={false}
                  name="modelKAM"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Knee Flexion Moment (KFM) */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
          <h4 className="text-xs sm:text-sm font-bold text-[#172B4D] uppercase tracking-wider mb-2">
            KNEE FLEXION MOMENT (KFM), %BW&middot;BH
          </h4>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="stancePercent"
                  type="number"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(val) => `${val}%`}
                  stroke="#718096"
                  fontSize={11}
                  tickLine={false}
                  label={{
                    value: 'Stance phase',
                    position: 'insideBottom',
                    offset: -12,
                    fontSize: 11,
                    fill: '#718096'
                  }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  stroke="#718096"
                  fontSize={11}
                  tickLine={false}
                />
                <ReferenceLine y={0} stroke="#A0AEC0" strokeDasharray="3 3" />
                {activeCursor !== null && (
                  <ReferenceLine x={activeCursor} stroke="#E87532" strokeDasharray="2 2" />
                )}
                <Tooltip
                  formatter={(val: number, name: string) => [
                    `${val} %BW·BH`,
                    name === 'labKFM' ? 'Lab value' : 'Model estimate'
                  ]}
                  labelFormatter={(label) => `Stance: ${label}%`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    borderRadius: '0.375rem',
                    fontSize: '11px'
                  }}
                />
                {/* Lab Value: Primary Navy #172B4D */}
                <Line
                  type="monotone"
                  dataKey="labKFM"
                  stroke="#172B4D"
                  strokeWidth={2}
                  dot={false}
                  name="labKFM"
                  isAnimationActive={false}
                />
                {/* Model Estimate: Primary Orange #E87532 */}
                <Line
                  type="monotone"
                  dataKey="modelKFM"
                  stroke="#E87532"
                  strokeWidth={2}
                  dot={false}
                  name="modelKFM"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ============================================================
          4. Bottom Legend (Navy reference vs Orange estimate)
          ============================================================ */}
      <div className="bg-white border border-[#E5E7EB] rounded-md px-4 py-3 flex flex-wrap items-center gap-6 text-xs text-[#172B4D] shadow-2xs">
        {/* Lab value legend (Primary Navy #172B4D) */}
        <div className="flex items-center gap-2">
          <span className="w-5 h-0.5 bg-[#172B4D]"></span>
          <span>Lab value (force plate + motion capture)</span>
        </div>

        {/* Model estimate legend (Primary Orange #E87532) */}
        <div className="flex items-center gap-2">
          <span className="w-5 h-0.5 bg-[#E87532]"></span>
          <span>Model estimate</span>
        </div>

        {/* Confidence band legend */}
        <div className="flex items-center gap-2 text-[#718096]">
          <span className="w-5 border-b border-dashed border-[#718096]"></span>
          <span>Confidence band: not drawn yet</span>
        </div>
      </div>
    </div>
  );
};
