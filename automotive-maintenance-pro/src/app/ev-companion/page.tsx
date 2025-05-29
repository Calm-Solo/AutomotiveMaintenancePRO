'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Battery from '@/components/Battery';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BatteryData {
  currentCharge: number;
  maxRange: number;
  lastChargeDate: string;
  degradation: number;
}

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  chargerType: string;
  available: boolean;
}

interface BatteryHealthRecord {
  date: string;
  maxRange: number;
  efficiency: number;
  temperature: number;
}

interface BatteryPrediction {
  monthsFromNow: number;
  predictedHealth: number;
  confidence: number;
}

export default function EVCompanion() {
  const [batteryData, setBatteryData] = useState<BatteryData>({
    currentCharge: 80,
    maxRange: 300,
    lastChargeDate: new Date().toISOString(),
    degradation: 95,
  });

  const [purchaseDate, setPurchaseDate] = useState('');
  const [projectedMileage, setProjectedMileage] = useState(0);

  const calculateInitialBatteryHealth = (purchaseDate: string) => {
    if (!purchaseDate) return 100;

    const purchaseDateObj = new Date(purchaseDate);
    const currentDate = new Date();
    const yearsOwned = currentDate.getFullYear() - purchaseDateObj.getFullYear();

    // Simple linear degradation model (2% per year)
    const degradation = Math.max(0, 100 - (yearsOwned * 2));
    return degradation;
  };

  const [destination, setDestination] = useState('');
  const [nearbyStations, setNearbyStations] = useState<ChargingStation[]>([]);
  const [batteryHistory, setBatteryHistory] = useState<BatteryHealthRecord[]>(
    [
      { date: '2025-01', maxRange: 310, efficiency: 96, temperature: 75 },
      { date: '2025-02', maxRange: 308, efficiency: 95, temperature: 72 },
      { date: '2025-03', maxRange: 305, efficiency: 94, temperature: 78 },
      { date: '2025-04', maxRange: 302, efficiency: 93, temperature: 80 },
      { date: '2025-05', maxRange: 300, efficiency: 92, temperature: 82 },
    ]
  );

  const [predictions, setPredictions] = useState<BatteryPrediction[]>(
    [
      { monthsFromNow: 6, predictedHealth: 90, confidence: 95 },
      { monthsFromNow: 12, predictedHealth: 87, confidence: 90 },
      { monthsFromNow: 24, predictedHealth: 82, confidence: 85 },
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-blue-950/70 shadow-lg">
        <Link href="/" className="text-white text-xl font-bold">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Current Battery Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Current Battery Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-center">
              <Battery charge={batteryData.currentCharge} />
            </div>
            <div className="space-y-4">
              <div className="bg-blue-900/40 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Current Health:</span>
                    <span className="text-blue-100 font-bold">{batteryData.degradation}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Original Range:</span>
                    <span className="text-blue-100 font-bold">320 miles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Current Max Range:</span>
                    <span className="text-blue-100 font-bold">{batteryData.maxRange} miles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Battery Data Input Form */}
          <form className="mt-4 space-y-4">
            <div>
              <label htmlFor="purchaseDate" className="block text-blue-100 text-sm font-medium mb-2">
                EV Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="projectedMileage" className="block text-blue-100 text-sm font-medium mb-2">
                Projected Future Mileage
              </label>
              <input
                type="number"
                id="projectedMileage"
                name="projectedMileage"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              className="w-full py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
            >
              Update Battery Info
            </button>
          </form>
        </motion.div>

        {/* Historical Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Battery Health History</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={batteryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
                <XAxis dataKey="date" stroke="#93c5fd" />
                <YAxis stroke="#93c5fd" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b', 
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#93c5fd' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="maxRange" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Battery Health Prediction</h2>
          <div className="space-y-6">
            {predictions.map((prediction) => (
              <div 
                key={prediction.monthsFromNow} 
                className="bg-blue-900/40 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-100">
                    {prediction.monthsFromNow} months from now:
                  </span>
                  <span className="text-blue-100 font-bold">
                    {prediction.predictedHealth}%
                  </span>
                </div>
                <div className="w-full bg-blue-900/40 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${prediction.predictedHealth}%` }}
                  />
                </div>
                <div className="text-sm text-blue-200 mt-2">
                  Confidence: {prediction.confidence}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}