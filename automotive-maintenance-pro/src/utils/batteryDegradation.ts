interface DegradationFactors {
  age: number;           // Years
  milesDriven: number;   // Total miles driven
  climate: number;       // Average temperature in Fahrenheit
  chargingHabits: number; // Fast charging frequency (0-1)
}

export const calculateBatteryDegradation = (factors: DegradationFactors): number => {
  // Base degradation from age (1.5% per year)
  const ageDegradation = factors.age * 1.5;

  // Mileage-based degradation (0.7% per 10k miles)
  const mileageDegradation = (factors.milesDriven / 10000) * 0.7;

  // Temperature impact (additional degradation for extreme temperatures)
  let climateDegradation = 0;
  if (factors.climate > 95 || factors.climate < 32) {
    climateDegradation = factors.age * 0.5; // Additional 0.5% per year in extreme climates
  }

  // Fast charging impact (up to 1% additional degradation per year)
  const chargingDegradation = factors.age * factors.chargingHabits;

  // Calculate total degradation
  const totalDegradation = ageDegradation + mileageDegradation + climateDegradation + chargingDegradation;

  // Ensure degradation doesn't exceed 100%
  return Math.min(Math.max(0, totalDegradation), 100);
};