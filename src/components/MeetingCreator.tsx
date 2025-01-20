import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Meeting, Person } from '../types';
import { ParticipantWheel } from './ParticipantWheel';

interface MeetingCreatorProps {
  onMeetingCreated: (meeting: Meeting) => void;
}

export function MeetingCreator({ onMeetingCreated }: MeetingCreatorProps) {
  const [meetingName, setMeetingName] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [participants, setParticipants] = useState<Person[]>([]);

  const handleCreateMeeting = () => {
    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      name: meetingName,
      participants,
      selectedModerators: []
    }
    onMeetingCreated(newMeeting)
    setMeetingName('')
    setParticipants([])
  }

  const handleAddParticipant = () => {
    if (participantName.trim()) {
      const newParticipant: Person = {
        id: uuidv4(),
        name: participantName.trim(),
      };
      setParticipants([...participants, newParticipant]);
      setParticipantName('');
    }
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-500 dark:text-white">Create New Meeting</h2>
      
      <div className="flex gap-8">
        <div className="w-1/2 space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Meeting Name
            </label>
            <input
              type="text"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-50 text-gray-900 border-2 border-gray-300 dark:border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-3 dark:bg-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Participant Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddParticipant();
                  }
                }}
                className="mt-1 block w-full rounded-md bg-gray-50 text-gray-900 border-2 border-gray-300 dark:border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-3 dark:bg-gray-600 dark:text-white"
              />
              <button
                onClick={handleAddParticipant}
                className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-500 dark:text-white">Participants:</h3>
            {participants.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {participants.map((participant) => (
                  <li
                    key={participant.id}
                    className="flex items-center justify-between p-2 bg-gray-50 text-gray-500 dark:bg-gray-700 rounded-md dark:text-white"
                  >
                    {participant.name}
                    <button
                      onClick={() => setParticipants(participants.filter(p => p.id !== participant.id))}
                      className="bg-red-500 hover:bg-red-600 text-white hover:text-red-200 dark:text-red-400 dark:hover:text-red-300 dark:bg-black"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No participants added yet.</p>
            )}
          </div>

          <button
            onClick={handleCreateMeeting}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50"
            disabled={!meetingName.trim() || participants.length === 0}
          >
            Create Meeting
          </button>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          {participants.length > 0 ? (
            <ParticipantWheel participants={participants} />
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-center">
              Add participants to see the wheel
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 