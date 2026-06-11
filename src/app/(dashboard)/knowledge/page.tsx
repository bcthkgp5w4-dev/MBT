import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Library, Clock, ArrowRight } from 'lucide-react'
import { KNOWLEDGE_CATEGORIES } from '@/lib/constants'

const FEATURED_ARTICLES = [
  {
    id: '1',
    title: 'Understanding Autism Spectrum Disorder: A Complete Guide for Parents',
    excerpt: 'A comprehensive overview of ASD, including signs, diagnosis, and evidence-based treatment approaches.',
    category: 'Autism Basics',
    read_time_minutes: 8,
    featured: true,
    tags: ['overview', 'diagnosis', 'treatment'],
  },
  {
    id: '2',
    title: 'The M-CHAT-R: What It Means and What to Do Next',
    excerpt: 'Understanding your child\'s M-CHAT-R results and the steps to take after a positive screen.',
    category: 'Assessments & Diagnosis',
    read_time_minutes: 5,
    featured: false,
    tags: ['screening', 'mchat', 'diagnosis'],
  },
  {
    id: '3',
    title: 'Applied Behavior Analysis (ABA): What Every Parent Should Know',
    excerpt: 'A balanced look at ABA therapy, its benefits, modern approaches, and how to evaluate quality services.',
    category: 'Therapies',
    read_time_minutes: 10,
    featured: true,
    tags: ['ABA', 'therapy', 'intervention'],
  },
  {
    id: '4',
    title: 'Managing Meltdowns: Strategies That Actually Work',
    excerpt: 'Evidence-based strategies for preventing, de-escalating, and recovering from emotional meltdowns.',
    category: 'Behavior',
    read_time_minutes: 7,
    featured: false,
    tags: ['meltdowns', 'behavior', 'regulation'],
  },
  {
    id: '5',
    title: 'Sleep and Autism: Why Sleep Problems Are Common and How to Help',
    excerpt: 'Understanding sleep challenges in autism and science-backed strategies for better sleep routines.',
    category: 'Sleep',
    read_time_minutes: 6,
    featured: false,
    tags: ['sleep', 'routine', 'melatonin'],
  },
  {
    id: '6',
    title: 'AAC: Augmentative and Alternative Communication Explained',
    excerpt: 'Everything you need to know about AAC devices, apps, and strategies for nonverbal and minimally verbal children.',
    category: 'Communication',
    read_time_minutes: 9,
    featured: true,
    tags: ['AAC', 'nonverbal', 'communication'],
  },
  {
    id: '7',
    title: 'Your Child\'s First IEP: A Parent\'s Complete Guide',
    excerpt: 'How to prepare for, participate in, and advocate effectively at your child\'s IEP meeting.',
    category: 'Education & School',
    read_time_minutes: 12,
    featured: false,
    tags: ['IEP', 'school', 'education', 'advocacy'],
  },
  {
    id: '8',
    title: 'Sensory Processing in Autism: Understanding Your Child\'s Sensory Needs',
    excerpt: 'A deep dive into sensory processing differences and practical strategies for home and school.',
    category: 'Autism Basics',
    read_time_minutes: 8,
    featured: false,
    tags: ['sensory', 'OT', 'processing'],
  },
]

export default async function KnowledgePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Center</h1>
        <p className="text-gray-500 mt-1">Evidence-based articles and resources for autism families</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {['All', ...KNOWLEDGE_CATEGORIES.slice(0, 8)].map((cat) => (
          <button key={cat} className={`shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-colors ${cat === 'All' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Featured Articles</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {FEATURED_ARTICLES.filter(a => a.featured).map((article) => (
            <Link key={article.id} href={`/knowledge/${article.id}`} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{article.category}</span>
              <h3 className="font-semibold text-gray-900 mt-3 mb-2 text-sm leading-snug">{article.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time_minutes} min</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Articles */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">All Articles</h2>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {FEATURED_ARTICLES.map((article) => (
            <Link key={article.id} href={`/knowledge/${article.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">{article.category}</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{article.excerpt}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time_minutes}m</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
