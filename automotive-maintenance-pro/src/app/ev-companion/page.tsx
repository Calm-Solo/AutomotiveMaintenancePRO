'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BatteryDisplay from '@/components/BatteryDisplay';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateBatteryDegradation } from '@/utils/batteryDegradation';
import RangeGauge from '@/components/RangeGauge';

interface BatteryData {
  currentCharge: number;
  maxRange: number;
  lastChargeDate: string;
  degradation: number;
  initialMileage: number;  // Mileage when purchased
  currentMileage: number;  // Current mileage
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
  // Update initial state with valid default values
  const [batteryData, setBatteryData] = useState<BatteryData>({
    currentCharge: 100, // Start at 100%
    maxRange: 320, // Default max range
    lastChargeDate: new Date().toISOString(),
    degradation: 100, // Start at 100% health
    initialMileage: 0,
    currentMileage: 0,
  });

  const [purchaseDate, setPurchaseDate] = useState('');
  const [projectedMileage, setProjectedMileage] = useState(0);
  const [purchaseDateError, setPurchaseDateError] = useState('');
  const [projectedMileageError, setProjectedMileageError] = useState('');

  // Add new state for validation and additional factors
  const [errors, setErrors] = useState({
    initialMileage: '',
    currentMileage: '',
    projectedMileage: '',
  });

  const [climateZone, setClimateZone] = useState(75); // Default temperature
  const [fastChargingFrequency, setFastChargingFrequency] = useState(0.2); // Default 20%

  // Add state for driving style
  const [drivingStyle, setDrivingStyle] = useState('Normal');
  const [temperature, setTemperature] = useState(75); // Default temperature
  const [estimatedRange, setEstimatedRange] = useState(320); // Default to max range

  // Calculate estimated range whenever relevant factors change
  const calculateEstimatedRange = () => {
    // Base range (assuming a full charge)
    const baseRange = batteryData.maxRange || 320;
    let adjustedRange = baseRange;

    // Apply battery health factor (ensure it's a valid number)
    const healthFactor = (batteryData.degradation || 100) / 100;
    adjustedRange *= healthFactor;

    // Apply temperature impact
    if (temperature < 32) {
      adjustedRange *= 0.7; // 30% reduction in cold weather
    } else if (temperature > 95) {
      adjustedRange *= 0.85; // 15% reduction in hot weather
    }

    // Apply driving style impact
    switch (drivingStyle) {
      case 'Aggressive':
        adjustedRange *= 0.8;
        break;
      case 'Conservative':
        adjustedRange *= 1.2;
        break;
      default: // Normal
        break;
    }

    return Math.round(adjustedRange);
  };

  // Remove automatic calculation - only calculate when button is pressed
  // useEffect(() => {
  //   const newEstimatedRange = calculateEstimatedRange();
  //   setEstimatedRange(newEstimatedRange);
  // }, [batteryData.maxRange, batteryData.degradation, temperature, drivingStyle]);

