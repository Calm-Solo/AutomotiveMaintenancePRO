'use client';
import { useSpring, animated, SpringValue } from '@react-spring/web';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link'; // Import the Link component
import { useState } from 'react';

// Maintenance task interface
interface MaintenanceTask {
  id: number;
  task: string;
  interval: number;
  tip: string;
  due: string;
  dueMileage?: number;
}

// Default maintenance tasks
const defaultMaintenanceTasks: MaintenanceTask[] = [
  { id: 1, task: 'Oil Change', interval: 5000, tip: 'Use manufacturer-recommended oil.', due: '2025-06-01' },
  { id: 2, task: 'Brake Inspection', interval: 15000, tip: 'Check pads and fluid.', due: '2025-06-15' },
  { id: 3, task: 'Tire Pressure Check', interval: 3000, tip: 'Check all four tires.', due: '2025-05-25' },
  { id: 4, task: 'Air Filter Replacement', interval: 12000, tip: 'Replace if dirty.', due: '2025-07-01' },
];

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
  });
  const [projectedTasks, setProjectedTasks] = useState<MaintenanceTask[]>([]);
  const [futureMileage, setFutureMileage] = useState(0);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const logoAnimation = useSpring({
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const calculateProjectedTasks = (mileage: number) => {
    const tasks = defaultMaintenanceTasks.map(task => {
      const nextDue = Math.ceil(mileage / task.interval) * task.interval;
      return {
        ...task,
        dueMileage: nextDue,
      };
    });
    setProjectedTasks(tasks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vehicle Info Submitted:', vehicleInfo);
    calculateProjectedTasks(Number(vehicleInfo.mileage));
  };

  const getUrgencyInfo = (progress: number) => {
    if (progress >= 90) {
      return {
        color: 'bg-red-500',
        text: 'Urgent',
        textColor: 'text-red-300',
      };
    } else if (progress >= 75) {
      return {
        color: 'bg-yellow-500',
        text: 'Due Soon',
        textColor: 'text-yellow-300',
      };
    } else if (progress >= 50) {
      return {
        color: 'bg-blue-500',
        text: 'Upcoming',
        textColor: 'text-blue-300',
      };
    }
    return {
      color: 'bg-green-500',
        text: 'On Track',
        textColor: 'text-green-300',
      };
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-4 bg-blue-950/70 shadow-lg">
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <animated.div
                style={logoAnimation}
                className="w-16 h-16 relative"
              >
                <Image
                  src="/images/ap_1.png"
                  alt="Automotive Pro Logo"
                  width={64}
                  height={64}
                  priority
                />
              </animated.div>
              <span className="text-white text-xl font-bold hidden sm:inline">AutoPro</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-screen sm:w-48 rounded-md 
                shadow-lg bg-blue-950/95 backdrop-blur-sm ring-1 ring-white/20 
                border border-blue-800/50 z-50"
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    href="/ai-assistance"
                    className="block px-6 py-3 text-base text-blue-100 hover:bg-blue-800/50 
                    border-b border-blue-800/30 transition-colors"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    AI Assistance
                  </Link>
                  <Link
                    href="/ev-companion"
                    className="block px-6 py-3 text-base text-blue-100 hover:bg-blue-800/50 
                    border-b border-blue-800/30 transition-colors"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    EV Companion
                  </Link>
                  <Link
                    href="/record-tracker"
                    className="block px-6 py-3 text-base text-blue-100 hover:bg-blue-800/50 
                    transition-colors"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Record Tracker
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Development Credit */}
          <Link 
            href="https://www.mcbridetechservices.com" 
            className="text-blue-100 font-medium" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Developed by McBride Tech Services
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4">
          <animated.div style={fadeIn} className="py-10">
            <div className="flex flex-col items-center justify-center space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-white text-center"
              >
                Automotive Maintenance Pro
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-blue-100 text-center max-w-2xl"
              >
                Smart maintenance reminders powered by AI
              </motion.p>
            </div>
          </animated.div>

          {/* Vehicle Information Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Vehicle Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="make" className="block text-blue-100 text-sm font-medium mb-2">
                  Make
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={vehicleInfo.make}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-blue-100 text-sm font-medium mb-2">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={vehicleInfo.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., Corolla"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-blue-100 text-sm font-medium mb-2">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={vehicleInfo.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 20 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="mileage" className="block text-blue-100 text-sm font-medium mb-2">
                  Mileage
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={vehicleInfo.mileage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 50000"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                Submit
              </motion.button>
            </form>
          </motion.div>

          {/* Interactive Timeline */}
          {projectedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Projected Maintenance Timeline</h2>
              {/* Mileage Slider */}
              <div className="mb-6 p-4 bg-blue-900/40 rounded-lg">
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Project Future Mileage
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={Number(vehicleInfo.mileage) || 0}
                    max={(Number(vehicleInfo.mileage) || 0) + 50000}
                    step={1000}
                    value={futureMileage}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFutureMileage(val);
                      // Recalculate projected tasks for the new mileage
                      const tasks = defaultMaintenanceTasks.map(task => {
                        const nextDue = Math.ceil(val / task.interval) * task.interval;
                        return {
                          ...task,
                          dueMileage: nextDue,
                        };
                      });
                      setProjectedTasks(tasks);
                    }}
                    className="w-full accent-blue-500"
                  />
                  <span className="text-white font-medium">
                    {futureMileage} miles
                  </span>
                </div>
              </div>
              {/* Timeline Visualization */}
              <div className="space-y-4">
                {projectedTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-blue-900/40 rounded-lg p-4">
                    <div>
                      <span className="text-lg text-white font-medium">{task.task}</span>
                      <p className="text-blue-300 text-xs mt-1 italic">{task.tip}</p>
                    </div>
                    <span className="text-blue-200 text-sm">Due at {task.dueMileage} miles</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dashboard Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Progress Tracker */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white mb-6">Maintenance Progress</h2>
              <div className="space-y-6">
                {projectedTasks.map(task => {
                  const currentMileage = Number(vehicleInfo.mileage);
                  const progress = ((currentMileage % task.interval) / task.interval) * 100;
                  const milesLeft = task.interval - (currentMileage % task.interval);
                  const urgency = getUrgencyInfo(progress);
                  
                  return (
                    <div key={task.id} className="space-y-2">
                      <div className="flex justify-between items-center text-blue-100">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{task.task}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${urgency.textColor}`}>
                            {urgency.text}
                          </span>
                        </div>
                        <span className="text-sm">{milesLeft} miles left</span>
                      </div>
                      <div className="relative w-full h-4 bg-blue-900/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                          className={`absolute top-0 left-0 h-full ${urgency.color} rounded-full
                            ${progress >= 90 ? 'animate-pulse' : ''}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-blue-300 text-xs italic">{task.tip}</p>
                        <span className={`text-xs font-medium ${urgency.textColor}`}>
                          {Math.round(progress)}% Complete
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
