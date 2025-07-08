import { motion } from 'framer-motion';

interface BatteryDisplayProps {
  charge: number;
  degradation: number;
  isCalculated?: boolean;
}

export default function BatteryDisplay({ 
  charge, 
  degradation, 
  isCalculated = false 
}: BatteryDisplayProps) {
  // Show initial state if not calculated, handle NaN values
  const displayCharge = isCalculated && !isNaN(charge) ? charge : 100;
  const displayDegradation = isCalculated && !isNaN(degradation) ? degradation : 100;

  // Get battery color based on charge level
  const getBatteryColor = (level: number) => {
    if (level <= 10) return 'from-red-600 to-red-700';
    if (level <= 25) return 'from-orange-500 to-orange-600';
    if (level <= 50) return 'from-yellow-400 to-yellow-500';
    return 'from-green-400 to-green-500';
  };

  // Get battery health message
  const getBatteryHealthMessage = (level: number) => {
    if (level <= 10) return 'Critical';
    if (level <= 25) return 'Low';
    if (level <= 50) return 'Moderate';
    return 'Good';
  };

  return (
    <div className="relative w-32 h-64">
      {/* Battery Head */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 
        bg-blue-200/20 rounded-t-md border-2 border-blue-200/40" />
      
      {/* Battery Body */}
      <div className="absolute top-4 w-full h-60 rounded-xl border-4 
        border-blue-200/40 overflow-hidden bg-blue-900/40">
        {/* Charge Level */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${charge}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className={`absolute bottom-0 w-full bg-gradient-to-t ${getBatteryColor(charge)}`}
        />
        
        {/* Battery Segments */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-blue-200/20"
            style={{ top: `${25 * (i + 1)}%` }}
          />
        ))}
        
        {/* Percentage Display */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-white drop-shadow-lg">
            {displayCharge}%
          </span>
          <span className="text-sm text-blue-200 mt-1">
            Health: {displayDegradation}%
          </span>
        </div>
      </div>
    </div>
  );
}