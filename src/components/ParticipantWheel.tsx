import { Person } from '../types';
import { useEffect, useRef } from 'react';

interface ParticipantWheelProps {
  participants: Person[];
  isSpinning: boolean;
  selectedParticipant: Person | null;
}

export function ParticipantWheel({ participants, isSpinning, selectedParticipant }: ParticipantWheelProps) {
  const getRotation = () => {
    if (!selectedParticipant) return 0;
    const index = participants.findIndex(p => p.id === selectedParticipant.id);
    const segmentAngle = 360 / participants.length;
    return isSpinning ? 1800 - (index * segmentAngle) : -(index * segmentAngle);
  };

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div 
        className={`absolute inset-0 rounded-full overflow-hidden
          ${isSpinning ? 'transition-transform duration-[3000ms] ease-out' : 'transition-transform duration-500 ease-out'}`}
        style={{ 
          transform: `rotate(${getRotation()}deg)`,
        }}
      >
        {participants.map((participant, index) => {
          const angle = (360 / participants.length) * index;
          const colorIndex = index % colors.length;
          // Calculate the middle angle for text rotation
          const middleAngle = angle + (360 / participants.length / 2);
          
          return (
            <div
              key={participant.id}
              className={`absolute top-0 left-0 w-1/2 h-full origin-right ${colors[colorIndex]}`}
              style={{
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div 
                className="absolute left-1/2 w-full text-center"
                style={{
                  transform: `rotate(90deg) translateY(-50%)`,
                  transformOrigin: '0 50%',
                }}
              >
                <span className="inline-block text-white font-bold text-sm px-1">
                  {participant.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pointer triangle */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl text-indigo-600 dark:text-indigo-400">
        ▼
      </div>
    </div>
  );
} 