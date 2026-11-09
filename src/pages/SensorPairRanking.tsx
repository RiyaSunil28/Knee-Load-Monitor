import React, { useEffect, useState } from 'react';
import { Network, Info, Database, Award, Layers } from 'lucide-react';

interface PairResult {
    sensorA: string;
    sensorB: string;
    kamRmse?: number;
    kfmRmse?: number;
    combinedRmse?: number;
}

interface RankingFile {
    source?: string;
    units?: string;
    results: PairResult[];
}

const SENSOR_LOCATIONS = [
    'Left Foot',
    'Right Foot',
    'Left Shank',
    'Right Shank',
    'Left Thigh',
    'Right Thigh',
    'Waist',
    'Chest',
];

const generatePairs = () => {
    const pairs: { sensorA: string; sensorB: string }[] = [];

    for (let i = 0; i < SENSOR_LOCATIONS.length; i++) {
        for (let j = i + 1; j < SENSOR_LOCATIONS.length; j++) {
            pairs.push({
                sensorA: SENSOR_LOCATIONS[i],
                sensorB: SENSOR_LOCATIONS[j],
            });
        }
    }

    return pairs;
};

const ALL_PAIRS = generatePairs();

const formatMetric = (value?: number) =>
    typeof value === 'number' && Number.isFinite(value)
        ? value.toFixed(3)
        : '–';

