import React from 'react';

export const PakistanFlag = ({ width = 24, height = 16, className = '', style = {} }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      width={width}
      height={height}
      className={`pakistan-flag-svg ${className}`}
      style={{
        borderRadius: '3px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
      aria-label="Flag of Pakistan"
      title="Islamic Republic of Pakistan"
    >
      {/* Green Field */}
      <rect width="900" height="600" fill="#01411C" />
      {/* White Stripe on Hoist */}
      <rect width="225" height="600" fill="#FFFFFF" />
      {/* Crescent Base White Circle */}
      <circle cx="562.5" cy="300" r="180" fill="#FFFFFF" />
      {/* Crescent Inner Green Circle */}
      <circle cx="612" cy="246" r="165" fill="#01411C" />
      {/* Five-Pointed Star tilted towards upper-right */}
      <polygon
        points="630,215 640.5,247.4 674.5,247.4 647,267.4 657.5,299.8 630,279.8 602.5,299.8 613,267.4 585.5,247.4 619.5,247.4"
        fill="#FFFFFF"
        transform="rotate(-38 630 257)"
      />
    </svg>
  );
};

export default PakistanFlag;
