import { useParams } from 'react-router-dom'

export default function SharedEventPage() {
  const { code } = useParams()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Shared Event</h1>
      <p className="text-gray-500">Loading event for share code: {code}...</p>
    </div>
  )
}
