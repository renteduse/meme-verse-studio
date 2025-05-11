
import { forwardRef } from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientButtonProps extends ButtonProps {
  gradientFrom?: string;
  gradientTo?: string;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientFrom = "from-brand-purple", gradientTo = "to-brand-indigo", children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          `relative bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300`,
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GradientButton.displayName = "GradientButton";

// Animated version with Framer Motion
export const AnimatedGradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientFrom = "from-brand-purple", gradientTo = "to-brand-indigo", children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={cn(
            `relative bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300`,
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedGradientButton.displayName = "AnimatedGradientButton";

export default GradientButton;
