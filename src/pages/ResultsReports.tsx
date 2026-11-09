import React, { useEffect, useState } from 'react';
import { Download, Printer, FileBarChart, Info } from 'lucide-react';

interface MomentMetrics {
  rmse: number | null;
  relativeRmse: number | null;
  correlation: number | null;
}

interface ModelEvaluation {
  model: string;
  sensorSet: string;
  kam: MomentMetrics;
  kfm: MomentMetrics;
}

interface EvaluationFile {
  source?: string;
  results: ModelEvaluation[];
}

const SENSOR_CONFIGURATIONS = [
  '8 IMUs (baseline)',
  '2 IMUs: best pair',
];

const MODEL_NAMES = [
  'Baseline LSTM',
  'Base paper model (BiLSTM autoencoder + VGP)',
  'Our model',
];

const EMPTY_METRICS: MomentMetrics = {
  rmse: null,
  relativeRmse: null,
  correlation: null,
};

const formatMetric = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '–';
  }

  return value.toFixed(3);
};

export const ResultsReports: React.FC = () => {
  const [results, setResults] = useState<ModelEvaluation[]>([]);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      try {
        const response = await fetch('/evaluation_results.json');

        if (!response.ok) {
          throw new Error('Evaluation results file not found');
        }

        const file: EvaluationFile = await response.json();

        if (!Array.isArray(file.results)) {
          throw new Error('Invalid evaluation results format');
        }

        if (!cancelled) {
          setResults(file.results);
          setSource(file.source ?? null);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setSource(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadResults();

    return () => {
      cancelled = true;
    };
  }, []);

  // Show known sensor configurations without inventing results.
  const displayRows: ModelEvaluation[] =
    results.length > 0
      ? results
      : MODEL_NAMES.flatMap((model) =>
        SENSOR_CONFIGURATIONS.map((sensorSet) => ({
          model,
          sensorSet,
          kam: EMPTY_METRICS,
          kfm: EMPTY_METRICS,
        }))
      );

  // Export only the model-evaluation table.
  const handleExportCSV = () => {
    const headers = [
      'Model',
      'Sensor Configuration',
      'KAM RMSE',
      'KAM Relative RMSE',
      'KAM Correlation',
      'KFM RMSE',
      'KFM Relative RMSE',
      'KFM Correlation',
    ];

    const rows = displayRows.map((item) => [
      item.model,
      item.sensorSet,
      formatMetric(item.kam?.rmse),
      formatMetric(item.kam?.relativeRmse),
      formatMetric(item.kam?.correlation),
      formatMetric(item.kfm?.rmse),
      formatMetric(item.kfm?.relativeRmse),
      formatMetric(item.kfm?.correlation),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((value) => `"${value}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `KneeLoad_Model_Evaluation_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-7 print:p-0">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D]">
            Results &amp; Reports
          </h2>

          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Evaluation of estimated knee adduction and flexion moments.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-[#E5E7EB] text-[#172B4D] text-xs font-semibold hover:bg-[#F7F8FA] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#E87532]" />
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#E87532] text-white text-xs font-semibold hover:bg-[#D46222] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Evaluation Information */}
      <section className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-[#F0F4F8]">
            <FileBarChart className="w-5 h-5 text-[#172B4D]" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">
              Model Evaluation
            </h3>

            <p className="text-xs text-[#718096] mt-1 leading-relaxed">
              Performance is evaluated separately for the Knee Adduction
              Moment (KAM) and Knee Flexion Moment (KFM).
              All moment values use %BW·BH.
            </p>
          </div>
        </div>
      </section>

      {/* Results Source */}
      <section
        className={`rounded-lg border p-4 flex items-start gap-3 ${results.length > 0
          ? 'bg-[#ECFDF5] border-[#A7F3D0]'
          : 'bg-[#FFF8F1] border-[#F5D5BD]'
          }`}
      >
        <Info
          className={`w-4 h-4 mt-0.5 shrink-0 ${results.length > 0 ? 'text-[#16A36A]' : 'text-[#E87532]'
            }`}
        />

        <div>
          <p className="text-xs font-semibold text-[#172B4D]">
            {loading
              ? 'Loading evaluation results...'
              : results.length > 0
                ? 'Experimental evaluation results loaded'
                : 'No experimental evaluation results available'}
          </p>

          <p className="text-xs text-[#718096] mt-1">
            {results.length > 0
              ? `Source: ${source ?? 'Not specified in results file'}`
              : 'Values are shown as dashes until actual model evaluation results are available.'}
          </p>
        </div>
      </section>

      {/* Evaluation Table */}
      <section
        className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden"
        aria-labelledby="evaluation-table-heading"
      >
        <div className="p-5 border-b border-[#E5E7EB]">
          <h3
            id="evaluation-table-heading"
            className="text-sm font-bold text-[#172B4D]"
          >
            Model Performance Comparison
          </h3>

          <p className="text-xs text-[#718096] mt-1">
            RMSE, relative RMSE and correlation for KAM and KFM.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
                <th
                  rowSpan={2}
                  className="px-4 py-4 text-[11px] font-semibold text-[#718096] uppercase tracking-wider"
                >
                  Model
                </th>

                <th
                  rowSpan={2}
                  className="px-4 py-4 text-[11px] font-semibold text-[#718096] uppercase tracking-wider"
                >
                  Sensor Configuration
                </th>

                <th
                  colSpan={3}
                  className="px-4 py-3 text-center text-[11px] font-bold text-[#E87532] uppercase tracking-wider border-l border-[#E5E7EB]"
                >
                  KAM (%BW·BH)
                </th>

                <th
                  colSpan={3}
                  className="px-4 py-3 text-center text-[11px] font-bold text-[#172B4D] uppercase tracking-wider border-l border-[#E5E7EB]"
                >
                  KFM (%BW·BH)
                </th>
              </tr>

              <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
                {[
                  'RMSE',
                  'Relative RMSE',
                  'Correlation',
                  'RMSE',
                  'Relative RMSE',
                  'Correlation',
                ].map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className={`px-4 py-3 text-[10px] font-semibold text-[#718096] whitespace-nowrap ${index === 0 || index === 3
                      ? 'border-l border-[#E5E7EB]'
                      : ''
                      }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {displayRows.map((item, index) => (
                <tr
                  key={`${item.model}-${item.sensorSet}-${index}`}
                  className="hover:bg-[#F7F8FA]/70 transition-colors"
                >
                  <td className="px-4 py-4 font-medium text-[#172B4D]">
                    {item.model || '–'}
                  </td>

                  <td className="px-4 py-4 text-[#202B3C]">
                    {item.sensorSet}
                  </td>

                  <td className="px-4 py-4 border-l border-[#E5E7EB] font-mono tabular-nums text-[#E87532]">
                    {formatMetric(item.kam?.rmse)}
                  </td>

                  <td className="px-4 py-4 font-mono tabular-nums text-[#202B3C]">
                    {formatMetric(item.kam?.relativeRmse)}
                  </td>

                  <td className="px-4 py-4 font-mono tabular-nums text-[#202B3C]">
                    {formatMetric(item.kam?.correlation)}
                  </td>

                  <td className="px-4 py-4 border-l border-[#E5E7EB] font-mono tabular-nums text-[#172B4D]">
                    {formatMetric(item.kfm?.rmse)}
                  </td>

                  <td className="px-4 py-4 font-mono tabular-nums text-[#202B3C]">
                    {formatMetric(item.kfm?.relativeRmse)}
                  </td>

                  <td className="px-4 py-4 font-mono tabular-nums text-[#202B3C]">
                    {formatMetric(item.kfm?.correlation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F7F8FA]">
          <p className="text-[11px] text-[#718096]">
            RMSE: Root Mean Square Error. Relative RMSE: RMSE relative to
            the reference signal. Correlation: agreement between estimated
            and reference signals.
          </p>
        </div>
      </section>
    </div>
  );
};