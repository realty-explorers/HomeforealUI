import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

const AnimatedCard = ({
  children,
  delay = 0,
  className = '',
  onClick
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
