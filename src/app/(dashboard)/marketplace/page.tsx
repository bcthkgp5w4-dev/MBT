import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MapPin, Video, Star, CheckCircle, Globe } from 'lucide-react'

const SAMPLE_THERAPISTS = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    specialty: ['Speech Therapy', 'AAC', 'Early Intervention'],
    credentials: ['CCC-SLP', 'PhD'],
    bio: 'Specialized in AAC and early language intervention for children with autism. 12 years of experience.',
    years_experience: 12,
    location: 'New York, NY',
    telehealth: true,
    languages: ['English', 'Spanish'],
    hourly_rate: 180,
    rating: 4.9,
    review_count: 47,
    verified: true,
  },
  {
    id: '2',
    name: 'James Rodriguez, OTR/L',
    specialty: ['Occupational Therapy', 'Sensory Integration', 'Fine Motor'],
    credentials: ['OTR/L', 'SIPT Certified'],
    bio: 'Expert in sensory integration and sensory processing disorders. Creates personalized sensory diets.',
    years_experience: 8,
    location: 'Los Angeles, CA',
    telehealth: true,
    languages: ['English'],
    hourly_rate: 150,
    rating: 4.8,
    review_count: 32,
    verified: true,
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    specialty: ['ABA Therapy', 'Behavior Analysis', 'Parent Training'],
    credentials: ['BCBA-D', 'PhD'],
    bio: 'Board Certified Behavior Analyst with expertise in naturalistic ABA and family coaching.',
    years_experience: 15,
    location: 'Chicago, IL',
    telehealth: true,
    languages: ['English', 'Hindi', 'Gujarati'],
    hourly_rate: 200,
    rating: 5.0,
    review_count: 58,
    verified: true,
  },
  {
    id: '4',
    name: 'Lisa Chen, LCSW',
    specialty: ['Play Therapy', 'Social Skills', 'Family Support'],
    credentials: ['LCSW', 'RPT'],
    bio: 'Licensed therapist specializing in DIR/Floortime and social skills development for children with ASD.',
    years_experience: 10,
    location: 'San Francisco, CA',
    telehealth: false,
    languages: ['English', 'Mandarin'],
    hourly_rate: 165,
    rating: 4.7,
    review_count: 24,
    verified: true,
  },
]

export default async function MarketplacePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Therapists</h1>
        <p className="text-gray-500 mt-1">Connect with verified autism specialists</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Specialties</option>
          <option>Speech Therapy</option>
          <option>Occupational Therapy</option>
          <option>ABA Therapy</option>
          <option>Play Therapy</option>
          <option>Psychology</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Locations</option>
          <option>Telehealth Only</option>
          <option>In-Person</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Languages</option>
          <option>English</option>
          <option>Spanish</option>
          <option>Mandarin</option>
          <option>Hindi</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4">
        {SAMPLE_THERAPISTS.map((therapist) => (
          <div key={therapist.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {therapist.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{therapist.name}</h3>
                      {therapist.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{therapist.credentials.join(' · ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-900">${therapist.hourly_rate}/hr</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600">{therapist.rating}</span>
                      <span className="text-xs text-gray-400">({therapist.review_count})</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">{therapist.bio}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {therapist.specialty.map((s) => (
                    <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{therapist.location}</span>
                  {therapist.telehealth && <span className="flex items-center gap-1 text-green-600"><Video className="w-3 h-3" />Telehealth</span>}
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{therapist.languages.join(', ')}</span>
                  <span>{therapist.years_experience} years exp.</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
              <button className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50">
                View Profile
              </button>
              <button className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-xl hover:bg-blue-700">
                Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> MBT does not endorse specific therapists. Please verify credentials, check insurance coverage,
          and conduct your own due diligence when selecting a healthcare provider.
        </p>
      </div>
    </div>
  )
}
