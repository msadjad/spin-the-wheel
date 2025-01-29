import { useState } from 'react';
import { Meeting, Person } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ParticipantWheel } from './ParticipantWheel';

export function ModeratorPicker({ meeting }: { meeting: Meeting }) {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', []);
  const [spinning, setSpinning] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState<Person | null>(null);

  const remainingParticipants = meeting.participants.filter(
    p => !meeting.selectedModerators.includes(p)
  );

  const handleSpinEnd = () => {
    setSpinning(false);
    setSelectedModerator(selectedModerator);
    setMeetings(prev => 
      prev.map(m => m.id === meeting.id ? {
        ...m,
        participants: m.participants.filter(p => p.id !== selectedModerator.id),
        selectedModerators: [...m.selectedModerators, selectedModerator]
      } : m)
    );
  };

  const handleSpin = () => {
    if (remainingParticipants.length === 0) return;
    setSpinning(true);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{meeting.name}</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          {remainingParticipants.length > 0 ? (
            <ParticipantWheel 
              participants={remainingParticipants} 
              isSpinning={spinning}
              selectedParticipant={selectedModerator}
              onSpinEnd={handleSpinEnd}
            />
          ) : (
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No remaining participants</p>
            </div>
          )}
          
          {selectedModerator && (
            <p className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Selected Moderator: {selectedModerator.name}
            </p>
          )}
        </div>

        <button
          onClick={handleSpin}
          disabled={remainingParticipants.length === 0 || spinning}
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400 dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Remaining Participants:</h3>
          <ul className="mt-2 space-y-2">
            {remainingParticipants.map((participant) => (
              <li
                key={participant.id}
                className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
              >
                {participant.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}