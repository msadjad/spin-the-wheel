import './utils/theme'
import { useState } from 'react'
import { MeetingCreator } from './components/MeetingCreator'
import { ModeratorPicker } from './components/ModeratorPicker'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Meeting, Person } from './types'
import { ThemeToggle } from './components/ThemeToggle'
import { ParticipantWheel } from './components/ParticipantWheel'

function App() {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', [])
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  const participants = [{id: '1', name: 'John'}, {id: '2', name: 'Jane'}, {id: '3', name: 'Jim'}, {id: '4', name: 'Jill'}];
  const [selectedParticipant, setSelectedParticipant] = useState<Person | null>(participants[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheel = () => {
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * participants.length);
    setTimeout(() => {
      setSelectedParticipant(participants[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId)

  return (
    <div className="min-w-full min-h-screen bg-gray-100 dark:bg-gray-900 pt-10">
      <ThemeToggle />
      <ParticipantWheel participants={participants} selectedParticipant={selectedParticipant} onSpinEnd={spinWheel}/>
      <div className="flex flex-col items-center">
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
      </div>
      <div className="container mx-auto px-4 py-8">
        {!selectedMeeting ? (
          <>
            <MeetingCreator onMeetingCreated={(meeting) => setMeetings([...meetings, meeting])} />
            {meetings.length > 0 && (
              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Existing Meetings</h2>
                <div className="space-y-2">
                  {meetings.map((meeting) => (
                    <button
                      key={meeting.id}
                      onClick={() => setSelectedMeetingId(meeting.id)}
                      className="w-full p-4 text-left text-gray-900 bg-gray-50 border-2 border-gray-300 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {meeting.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedMeetingId(null)}
              className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
               ← Back to Meetings
            </button>
            <ModeratorPicker meeting={selectedMeeting} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
