export interface JobAd {
  id: string
  businessId: string
  businessName: string
  businessLogo?: string
  jobTitle: string
  jobDescription: string
  hourlyPay: number
  validUntilDate: string
  photos: string[]
  createdAt: string
  citizenId: string
  applications: JobApplication[]
  isFavorited?: boolean
  phoneNumber?: string
  streetName?: string
  location?: { x: number; y: number; z: number }
}

export interface JobApplication {
  id: string
  jobId: string
  citizenId: string
  citizenName: string
  appliedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface Business {
  id: string
  name: string
  logo?: string
  citizenId: string
}

export interface AppConfig {
  isDev: boolean
  theme: 'light' | 'dark'
  citizenId: string
  businessId?: string
  businessLogo?: string
  isBoss: boolean
}

export interface SearchFilters {
  query: string
  minPay: number
  maxPay: number
  businessName: string
}