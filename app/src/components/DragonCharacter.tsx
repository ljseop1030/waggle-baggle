interface DragonCharacterProps {
  size?: 'tiny' | 'small' | 'medium' | 'large';
  emotion?: 'neutral' | 'worried';
}

export function DragonCharacter({ size = 'medium', emotion = 'neutral' }: DragonCharacterProps) {
  const sizeClasses = {
    tiny: 'w-3 h-3 text-[8px]',
    small: 'w-6 h-6 text-xs',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-32 h-32 text-6xl',
  };

  // SVG Dragon Character
  if (size === 'large' || size === 'medium') {
    return (
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="50" cy="60" rx="25" ry="20" fill="#2d3748" />
        
        {/* Head */}
        <circle cx="50" cy="35" r="18" fill="#2d3748" />
        
        {/* Ears/Horns */}
        <ellipse cx="38" cy="25" rx="4" ry="8" fill="#2d3748" />
        <ellipse cx="62" cy="25" rx="4" ry="8" fill="#2d3748" />
        
        {/* Eyes */}
        {emotion === 'worried' ? (
          <>
            <ellipse cx="43" cy="33" rx="4" ry="5" fill="white" />
            <ellipse cx="57" cy="33" rx="4" ry="5" fill="white" />
            <circle cx="43" cy="34" r="2" fill="#1a202c" />
            <circle cx="57" cy="34" r="2" fill="#1a202c" />
            {/* Worried eyebrows */}
            <path d="M 40 28 Q 43 26 46 28" stroke="#1a202c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 54 28 Q 57 26 60 28" stroke="#1a202c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="43" cy="35" rx="3" ry="4" fill="white" />
            <ellipse cx="57" cy="35" rx="3" ry="4" fill="white" />
            <circle cx="43" cy="36" r="2" fill="#1a202c" />
            <circle cx="57" cy="36" r="2" fill="#1a202c" />
          </>
        )}
        
        {/* Snout */}
        <ellipse cx="50" cy="42" rx="8" ry="6" fill="#4a5568" />
        
        {/* Nose */}
        <ellipse cx="48" cy="41" rx="1.5" ry="2" fill="#1a202c" />
        <ellipse cx="52" cy="41" rx="1.5" ry="2" fill="#1a202c" />
        
        {/* Mouth */}
        {emotion === 'worried' ? (
          <path d="M 45 47 Q 50 45 55 47" stroke="#1a202c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 45 46 Q 50 48 55 46" stroke="#1a202c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}
        
        {/* Belly */}
        <ellipse cx="50" cy="62" rx="15" ry="12" fill="#4a5568" opacity="0.5" />
        
        {/* Arms */}
        <ellipse cx="32" cy="58" rx="6" ry="10" fill="#2d3748" />
        <ellipse cx="68" cy="58" rx="6" ry="10" fill="#2d3748" />
        
        {/* Legs */}
        <ellipse cx="40" cy="78" rx="5" ry="8" fill="#2d3748" />
        <ellipse cx="60" cy="78" rx="5" ry="8" fill="#2d3748" />
        
        {/* Tail */}
        <path
          d="M 70 65 Q 85 60 90 70"
          stroke="#2d3748"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Simple emoji for small sizes
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      🐉
    </div>
  );
}
