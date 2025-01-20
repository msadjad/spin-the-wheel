import { useState } from 'react';
import { Meeting, Person } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ParticipantWheel } from './ParticipantWheel';

export function ModeratorPicker({ meeting }: { meeting: Meeting }) {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', []);
  const [spinning, setSpinning] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState<Person | null>(null);

  const remainingParticipants = meeting.participants.filter(
    (p) => !meeting.selectedModerators.find((m) => m.id === p.id)
  );

  const handleSpin = () => {
    if (remainingParticipants.length === 0 || spinning) return;

    setSpinning(true);
    const duration = 2000 + Math.random() * 1000;
    
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingParticipants.length);
      setSelectedModerator(remainingParticipants[randomIndex]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);
      
      const finalModerator = remainingParticipants[
        Math.floor(Math.random() * remainingParticipants.length)
      ];
      setSelectedModerator(finalModerator);

      // Update the meeting in local storage
      const updatedMeetings = meetings.map((m) => {
        if (m.id === meeting.id) {
          return {
            ...m,
            selectedModerators: [...m.selectedModerators, finalModerator],
          };
        }
        return m;
      });
      setMeetings(updatedMeetings);
    }, duration);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{meeting.name}</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          {remainingParticipants.length > 0 ? (
            <ParticipantWheel participants={remainingParticipants} isSpinning={spinning} />
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