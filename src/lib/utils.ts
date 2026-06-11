import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInMonths, differenceInYears } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy') {
  return format(new Date(date), fmt)
}

export function getChildAge(dob: string): string {
  const birthDate = new Date(dob)
  const years = differenceInYears(new Date(), birthDate)
  const months = differenceInMonths(new Date(), birthDate) % 12
  if (years === 0) return `${months} months`
  if (months === 0) return `${years} years`
  return `${years}y ${months}m`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length = 100): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export const DOMAIN_COLORS: Record<string, string> = {
  default: 'text-gray-600 bg-gray-50 border-gray-200',
  communication: 'text-blue-600 bg-blue-50 border-blue-200',
  social: 'text-purple-600 bg-purple-50 border-purple-200',
  behavior: 'text-orange-600 bg-orange-50 border-orange-200',
  adaptive: 'text-green-600 bg-green-50 border-green-200',
  academic: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  motor: 'text-pink-600 bg-pink-50 border-pink-200',
  emotional: 'text-teal-600 bg-teal-50 border-teal-200',
}

export const RISK_COLORS: Record<string, string> = {
  low: 'text-green-700 bg-green-50 border-green-200',
  medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  high: 'text-red-700 bg-red-50 border-red-200',
}
