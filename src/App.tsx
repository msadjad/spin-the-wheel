import './utils/theme'
import { useState } from 'react'
import { MeetingCreator } from './components/MeetingCreator'
import { ModeratorPicker } from './components/ModeratorPicker'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Meeting } from './types'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', [])
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId)

  return (
    <div className="min-w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <ThemeToggle />
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
