import Link from 'next/link'
import { Brain, Heart, Shield, Users, TrendingUp, BookOpen, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 z-50 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MBT</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/knowledge" className="text-sm text-gray-600 hover:text-gray-900">Resources</Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Sign in</Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 text-center bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Autism Support Platform
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Understanding Autism,<br />
            <span className="text-blue-600">One Family at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Evidence-based tools to help parents, caregivers, and therapists assess, plan, implement, and track developmental outcomes for children with ASD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-lg"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required · Free plan available</p>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Evidence-Based</div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> HIPAA-Inspired Security</div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Parent-First Design</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Clinically Reviewed</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> 10,000+ Families</div>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">A Complete Support System</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">From first concerns to ongoing progress, MBT supports every step of the autism journey.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: '🔍', title: 'Assess', color: 'bg-blue-50 border-blue-200', desc: 'Standardized screenings and developmental evaluations' },
              { icon: '📋', title: 'Plan', color: 'bg-purple-50 border-purple-200', desc: 'AI-generated personalized goals and therapy plans' },
              { icon: '▶️', title: 'Implement', color: 'bg-green-50 border-green-200', desc: 'Daily activities with step-by-step guidance' },
              { icon: '📊', title: 'Track', color: 'bg-orange-50 border-orange-200', desc: 'Progress monitoring with visual dashboards' },
              { icon: '✨', title: 'Improve', color: 'bg-teal-50 border-teal-200', desc: 'AI continuously optimizes recommendations' },
            ].map((pillar) => (
              <div key={pillar.title} className={`${pillar.color} border rounded-2xl p-6 text-center`}>
                <div className="text-4xl mb-3">{pillar.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{pillar.title}</h3>
                <p className="text-gray-600 text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 text-lg">20 integrated modules working together for your child's development</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: 'AI Autism Coach', desc: 'Get instant, personalized guidance from an evidence-based AI trained on autism best practices.' },
              { icon: Shield, title: 'M-CHAT-R Screening', desc: 'Administer validated developmental screenings and get risk assessments with professional guidance.' },
              { icon: TrendingUp, title: 'Progress Dashboard', desc: 'Visualize your child\'s growth across all domains with beautiful charts and milestone tracking.' },
              { icon: BookOpen, title: '1,000+ Activities', desc: 'Structured therapy activities across speech, OT, ABA, social skills, and more.' },
              { icon: Heart, title: 'Smart Goal Generator', desc: 'AI creates personalized SMART goals based on your child\'s profile and assessments.' },
              { icon: Users, title: 'Professional Network', desc: 'Connect with verified speech therapists, OTs, psychologists, and special educators.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-800 text-sm font-medium">
            <strong>Important:</strong> MBT is not a substitute for professional diagnosis, treatment, or medical advice.
            Our tools are designed to support — not replace — qualified healthcare professionals.
            Always consult a licensed clinician for your child's care.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Start Supporting Your Child Today</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of families using MBT to navigate autism with confidence.</p>
          <Link
            href="/register"
            className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2 text-lg"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MBT</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/about" className="hover:text-gray-900">About</Link>
              <Link href="/features" className="hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
              <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} MBT – Mind, Behavior & Therapy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
