import { motion } from 'framer-motion';

interface BatteryProps {
  charge: number;
  showPercentage?: boolean;
}

export default function Battery({ charge, showPercentage = true }: BatteryProps) {
  // Get battery color based on charge level
  const getBatteryColor = (level: number) => {
    if (level <= 20) return 'from-red-500 to-red-600';
    if (level <= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-green-400 to-green-500';
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
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white drop-shadow-lg">
              {charge}%
            </span>
          </div>
        )}
      </div>
      <input
        type="date"
        id="purchaseDate"
        name="purchaseDate"
        // value={purchaseDate}
        // onChange={(e) => {
        //   setPurchaseDate(e.target.value);
        //   const initialHealth = calculateInitialBatteryHealth(e.target.value);
        //   setBatteryData({ ...batteryData, degradation: initialHealth });
        // }}
        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}