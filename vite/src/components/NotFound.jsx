import { Link } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🌾</div>
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-stone-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700">
        <HomeIcon className="w-4 h-4" /> Back home
      </Link>
    </div>
  )
}
