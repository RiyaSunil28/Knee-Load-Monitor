import { KneeMomentDataPoint, SensorConfigOption } from '../types';

interface ReplayStep {
    kam_true: number[];
    kam_est: number[];
    kfm_true: number[];
    kfm_est: number[];
}

interface ReplaySubject {
    id: string;
    steps: ReplayStep[];
}

interface ReplayFile {
    source: string;
    model: string;
    units: string;
    subjects: ReplaySubject[];
}

export interface ReplayIndex {
    source: string;
    model: string;
    subjects: { id: string; stepCount: number }[];
}

export type ReplayIndexResult =
    | { ok: true; index: ReplayIndex }
    | { ok: false; reason: string };

export interface ReplayDataResult {
    data: KneeMomentDataPoint[];
    source: string;
    model: string;
}

export type ReplayStepResult =
    | { ok: true; result: ReplayDataResult }
    | { ok: false; reason: string };

const POINTS_PER_STEP = 101;

/** Each sensor option has its own results file in the public folder. */
export const REPLAY_FILES: Record<SensorConfigOption, string> = {
    '8 IMUs (baseline)': '/replay_data.json',
    '2 IMUs: best pair': '/replay_2imu.json',
};

// Each file is read once and kept, so changing person or step does not refetch it.
const cachedFiles = new Map<string, Promise<{ file: ReplayFile | null; reason: string }>>();

/** True for each sensor option whose results file loads and is valid. */
export async function checkAvailableConfigs(): Promise<Record<SensorConfigOption, boolean>> {
    const entries = await Promise.all(
        (Object.keys(REPLAY_FILES) as SensorConfigOption[]).map(async (config) => {
            const { file } = await readFile(config);
            return [config, file !== null] as const;
        })
    );
    return Object.fromEntries(entries) as Record<SensorConfigOption, boolean>;
}

/** Accepts "%BW·BH", "%BW*BH", "%BW.BH", "%BW BH" and similar spellings. */
const isExpectedUnit = (units: unknown): boolean =>
    typeof units === 'string' &&
    units.replace(/\s/g, '').replace(/[·*.•⋅]/g, '').toUpperCase() === '%BWBH';

const isValidArray = (arr: unknown): arr is number[] =>
    Array.isArray(arr) &&
    arr.length === POINTS_PER_STEP &&
    arr.every((value) => typeof value === 'number' && Number.isFinite(value));

const readFile = (config: SensorConfigOption): Promise<{ file: ReplayFile | null; reason: string }> => {
    const url = REPLAY_FILES[config];
    const cached = cachedFiles.get(url);
    if (cached) return cached;

    const request = fetch(url)
        .then(async (response) => {
            if (!response.ok) {
                return { file: null, reason: `${url.slice(1)} was not found in the public folder.` };
            }

            const file = (await response.json()) as ReplayFile;

            if (!isExpectedUnit(file.units)) {
                return {
                    file: null,
                    reason: `Units in ${url.slice(1)} are "${String(file.units)}". Expected %BW·BH.`,
                };
            }

            if (!Array.isArray(file.subjects) || file.subjects.length === 0) {
                return { file: null, reason: `${url.slice(1)} has no subjects.` };
            }

            return { file, reason: '' };
        })
        .catch(() => ({
            file: null,
            reason: `${url.slice(1)} could not be read.`,
        }));

    cachedFiles.set(url, request);
    return request;
};

/** Lists the people and number of steps available in replay_data.json. */
export async function loadReplayIndex(config: SensorConfigOption): Promise<ReplayIndexResult> {
    const { file, reason } = await readFile(config);

    if (!file) {
        return { ok: false, reason };
    }

    return {
        ok: true,
        index: {
            source: file.source,
            model: file.model,
            subjects: file.subjects.map((subject) => ({
                id: subject.id,
                stepCount: Array.isArray(subject.steps) ? subject.steps.length : 0,
            })),
        },
    };
}

/** Returns one step (1-based) of one person, with a reason if it cannot be shown. */
export async function loadReplayStep(
    config: SensorConfigOption,
    subjectId: string,
    stepNumber: number
): Promise<ReplayStepResult> {
    const { file, reason } = await readFile(config);

    if (!file) {
        return { ok: false, reason };
    }

    const subject = file.subjects.find((item) => item.id === subjectId);

    if (!subject) {
        return { ok: false, reason: `Person "${subjectId}" is not in the results file.` };
    }

    const step = subject.steps?.[stepNumber - 1];

    if (!step) {
        return { ok: false, reason: `Step ${stepNumber} is not available for ${subjectId}.` };
    }

    if (
        !isValidArray(step.kam_true) ||
        !isValidArray(step.kam_est) ||
        !isValidArray(step.kfm_true) ||
        !isValidArray(step.kfm_est)
    ) {
        return {
            ok: false,
            reason: `Step ${stepNumber} of ${subjectId} must have ${POINTS_PER_STEP} finite numbers in each curve.`,
        };
    }

    const data: KneeMomentDataPoint[] = step.kam_true.map((_, index) => ({
        stancePercent: index,
        labKAM: step.kam_true[index],
        modelKAM: step.kam_est[index],
        labKFM: step.kfm_true[index],
        modelKFM: step.kfm_est[index],
    }));

    return { ok: true, result: { data, source: file.source, model: file.model } };
}
