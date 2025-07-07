import { useState, useEffect } from 'react'
import { JobAd, JobApplication, AppConfig, SearchFilters } from '../types'

// Mock data for development
const mockJobAds: JobAd[] = [
  {
    id: '1',
    businessId: 'business-1',
    businessName: 'Los Santos Police Department',
    businessLogo: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    jobTitle: 'Police Officer',
    jobDescription: 'Join the LSPD and help keep Los Santos safe. We are looking for dedicated individuals who want to serve and protect the community. Full training provided.',
    hourlyPay: 85,
    validUntilDate: '2025-02-15',
    photos: [
      'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/8728426/pexels-photo-8728426.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    createdAt: '2025-01-10',
    citizenId: 'citizen-boss-1',
    applications: []
  },
  {
    id: '2',
    businessId: 'business-2',
    businessName: 'Burger Shot',
    businessLogo: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    jobTitle: 'Kitchen Staff',
    jobDescription: 'Fast-paced kitchen environment. Experience preferred but not required. Flexible hours available.',
    hourlyPay: 25,
    validUntilDate: '2025-01-25',
    photos: [
      'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    createdAt: '2025-01-08',
    citizenId: 'citizen-boss-2',
    applications: []
  },
  {
    id: '3',
    businessId: 'business-3',
    businessName: 'Premium Deluxe Motorsport',
    businessLogo: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    jobTitle: 'Car Salesperson',
    jobDescription: 'Sell luxury vehicles to discerning customers. Commission-based pay with excellent earning potential.',
    hourlyPay: 45,
    validUntilDate: '2025-02-01',
    photos: [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    createdAt: '2025-01-05',
    citizenId: 'citizen-boss-3',
    applications: []
  }
]

const mockConfig: AppConfig = {
  isDev: true,
  theme: 'light',
  citizenId: 'citizen-123',
  businessId: 'business-1',
  businessLogo: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  isBoss: true
}

export const useJobHub = () => {
  const [jobAds, setJobAds] = useState<JobAd[]>([])
  const [config, setConfig] = useState<AppConfig>(mockConfig)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    loadJobAds()
    loadConfig()
    loadFavorites()
  }, [])

  const loadJobAds = async () => {
    setLoading(true)
    try {
      if (config.isDev) {
        // Development mode - use mock data
        setJobAds(mockJobAds)
      } else {
        // Production mode - fetch from backend
        const data = await fetchNui<JobAd[]>('getJobAds')
        setJobAds(data || [])
      }
    } catch (error) {
      console.error('Failed to load job ads:', error)
      setJobAds(mockJobAds) // Fallback to mock data
    } finally {
      setLoading(false)
    }
  }

  const loadConfig = async () => {
    try {
      if (config.isDev) {
        setConfig(mockConfig)
      } else {
        const data = await fetchNui<AppConfig>('getAppConfig')
        setConfig(data || mockConfig)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
      setConfig(mockConfig)
    }
  }

  const loadFavorites = async () => {
    try {
      if (config.isDev) {
        setFavorites(['1'])
      } else {
        const data = await fetchNui<string[]>('getFavorites')
        setFavorites(data || [])
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  const createJobAd = async (jobData: Omit<JobAd, 'id' | 'createdAt' | 'applications' | 'citizenId'>) => {
    try {
      if (config.isDev) {
        const newAd: JobAd = {
          ...jobData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          applications: [],
          citizenId: config.citizenId
        }
        setJobAds(prev => [newAd, ...prev])
        return newAd
      } else {
        const newAd = await fetchNui<JobAd>('createJobAd', jobData)
        if (newAd) {
          setJobAds(prev => [newAd, ...prev])
        }
        return newAd
      }
    } catch (error) {
      console.error('Failed to create job ad:', error)
      throw error
    }
  }

  const updateJobAd = async (id: string, updates: Partial<JobAd>) => {
    try {
      if (config.isDev) {
        setJobAds(prev => prev.map(ad => ad.id === id ? { ...ad, ...updates } : ad))
      } else {
        await fetchNui('updateJobAd', { id, updates })
        setJobAds(prev => prev.map(ad => ad.id === id ? { ...ad, ...updates } : ad))
      }
    } catch (error) {
      console.error('Failed to update job ad:', error)
      throw error
    }
  }

  const deleteJobAd = async (id: string) => {
    try {
      if (config.isDev) {
        setJobAds(prev => prev.filter(ad => ad.id !== id))
      } else {
        await fetchNui('deleteJobAd', { id })
        setJobAds(prev => prev.filter(ad => ad.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete job ad:', error)
      throw error
    }
  }

  const applyToJob = async (jobId: string) => {
    try {
      if (config.isDev) {
        const application: JobApplication = {
          id: Date.now().toString(),
          jobId,
          citizenId: config.citizenId,
          citizenName: 'John Doe',
          appliedAt: new Date().toISOString(),
          status: 'pending'
        }
        setJobAds(prev => prev.map(ad => 
          ad.id === jobId 
            ? { ...ad, applications: [...ad.applications, application] }
            : ad
        ))
      } else {
        await fetchNui('applyToJob', { jobId })
        loadJobAds() // Refresh to get updated applications
      }
    } catch (error) {
      console.error('Failed to apply to job:', error)
      throw error
    }
  }

  const toggleFavorite = async (jobId: string) => {
    try {
      const isFavorited = favorites.includes(jobId)
      const newFavorites = isFavorited 
        ? favorites.filter(id => id !== jobId)
        : [...favorites, jobId]
      
      setFavorites(newFavorites)
      
      if (!config.isDev) {
        await fetchNui('toggleFavorite', { jobId, isFavorited: !isFavorited })
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const getMyAds = () => {
    return jobAds.filter(ad => ad.citizenId === config.citizenId)
  }

  const getFilteredAds = (filters: SearchFilters) => {
    return jobAds.filter(ad => {
      const matchesQuery = !filters.query || 
        ad.jobTitle.toLowerCase().includes(filters.query.toLowerCase()) ||
        ad.jobDescription.toLowerCase().includes(filters.query.toLowerCase())
      
      const matchesPay = ad.hourlyPay >= filters.minPay && 
        (filters.maxPay === 0 || ad.hourlyPay <= filters.maxPay)
      
      const matchesBusiness = !filters.businessName || 
        ad.businessName.toLowerCase().includes(filters.businessName.toLowerCase())
      
      const isNotExpired = new Date(ad.validUntilDate) > new Date()
      
      return matchesQuery && matchesPay && matchesBusiness && isNotExpired
    })
  }

  return {
    jobAds,
    config,
    loading,
    favorites,
    createJobAd,
    updateJobAd,
    deleteJobAd,
    applyToJob,
    toggleFavorite,
    getMyAds,
    getFilteredAds,
    loadJobAds
  }
}