import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sprout, Wheat, Leaf, Droplets } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-950 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="relative w-32 h-32 mx-auto">
            {/* Background circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white/20 rounded-full"
            />
            
            {/* Center icon */}
            <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Sprout className="w-16 h-16 text-green-600" />
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white/90 p-2 rounded-full"
            >
              <Wheat className="w-6 h-6 text-amber-600" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white/90 p-2 rounded-full"
            >
              <Droplets className="w-6 h-6 text-cyan-600" />
            </motion.div>

            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -right-2 bg-white/90 p-2 rounded-full"
            >
              <Leaf className="w-6 h-6 text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-5xl text-white mb-2">Chimavet</h1>
          <p className="text-xl text-green-100 mb-8">Smart Agriculture Ecosystem</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-64 mx-auto"
        >
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-white mt-2 text-sm">Loading {progress}%</p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-green-100 mt-8 text-sm"
        >
          Empowering Farmers with Technology
        </motion.p>
      </div>
    </motion.div>
  );
}
