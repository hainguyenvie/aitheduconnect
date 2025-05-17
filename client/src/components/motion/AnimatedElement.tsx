import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: "fadeIn" | "slideUp" | "slideRight" | "slideLeft" | "scale" | "bounce" | "rotate";
  once?: boolean;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: "some" | "all" | number;
  };
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  bounce: {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
  }
};

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  animation = "fadeIn",
  once = false,
  viewport,
}) => {
  const selectedAnimation = animationVariants[animation];
  
  return (
    <motion.div
      className={className}
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.animate}
      viewport={viewport}
      transition={{ 
        duration, 
        delay,
        ...(selectedAnimation.animate.transition || {})
      }}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn: React.FC<Omit<AnimatedElementProps, "animation">> = (props) => (
  <AnimatedElement {...props} animation="fadeIn" />
);

export const SlideUp: React.FC<Omit<AnimatedElementProps, "animation">> = (props) => (
  <AnimatedElement {...props} animation="slideUp" />
);

export const SlideRight: React.FC<Omit<AnimatedElementProps, "animation">> = (props) => (
  <AnimatedElement {...props} animation="slideRight" />
);

export const SlideLeft: React.FC<Omit<AnimatedElementProps, "animation">> = (props) => (
  <AnimatedElement {...props} animation="slideLeft" />
);

export const Scale: React.FC<Omit<AnimatedElementProps, "animation">> = (props) => (
  <AnimatedElement {...props} animation="scale" />
);

export const Bounce: React.FC<Omit<AnimatedElementProps, "animation">> = (props) => (
  <AnimatedElement {...props} animation="bounce" />
);

export const Rotate: React.FC<Omit<AnimatedElementProps, "animation">> = (props) => (
  <AnimatedElement {...props} animation="rotate" />
);

export const staggeredChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const staggeredItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export const StaggerContainer: React.FC<{ 
  children: ReactNode, 
  className?: string,
  delay?: number,
  staggerDelay?: number
}> = ({ 
  children, 
  className = "", 
  delay = 0,
  staggerDelay = 0.1
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ 
  children: ReactNode, 
  className?: string,
  customVariants?: any
}> = ({ 
  children, 
  className = "",
  customVariants
}) => {
  return (
    <motion.div
      className={className}
      variants={customVariants || staggeredItemVariants}
    >
      {children}
    </motion.div>
  );
};

export const hoverScaleEffect = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export const hoverElevateEffect = {
  whileHover: {
    y: -5,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  }
};

export const hoverGlowEffect = (color: string = "rgba(236, 72, 153, 0.4)") => ({
  whileHover: {
    boxShadow: `0 0 15px ${color}`,
    transition: { duration: 0.2 }
  }
});

export const pulsateEffect = {
  animate: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};