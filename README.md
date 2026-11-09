# KneeLoad Monitor (dashboard)

Dashboard for the project "Reliable Knee Load Estimation Using Low-Cost Wearable Sensors" (SIH26004).
It shows knee adduction moment (KAM) and knee flexion moment (KFM) estimated from two IMU sensors.
Unit for both: %BW·BH.

## Run

    npm install
    npm run dev       # development
    npm run build     # type-check and production build

Copy `.env.example` to `.env` if you want to change settings.

## Real results go into `public/`

The dashboard shows sample curves and dashes until these files exist. Nothing is invented.

### `public/replay_data.json` (Gait Analysis page)

    {
      "source": "SimTK dataset, held-out people",
      "model": "LSTM baseline",
      "units": "%BW·BH",
      "subjects": [
        { "id": "Person 3",
          "steps": [
            { "kam_true": [101 numbers], "kam_est": [101 numbers],
              "kfm_true": [101 numbers], "kfm_est": [101 numbers] }
          ] }
      ]
    }

- 101 values per curve = 0 to 100 % of stance phase.
- The person list and step count on the page come from this file.
- `public/replay_2imu.json` has the same format and holds the results of the best 2-sensor pair. The "2 IMUs: best pair" option in the Sensors list turns on only when this file exists.
- If a step is invalid, the page says why and shows sample curves.

### `public/sensor_pair_ranking.json` (Sensor Pair Ranking page)

    {
      "source": "5-fold CV, quick model",
      "units": "%BW·BH",
      "results": [
        { "sensorA": "Left Foot", "sensorB": "Chest",
          "kamRmse": 0.5, "kfmRmse": 0.7, "combinedRmse": 0.6 }
      ]
    }

Names must match: Left Foot, Right Foot, Left Shank, Right Shank, Left Thigh, Right Thigh, Waist, Chest.

### `public/evaluation_results.json` (Results page)

See `src/pages/ResultsReports.tsx` for the expected fields (model, sensorSet, kam/kfm rmse, relativeRmse, correlation).

## Status

- Sensor placement (which two body positions) is not decided yet.
- Confidence band and trust warning are coming next.
- Live Monitoring is simulated until the ESP32 hardware is connected.
