'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import Image from 'next/image';
import Link from 'next/link';

// Vehicle record interface
interface VehicleRecord {
  make: string;
  model: string;
  mileage: number;
  notes?: string;
}

// Form status types
type FormStatus = 'idle' | 'saving' | 'success' | 'error';

export default function RecordTracker() {
  const [formData, setFormData] = useState<VehicleRecord>({
    make: '',
    model: '',
    mileage: 0,
    notes: '',
  });
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Animation springs
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const logoAnimation = useSpring({
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mileage' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.make.trim() || !formData.model.trim() || formData.mileage <= 0) {
      setFormStatus('error');
      return;
    }

    setFormStatus('saving');

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/records', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFormStatus('success');
      
      // Clear form after success
      setTimeout(() => {
        setFormData({
          make: '',
          model: '',
          mileage: 0,
          notes: '',
        });
        setFormStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error saving record:', error);
      setFormStatus('error');
    }
  };

  const getStatusMessage = () => {
    switch (formStatus) {
      case 'saving':
        return { text: 'Saving...', color: 'text-blue-300' };
      case 'success':
        return { text: 'Record saved!', color: 'text-green-300' };
      case 'error':
        return { text: 'Something went wrong.', color: 'text-red-300' };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

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
                  className="block px-6 py-3 text-base text-blue-100 bg-blue-800/50 
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <animated.div style={fadeIn}>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Record Tracker</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Log your vehicle maintenance records and never lose track of your service history
            </p>
          </motion.div>

          {/* Record Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Add New Record</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Make Field */}
              <div>
                <label htmlFor="make" className="block text-blue-100 text-sm font-medium mb-2">
                  Make *
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-300/30 
                    text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 
                    focus:ring-blue-400 transition-colors"
                  placeholder="e.g., Toyota"
                />
              </div>

              {/* Model Field */}
              <div>
                <label htmlFor="model" className="block text-blue-100 text-sm font-medium mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-300/30 
                    text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 
                    focus:ring-blue-400 transition-colors"
                  placeholder="e.g., Corolla"
                />
              </div>

              {/* Mileage Field */}
              <div>
                <label htmlFor="mileage" className="block text-blue-100 text-sm font-medium mb-2">
                  Current Mileage *
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage || ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-300/30 
                    text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 
                    focus:ring-blue-400 transition-colors"
                  placeholder="e.g., 50000"
                />
              </div>

              {/* Notes Field */}
              <div>
                <label htmlFor="notes" className="block text-blue-100 text-sm font-medium mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-300/30 
                    text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 
                    focus:ring-blue-400 transition-colors resize-none"
                  placeholder="Add any maintenance notes, service details, or observations..."
                />
              </div>

              {/* Status Message */}
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center py-3 px-4 rounded-lg bg-white/5 border border-blue-300/30`}
                >
                  <span className={`font-medium ${statusMessage.color}`}>
                    {statusMessage.text}
                  </span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={formStatus === 'saving'}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200
                  ${formStatus === 'saving' 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  } text-white shadow-lg`}
              >
                {formStatus === 'saving' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving Record...</span>
                  </div>
                ) : (
                  'Save Record'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Future Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Coming Soon</h3>
            <div className="space-y-3 text-blue-100">
              <p>• View your maintenance history</p>
              <p>• Track mileage intervals</p>
              <p>• Set maintenance reminders</p>
              <p>• Export service records</p>
            </div>
          </motion.div>
        </animated.div>
      </div>
    </div>
  );
} 