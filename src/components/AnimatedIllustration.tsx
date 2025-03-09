import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedIllustrationProps {
  icon: LucideIcon;
  color?: string;
  size?: number;
  title?: string;
  subtitle?: string;
}

const AnimatedIllustration = ({
  icon: Icon,
  color = '#590d82',
  size = 64,
  title,
  subtitle
}: AnimatedIllustrationProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
        className="relative mb-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="absolute inset-0 rounded-full bg-purple-100 blur-xl opacity-50"
          style={{ width: size * 1.5, height: size * 1.5 }}
        />
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className="relative flex items-center justify-center p-4 bg-white rounded-full shadow-md"
          style={{ width: size * 1.2, height: size * 1.2 }}
        >
          <Icon size={size} color={color} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {title && (
        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-gray-800 mb-1 text-center"
        >
          {title}
        </motion.h3>
      )}

      {subtitle && (
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 text-center max-w-xs"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedIllustration;
