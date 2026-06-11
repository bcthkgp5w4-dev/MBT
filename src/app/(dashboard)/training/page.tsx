import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Clock, BookOpen, Award } from 'lucide-react'

const FEATURED_COURSES = [
  {
    id: 'autism-basics',
    title: 'Autism Basics for Families',
    description: 'Understand autism spectrum disorder — what it is, how it presents, and how to support your child.',
    category: 'Autism Basics',
    duration: 60,
    lessons: 8,
    difficulty: 'beginner',
    certificate: true,
    emoji: '🧠',
    color: 'bg-blue-50 border-blue-100',
  },
  {
    id: 'aba-fundamentals',
    title: 'ABA Fundamentals for Parents',
    description: 'Learn the principles of Applied Behavior Analysis and how to apply them at home effectively.',
    category: 'ABA',
    duration: 90,
    lessons: 12,
    difficulty: 'beginner',
    certificate: true,
    emoji: '📊',
    color: 'bg-purple-50 border-purple-100',
  },
  {
    id: 'home-speech',
    title: 'Home Speech Therapy Techniques',
    description: 'Evidence-based communication strategies you can implement at home to support language development.',
    category: 'Speech Therapy',
    duration: 75,
    lessons: 10,
    difficulty: 'intermediate',
    certificate: true,
    emoji: '💬',
    color: 'bg-green-50 border-green-100',
  },
  {
    id: 'ot-basics',
    title: 'Occupational Therapy at Home',
    description: 'Learn sensory integration strategies, fine motor activities, and daily living skill support.',
    category: 'OT',
    duration: 60,
    lessons: 8,
    difficulty: 'beginner',
    certificate: false,
    emoji: '✋',
    color: 'bg-orange-50 border-orange-100',
  },
  {
    id: 'behavior-management',
    title: 'Behavior Management Strategies',
    description: 'Understand behavior functions, crisis prevention, and positive behavior support strategies.',
    category: 'Behavior',
    duration: 90,
    lessons: 11,
    difficulty: 'intermediate',
    certificate: true,
    emoji: '⚡',
    color: 'bg-red-50 border-red-100',
  },
  {
    id: 'school-readiness',
    title: 'School Readiness & IEP Basics',
    description: 'Prepare your child for school, understand IEPs, and advocate effectively in educational settings.',
    category: 'Education',
    duration: 45,
    lessons: 6,
    difficulty: 'beginner',
    certificate: false,
    emoji: '🏫',
    color: 'bg-yellow-50 border-yellow-100',
  },
]

export default async function TrainingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userProgress } = await supabase
    .from('user_course_progress')
    .select('course_id, completed, completed_lessons')
    .eq('profile_id', user.id)

  const progressMap = Object.fromEntries((userProgress || []).map(p => [p.course_id, p]))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Training Academy</h1>
          <p className="text-gray-500 mt-1">Evidence-based courses for autism families</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Available Courses', value: FEATURED_COURSES.length, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
          { label: 'With Certificates', value: FEATURED_COURSES.filter(c => c.certificate).length, icon: Award, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Completed', value: (userProgress || []).filter(p => p.completed).length, icon: GraduationCap, color: 'text-green-600 bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Courses */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURED_COURSES.map((course) => {
          const progress = progressMap[course.id]
          const completedLessons = progress?.completed_lessons?.length || 0
          const progressPct = Math.round((completedLessons / course.lessons) * 100)

          return (
            <div key={course.id} className={`rounded-2xl border ${course.color} p-6 flex flex-col`}>
              <div className="text-4xl mb-3">{course.emoji}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{course.title}</h3>
                {course.certificate && (
                  <Award className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">{course.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}min</span>
                <span>{course.lessons} lessons</span>
                <span className="capitalize">{course.difficulty}</span>
              </div>
              {progress && completedLessons > 0 && (
                <div className="mb-3">
                  <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{completedLessons}/{course.lessons} lessons</p>
                </div>
              )}
              <Link
                href={`/training/${course.id}`}
                className="w-full text-center bg-white border border-gray-200 text-gray-800 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {progress?.completed ? '✓ Completed' : completedLessons > 0 ? 'Continue' : 'Start Course'}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
