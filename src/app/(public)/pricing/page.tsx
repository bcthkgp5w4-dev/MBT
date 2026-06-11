import Link from 'next/link'
import { Brain, CheckCircle, ArrowRight } from 'lucide-react'
import { SUBSCRIPTION_TIERS } from '@/lib/constants'

export default function PricingPage() {
  const tiers = Object.entries(SUBSCRIPTION_TIERS)

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">MBT</span>
          </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-500 text-lg">Choose the plan that fits your family</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map(([key, tier]) => (
            <div
              key={key}
              className={`rounded-2xl border p-6 flex flex-col ${
                key === 'pro' ? 'border-blue-500 bg-blue-600 text-white shadow-lg' : 'border-gray-200 bg-white'
              }`}
            >
              {key === 'pro' && (
                <div className="text-xs font-bold text-blue-200 mb-2 uppercase tracking-wide">Most Popular</div>
              )}
              <h3 className={`text-xl font-bold mb-1 ${key === 'pro' ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
              <div className="mb-4">
                <span className={`text-4xl font-bold ${key === 'pro' ? 'text-white' : 'text-gray-900'}`}>${tier.price}</span>
                <span className={`text-sm ${key === 'pro' ? 'text-blue-200' : 'text-gray-500'}`}>/month</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${key === 'pro' ? 'text-blue-200' : 'text-green-500'}`} />
                    <span className={key === 'pro' ? 'text-blue-100' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  key === 'pro'
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {key === 'free' ? 'Get Started Free' : 'Start Trial'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          All plans include a 14-day free trial. No credit card required for Free plan.
        </p>
      </div>
    </div>
  )
}
