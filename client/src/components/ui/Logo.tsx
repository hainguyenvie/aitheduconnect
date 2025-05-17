import { Link } from "wouter";
import { motion } from "framer-motion";

interface LogoProps {
  variant?: "default" | "light" | "icon-only";
  size?: "small" | "medium" | "large";
}

const Logo = ({ variant = "default", size = "medium" }: LogoProps) => {
  // Size mapping
  const sizeClasses = {
    small: "text-lg",
    medium: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl"
  };

  // Color variants
  const textColor = variant === "light" ? "text-white" : "text-gray-800";
  const primaryColor = variant === "light" ? "#ffffff" : "#ec4899";
  const secondaryColor = variant === "light" ? "#f3e8ff" : "#a855f7";
  
  // Animation for the logo
  const logoAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" } 
    },
    whileHover: { 
      scale: 1.03,
      transition: { duration: 0.2 } 
    }
  };

  // Floating effect for logo elements
  const floatAnimation = {
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };
  
  // Pulse animation
  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };
  
  // Path animation for knowledge bridge
  const pathAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };
  
  // Star animation
  const starAnimation = {
    animate: (i: number) => ({
      scale: [1, i % 3 === 0 ? 1.2 : 1.4, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2 + i * 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: i * 0.2
      }
    })
  };

  return (
    <Link href="/">
      <motion.div 
        className="flex items-center cursor-pointer"
        initial="initial"
        animate="animate"
        whileHover="whileHover"
        variants={logoAnimation}
      >
        {/* Logo Icon */}
        <div className="relative mr-2">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 50 50" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base circle with gradient */}
            <motion.circle 
              cx="25" 
              cy="25" 
              r="20"
              fill="url(#logoGradient)"
              animate={{
                scale: [1, 1.05, 1],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }
              }}
            />
            
            {/* "A" letter */}
            <motion.path
              d="M19 34L23 18H27L31 34H27.5L26.5 30H23.5L22.5 34H19ZM24 22L23 27H27L26 22H24Z"
              fill="white"
              animate={floatAnimation}
            />
            
            {/* Knowledge rays */}
            {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
              <motion.line 
                key={`ray-${i}`}
                x1="25" 
                y1="25" 
                x2={25 + 15 * Math.cos(angle * Math.PI / 180)} 
                y2={25 + 15 * Math.sin(angle * Math.PI / 180)}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
                strokeDasharray="1 2"
                custom={i}
                animate={starAnimation}
              />
            ))}
            
            {/* Stars/sparks */}
            {[40, 85, 130, 175, 220, 265, 310, 355].map((angle, i) => (
              <motion.circle
                key={`star-${i}`}
                cx={25 + 22 * Math.cos(angle * Math.PI / 180)}
                cy={25 + 22 * Math.sin(angle * Math.PI / 180)}
                r="1"
                fill="white"
                custom={i}
                animate={starAnimation}
              />
            ))}
            
            {/* Accent circles */}
            <motion.circle 
              cx="42" 
              cy="15" 
              r="4" 
              fill={secondaryColor}
              variants={pulseAnimation}
              animate="animate"
            />
            
            <motion.circle 
              cx="10" 
              cy="32" 
              r="3" 
              fill={secondaryColor}
              variants={pulseAnimation}
              animate="animate"
              style={{ animationDelay: "0.5s" }}
            />
            
            {/* Gradient definition */}
            <defs>
              <radialGradient 
                id="logoGradient" 
                cx="0" 
                cy="0" 
                r="1" 
                gradientUnits="userSpaceOnUse" 
                gradientTransform="translate(25 20) rotate(90) scale(35)"
              >
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="100%" stopColor={secondaryColor} />
              </radialGradient>
            </defs>
          </svg>
        </div>
        
        {/* Logo Text - Only show if not icon-only */}
        {variant !== "icon-only" && (
          <div className={`font-bold ${sizeClasses[size]} ${textColor} tracking-tight flex items-center`}>
            <motion.div 
              className="relative flex items-center"
              variants={floatAnimation}
              animate="animate"
            >
              <span className={`bg-clip-text text-transparent bg-gradient-to-br from-primary to-pink-500`}>
                Aithedu
              </span>
              
              {/* Knowledge Bridge - connecting path */}
              <div className="relative mx-2 w-8 h-8 overflow-visible">
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0"
                >
                  {/* Main connecting path */}
                  <motion.path
                    d="M2 16 
                       C 8 26, 16 6, 30 16"
                    stroke="url(#pathGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial="hidden"
                    animate="visible"
                    variants={pathAnimation}
                  />
                  
                  {/* Stars/knowledge points */}
                  {[0, 1, 2].map((i) => (
                    <motion.path
                      key={`star-${i}`}
                      d="M16 12l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5z"
                      fill={primaryColor}
                      transform={`translate(${i * 8 - 8}, ${i % 2 === 0 ? -2 : 0}) scale(0.4)`}
                      custom={i}
                      animate={starAnimation}
                    />
                  ))}
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={primaryColor} />
                      <stop offset="100%" stopColor={secondaryColor} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
            
            <motion.span 
              className={`bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-secondary font-extrabold whitespace-nowrap`}
              variants={floatAnimation}
              animate="animate"
              style={{ animationDelay: "0.2s" }}
            >
              Connect
            </motion.span>
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default Logo;