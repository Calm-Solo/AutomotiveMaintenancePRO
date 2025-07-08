import { motion } from 'framer-motion';

interface RangeGaugeProps {
  currentRange: number;
  maxRange: number;
  batteryHealth: number;
  temperature: number;
  drivingStyle: string;
  isCalculated?: boolean;
}

export default function RangeGauge({
  currentRange,
  maxRange,
  batteryHealth,
  temperature,
  drivingStyle,
  isCalculated = false
}: RangeGaugeProps) {
  // Show initial state if not calculated, handle NaN values
  const displayRange = isCalculated && !isNaN(currentRange) ? currentRange : maxRange;
  const displayHealth = isCalculated && !isNaN(batteryHealth) ? batteryHealth : 100;

  // Calculate the percentage of range remaining
  const rangePercentage = (displayRange / maxRange) * 100;

  // Get color based on range percentage
  const getGaugeColor = () => {
    if (rangePercentage <= 20) return '#ef4444'; // red
    if (rangePercentage <= 50) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  // Calculate impact factors
  const getWeatherImpact = () => {
    if (temperature < 32) return 'Cold weather reduces range by ~30%';
    if (temperature > 95) return 'Hot weather reduces range by ~15%';
    return 'Optimal temperature for range';
  };

  return (
    <div className="p-6 rounded-xl bg-blue-900/40">
      {/* Adjust the container size */}
      <div className="relative w-full h-48">
        {/* Update viewBox and adjust path coordinates */}
        <svg className="w-full h-full" viewBox="0 0 200 120">
          {/* Background Arc - adjusted y-coordinate */}
          <path
            d="M 20 100 A 80 80 0 1 1 180 100"
            stroke="#1e3a8a"
            strokeWidth="12"
            fill="none"
          />
          {/* Range Indicator - adjusted y-coordinate */}
          <path
            d="M 20 100 A 80 80 0 1 1 180 100"
            stroke={getGaugeColor()}
            strokeWidth="10"
            strokeDasharray={`${rangePercentage * 2.5} 1000`}
            fill="none"
          />
          {/* Adjust text position */}
          <text
            x="100"
            y="70"
            textAnchor="middle"
            className="text-2xl font-bold"
            fill="white"
          >
            {displayRange}
          </text>
          <text
            x="100"
            y="90"
            textAnchor="middle"
            className="text-sm"
            fill="#93c5fd"
          >
            miles remaining
          </text>
        </svg>
      </div>

      {/* Range Factors - no changes needed */}
      <div className="mt-4 space-y-2 text-sm text-blue-100">
        <div className="flex justify-between">
          <span>Battery Health:</span>
          <span>{displayHealth}%</span>
        </div>
        <div className="flex justify-between">
          <span>Weather Impact:</span>
          <span>{getWeatherImpact()}</span>
        </div>
        <div className="flex justify-between">
          <span>Driving Style:</span>
          <span>{drivingStyle}</span>
        </div>
      </div>
    </div>
  );
}