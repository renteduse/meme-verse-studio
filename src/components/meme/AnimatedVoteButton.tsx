
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedVoteButtonProps {
  type: 'up' | 'down' | 'flag';
  count?: number; 
  active?: boolean;
  onClick: () => void;
  flagged?: boolean;
}

const AnimatedVoteButton: React.FC<AnimatedVoteButtonProps> = ({ 
  type, 
  count, 
  active = false, 
  onClick,
  flagged = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  let icon = null;
  let bgColorClass = '';
  let activeColorClass = '';
  let label = '';

  switch (type) {
    case 'up':
      icon = <ThumbsUp className="w-4 h-4" />;
      bgColorClass = 'bg-green-100 dark:bg-green-900/20';
      activeColorClass = 'text-green-600 dark:text-green-400';
      label = 'Upvote';
      break;
    case 'down':
      icon = <ThumbsDown className="w-4 h-4" />;
      bgColorClass = 'bg-red-100 dark:bg-red-900/20';
      activeColorClass = 'text-red-600 dark:text-red-400';
      label = 'Downvote';
      break;
    case 'flag':
      icon = <Flag className="w-4 h-4" />;
      bgColorClass = 'bg-orange-100 dark:bg-orange-900/20';
      activeColorClass = 'text-orange-600 dark:text-orange-400';
      label = flagged ? 'Flagged' : 'Flag';
      break;
  }

  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          isAnimating 
            ? { 
                scale: [1, 1.2, 1], 
                rotate: type === 'flag' ? [0, 20, -20, 0] : [0, 0] 
              } 
            : {}
        }
        transition={{ duration: 0.4 }}
        onClick={handleClick}
        className={cn(
          "px-2 py-1 rounded-full flex items-center gap-1",
          bgColorClass,
          active ? activeColorClass : "text-gray-600 dark:text-gray-400",
          type === 'flag' && flagged ? "text-red-500 dark:text-red-400" : ""
        )}
        aria-label={label}
      >
        {icon}
        {typeof count === 'number' && (
          <span className="text-xs font-medium">{count}</span>
        )}
      </motion.button>
    </div>
  );
};

export default AnimatedVoteButton;