  // Validation function
  const validateMileageInputs = (
    initial: number,
    current: number,
    projected: number
  ): boolean => {
    let isValid = true;
    const newErrors = {
      initialMileage: '',
      currentMileage: '',
      projectedMileage: '',
    };

    if (initial < 0) {
      newErrors.initialMileage = 'Initial mileage cannot be negative';
      isValid = false;
    }

    if (current < initial) {
      newErrors.currentMileage = 'Current mileage cannot be less than initial mileage';
      isValid = false;
    }

    if (projected < current) {
      newErrors.projectedMileage = 'Projected mileage cannot be less than current mileage';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update battery health calculation - only called when button is pressed
  const updateBatteryHealth = () => {
    if (!validateMileageInputs(
      batteryData.initialMileage,
      batteryData.currentMileage,
      projectedMileage
    )) {
      return;
    }

    // Validate purchase date
    if (!purchaseDate) {
      return;
    }

    const purchaseDateObj = new Date(purchaseDate);
    const currentDate = new Date();
    const yearsOwned = (currentDate.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // Ensure we have valid numbers for calculation
    const milesDriven = Math.max(0, (batteryData.currentMileage || 0) - (batteryData.initialMileage || 0));
    
    const degradation = calculateBatteryDegradation({
      age: Math.max(0, yearsOwned),
      milesDriven: milesDriven,
      climate: climateZone || 75,
      chargingHabits: fastChargingFrequency || 0.2,
    });

    // Calculate current charge based on degradation and environmental factors
    const maxPossibleCharge = Math.max(0, 100 - degradation);
    const temperatureImpact = Math.abs((climateZone || 75) - 70) * 0.1; // Optimal temperature around 70°F
    const currentCharge = Math.max(0, Math.min(maxPossibleCharge - temperatureImpact, 100));

    // Update max range based on degradation
    const originalRange = 320; // miles
    const currentMaxRange = Math.round(originalRange * (maxPossibleCharge / 100));

    setBatteryData(prev => ({
      ...prev,
      currentCharge: Math.round(currentCharge),
      degradation: Math.round(100 - degradation),
      maxRange: currentMaxRange
    }));
  };

  // Update the calculation function to consider both time and mileage
  const calculateInitialBatteryHealth = (
    purchaseDate: string,
    initialMileage: number,
    currentMileage: number
  ) => {
    if (!purchaseDate) return 100;

    const purchaseDateObj = new Date(purchaseDate);
    const currentDate = new Date();
    const yearsOwned = currentDate.getFullYear() - purchaseDateObj.getFullYear();
    const mileageDriven = currentMileage - initialMileage;

    // Degradation based on time (2% per year)
    const timeBasedDegradation = yearsOwned * 2;
    
    // Degradation based on mileage (1% per 10,000 miles)
    const mileageBasedDegradation = (mileageDriven / 10000);

    // Combined degradation (weighted average)
    const totalDegradation = Math.max(0, (timeBasedDegradation + mileageBasedDegradation) / 2);
    return Math.max(0, 100 - totalDegradation);
  };

  const calculateProjectedBatteryHealth = (
    initialHealth: number,
    projectedMileage: number
  ) => {
    // Simple degradation model (1% degradation per 10,000 miles)
    const degradation = Math.max(0, initialHealth - (projectedMileage / 10000));
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

  const [isCalculated, setIsCalculated] = useState(false);

  // Add form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    // Calculate battery health and range only when button is pressed
    updateBatteryHealth();
    const newEstimatedRange = calculateEstimatedRange();
    setEstimatedRange(newEstimatedRange);
    setIsCalculated(true);
  };

  // Update the validation function
  const validateInputs = (): boolean => {
    let isValid = true;
    
    if (!purchaseDate) {
      setPurchaseDateError('Please enter the purchase date');
      isValid = false;
    }

    if (batteryData.initialMileage < 0) {
      setErrors(prev => ({
        ...prev,
        initialMileage: 'Initial mileage cannot be negative'
      }));
      isValid = false;
    }

    if (batteryData.currentMileage < batteryData.initialMileage) {
      setErrors(prev => ({
        ...prev,
        currentMileage: 'Current mileage must be greater than initial mileage'
      }));
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-blue-950/70 shadow-lg">
        <Link href="/" className="text-white text-xl font-bold">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div>
          {/* Battery Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-center">
              <BatteryDisplay charge={batteryData.currentCharge} degradation={batteryData.degradation} isCalculated={isCalculated} />
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

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Purchase Date Input */}
            <div>
              <label className="block text-blue-100 text-sm font-medium mb-2">
                EV Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={purchaseDate}
                onChange={(e) => {
                  const newPurchaseDate = e.target.value;
                  setPurchaseDate(newPurchaseDate);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {purchaseDateError && (
                <p className="text-red-500 text-sm mt-1">{purchaseDateError}</p>
              )}
            </div>
            
            {/* Initial Mileage Input */}
            <div>
              <label htmlFor="initialMileage" className="block text-blue-100 text-sm font-medium mb-2">
                Initial Mileage When Purchased
              </label>
              <input
                type="number"
                id="initialMileage"
                value={batteryData.initialMileage}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setBatteryData(prev => ({
                    ...prev,
                    initialMileage: value
                  }));
                  validateMileageInputs(value, batteryData.currentMileage, projectedMileage);
                }}
                className={`w-full px-4 py-2 rounded-lg bg-white/5 border ${
                  errors.initialMileage ? 'border-red-500' : 'border-blue-300/30'
                } text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.initialMileage && (
                <p className="text-red-500 text-sm mt-1">{errors.initialMileage}</p>
              )}
            </div>

            {/* Current Mileage Input */}
            <div>
              <label htmlFor="currentMileage" className="block text-blue-100 text-sm font-medium mb-2">
                Current Mileage
              </label>
              <input
                type="number"
                id="currentMileage"
                name="currentMileage"
                value={batteryData.currentMileage}
                onChange={(e) => {
                  const newCurrentMileage = Number(e.target.value);
                  setBatteryData(prev => ({
                    ...prev,
                    currentMileage: newCurrentMileage
                  }));
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.currentMileage && (
                <p className="text-red-500 text-sm mt-1">{errors.currentMileage}</p>
              )}
            </div>

            {/* Projected Mileage Input */}
            <div>
              <label htmlFor="projectedMileage" className="block text-blue-100 text-sm font-medium mb-2">
                Projected Mileage
              </label>
              <input
                type="number"
                id="projectedMileage"
                name="projectedMileage"
                value={projectedMileage}
                onChange={(e) => {
                  const newProjectedMileage = Number(e.target.value);
                  setProjectedMileage(newProjectedMileage);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {projectedMileageError && (
                <p className="text-red-500 text-sm mt-1">{projectedMileageError}</p>
              )}
            </div>

            {/* Driving Style Selector */}
            <div className="mt-6">
              <label className="block text-blue-100 text-sm font-medium mb-2">
                Driving Style
              </label>
              <select
                value={drivingStyle}
                onChange={(e) => setDrivingStyle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 
                  text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Conservative">Conservative</option>
                <option value="Normal">Normal</option>
                <option value="Aggressive">Aggressive</option>
              </select>
            </div>
            
            {/* Calculate Battery Health Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 
                text-white font-medium transition-colors"
            >
              Calculate Battery Health
            </button>

            {/* Range Reassurance Section */}
            <motion.div>
              <h2 className="text-2xl font-semibold text-white mb-6">Range Reassurance</h2>
              <RangeGauge
                currentRange={estimatedRange}
                maxRange={batteryData.maxRange}
                batteryHealth={batteryData.degradation}
                temperature={temperature}
                drivingStyle={drivingStyle}
                isCalculated={isCalculated}
              />
            </motion.div>
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