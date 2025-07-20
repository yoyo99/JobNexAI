import { motion } from 'framer-motion';

interface CircularProgressBarProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const CircularProgressBar = ({ 
  progress, 
  size = 60, 
  strokeWidth = 5,
  color = 'text-primary-500'
}: CircularProgressBarProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const circleVariants = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: offset,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-zinc-700"
          fill="transparent"
          stroke="currentColor"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={color}
          fill="transparent"
          stroke="currentColor"
          strokeDasharray={circumference}
          variants={circleVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
      <span className="absolute text-sm font-bold text-zinc-700 dark:text-zinc-200">
        {Math.round(progress)}%
      </span>
    </div>
  );
};
