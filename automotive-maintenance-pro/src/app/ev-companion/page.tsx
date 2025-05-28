'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Battery from '@/components/Battery';

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

export default function EVCompanion() {
  const [batteryData, setBatteryData] = useState<BatteryData>({
    currentCharge: 80,
    maxRange: 300,
    lastChargeDate: new Date().toISOString(),
    degradation: 95,
  });

  const [destination, setDestination] = useState('');
  const [nearbyStations, setNearbyStations] = useState<ChargingStation[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-blue-950/70 shadow-lg">
        <Link href="/" className="text-white text-xl font-bold">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Battery Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Battery Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-center">
              <Battery charge={batteryData.currentCharge} />
            </div>
            <div className="space-y-4">
              <div className="bg-blue-900/40 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Max Range:</span>
                    <span className="text-blue-100 font-bold">{batteryData.maxRange} miles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Battery Health:</span>
                    <span className="text-blue-100 font-bold">{batteryData.degradation}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Last Charged:</span>
                    <span className="text-blue-100 font-bold">
                      {new Date(batteryData.lastChargeDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charging Planner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Charging Planner</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 
                text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              className="w-full py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 
                text-white font-medium transition-colors"
            >
              Plan Route
            </button>
          </div>
        </motion.div>

        {/* Nearby Chargers Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Nearby Charging Stations</h2>
          <div className="h-[600px] w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99832.98511966827!2d-121.54413913203288!3d38.56186420144024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac672b28397f9%3A0x921f6aaa74197fdb!2sSacramento%2C%20CA!5e0!3m2!1sen!2sus!4v1748474392649!5m2!1sen!2sus" 
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}