export const SensorPairRanking: React.FC = () => {
    const [rankingData, setRankingData] = useState<RankingFile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetch('/sensor_pair_ranking.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ranking results file not found');
                }
                return response.json();
            })
            .then((data: RankingFile) => {
                if (
                    !Array.isArray(data.results) ||
                    !data.results.every(
                        (item) =>
                            typeof item.sensorA === 'string' &&
                            typeof item.sensorB === 'string'
                    )
                ) {
                    throw new Error('Invalid ranking results format');
                }

                if (!cancelled) {
                    setRankingData(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setRankingData(null);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const getResult = (sensorA: string, sensorB: string) => {
        return rankingData?.results.find(
            (result) =>
                (result.sensorA === sensorA && result.sensorB === sensorB) ||
                (result.sensorA === sensorB && result.sensorB === sensorA)
        );
    };

    const hasResults = Boolean(rankingData?.results.length);

    const scoreOf = (result?: PairResult) => {
        if (!result) return undefined;
        if (typeof result.combinedRmse === 'number' && Number.isFinite(result.combinedRmse)) {
            return result.combinedRmse;
        }
        if (
            typeof result.kamRmse === 'number' &&
            typeof result.kfmRmse === 'number' &&
            Number.isFinite(result.kamRmse) &&
            Number.isFinite(result.kfmRmse)
        ) {
            return (result.kamRmse + result.kfmRmse) / 2;
        }
        return undefined;
    };

    // Pairs with results come first (lowest error first); pairs without results keep their order.
    const rows = ALL_PAIRS.map((pair) => {
        const result = getResult(pair.sensorA, pair.sensorB);
        return { ...pair, result, score: scoreOf(result) };
    }).sort((a, b) => {
        if (a.score === undefined && b.score === undefined) return 0;
        if (a.score === undefined) return 1;
        if (b.score === undefined) return -1;
        return a.score - b.score;
    });

    const bestRow = rows[0] && rows[0].score !== undefined ? rows[0] : null;

    const referenceScore = (a: string, b: string) => scoreOf(getResult(a, b));
    const thighShankScore = (() => {
        const scores = [
            referenceScore('Left Thigh', 'Left Shank'),
            referenceScore('Right Thigh', 'Right Shank'),
        ].filter((value): value is number => value !== undefined);
        return scores.length ? Math.min(...scores) : undefined;
    })();

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#172B4D] text-white">
                        <Network className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#172B4D]">
                            Sensor Pair Ranking
                        </h1>
                        <p className="text-sm text-[#718096] mt-1">
                            Evaluation of possible two-IMU configurations
                        </p>
                    </div>
                </div>
            </div>

            {/* Information Banner */}
            <div className="p-4 rounded-lg border border-[#F3D5BD] bg-[#FFF8F2] flex gap-3">
                <Info className="w-5 h-5 text-[#E87532] shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-[#172B4D]">
                        Sensor placement study
                    </p>
                    <p className="text-sm text-[#718096] mt-1">
                        All 28 possible pairs are listed below. {hasResults
                            ? 'Pairs are sorted by combined error, lowest first. The top pair is a candidate, not a final choice.'
                            : 'No pair has been selected as the best configuration because experimental ranking results are not available yet.'}
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-[#718096] text-sm">
                        <Network className="w-4 h-4" />
                        Possible sensor pairs
                    </div>
                    <p className="text-3xl font-bold text-[#172B4D] mt-2">28</p>
                    <p className="text-xs text-[#718096] mt-1">
                        Combinations from 8 locations
                    </p>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-[#718096] text-sm">
                        <Database className="w-4 h-4" />
                        Evaluation results
                    </div>
                    <p className="text-3xl font-bold text-[#172B4D] mt-2">
                        {hasResults ? rankingData?.results.length : '0'}
                    </p>
                    <p className="text-xs text-[#718096] mt-1">
                        Experimental results loaded
                    </p>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-[#718096] text-sm">
                        <Award className="w-4 h-4" />
                        Selected best pair
                    </div>
                    <p className="text-xl font-bold text-[#E87532] mt-3">
                        {bestRow ? `${bestRow.sensorA} + ${bestRow.sensorB}` : 'Not decided'}
                    </p>
                    <p className="text-xs text-[#718096] mt-1">
                        {bestRow
                            ? `Lowest error in this study (${formatMetric(bestRow.score)}). Final choice also depends on wearability.`
                            : 'Pending placement study'}
                    </p>
                </div>
            </div>

            {/* Pair Ranking Table */}
            <section className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB]">
                    <h2 className="text-lg font-semibold text-[#172B4D]">
                        All 28 Sensor Combinations
                    </h2>
                    <p className="text-sm text-[#718096] mt-1">
                        Lower RMSE indicates lower prediction error.
                    </p>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-[#718096]">
                        Loading ranking results...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F7F8FA] text-[#172B4D]">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Rank</th>
                                    <th className="px-5 py-3 font-semibold">Sensor 1</th>
                                    <th className="px-5 py-3 font-semibold">Sensor 2</th>
                                    <th className="px-5 py-3 font-semibold">KAM RMSE</th>
                                    <th className="px-5 py-3 font-semibold">KFM RMSE</th>
                                    <th className="px-5 py-3 font-semibold">Combined RMSE</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E5E7EB]">
                                {rows.map((row, index) => {
                                    const isBest = bestRow !== null && index === 0;

                                    return (
                                        <tr
                                            key={`${row.sensorA}-${row.sensorB}`}
                                            className={isBest ? 'bg-[#FFF8F2]' : 'hover:bg-[#F7F8FA]'}
                                        >
                                            <td className="px-5 py-3 font-medium text-[#172B4D]">
                                                {row.score !== undefined ? index + 1 : '–'}
                                                {isBest && (
                                                    <span className="ml-2 text-[10px] font-semibold uppercase text-[#E87532]">
                                                        Best
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-[#475569]">
                                                {row.sensorA}
                                            </td>
                                            <td className="px-5 py-3 text-[#475569]">
                                                {row.sensorB}
                                            </td>
                                            <td className="px-5 py-3 text-[#475569]">
                                                {formatMetric(row.result?.kamRmse)}
                                            </td>
                                            <td className="px-5 py-3 text-[#475569]">
                                                {formatMetric(row.result?.kfmRmse)}
                                            </td>
                                            <td className="px-5 py-3 text-[#475569]">
                                                {formatMetric(row.score)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !hasResults && (
                    <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F8FA]">
                        <p className="text-sm text-[#718096] text-center">
                            No experimental ranking results yet. Metrics will appear here
                            when the results file becomes available.
                        </p>
                    </div>
                )}
            </section>

            {/* Reference Configuration */}
            <section className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-[#E87532]" />
                    <h2 className="text-lg font-semibold text-[#172B4D]">
                        Reference Configuration
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA]">
                        <p className="font-semibold text-[#172B4D]">
                            Thigh + Shank
                        </p>
                        <p className="text-xs text-[#E87532] font-medium mt-1">
                            Original plan · Reference only
                        </p>
                        <p className="text-sm text-[#718096] mt-2">
                            The initially proposed two-sensor arrangement. Exact body
                            placement remains undecided.
                        </p>
                        <p className="text-sm font-semibold text-[#172B4D] mt-2">
                            Combined RMSE: {formatMetric(thighShankScore)}
                        </p>
                    </div>

                </div>
            </section>

            {/* Data Source */}
            <div className="text-xs text-[#718096]">
                Data source: {rankingData?.source || 'No experimental results loaded'}
                {rankingData?.units && ` · RMSE units: ${rankingData.units}`}
            </div>
        </div>
    );
};

export default SensorPairRanking;