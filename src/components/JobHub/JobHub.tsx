import React, { useState, useEffect } from 'react'
import { Plus, Briefcase, Heart, User, Settings } from 'lucide-react'
import { useJobHub } from '../../hooks/useJobHub'
import { JobCard } from './JobCard'
import { JobDetails } from './JobDetails'
import { CreateJobForm } from './CreateJobForm'
import { SearchFilters } from './SearchFilters'
import { JobAd, SearchFilters as SearchFiltersType } from '../../types'

type TabType = 'browse' | 'favorites' | 'my-ads'

export const JobHub: React.FC = () => {
  const {
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
    getFilteredAds
  } = useJobHub()

  const [activeTab, setActiveTab] = useState<TabType>('browse')
  const [selectedJob, setSelectedJob] = useState<JobAd | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingJob, setEditingJob] = useState<JobAd | null>(null)
  const [filters, setFilters] = useState<SearchFiltersType>({
    query: '',
    minPay: 0,
    maxPay: 0,
    businessName: ''
  })

  const handleCreateJob = async (jobData: Omit<JobAd, 'id' | 'createdAt' | 'applications' | 'citizenId'>) => {
    try {
      await createJobAd(jobData)
      setShowCreateForm(false)
      components.setPopUp({
        title: 'Success',
        description: 'Job ad created successfully!',
        buttons: [{ title: 'OK' }]
      })
    } catch (error) {
      components.setPopUp({
        title: 'Error',
        description: 'Failed to create job ad. Please try again.',
        buttons: [{ title: 'OK' }]
      })
    }
  }

  const handleUpdateJob = async (jobData: Omit<JobAd, 'id' | 'createdAt' | 'applications' | 'citizenId'>) => {
    if (!editingJob) return
    
    try {
      await updateJobAd(editingJob.id, jobData)
      setEditingJob(null)
      setShowCreateForm(false)
      components.setPopUp({
        title: 'Success',
        description: 'Job ad updated successfully!',
        buttons: [{ title: 'OK' }]
      })
    } catch (error) {
      components.setPopUp({
        title: 'Error',
        description: 'Failed to update job ad. Please try again.',
        buttons: [{ title: 'OK' }]
      })
    }
  }

  const handleDeleteJob = (job: JobAd) => {
    components.setPopUp({
      title: 'Delete Job Ad',
      description: `Are you sure you want to delete the "${job.jobTitle}" job ad?`,
      buttons: [
        {
          title: 'Cancel',
          color: 'blue'
        },
        {
          title: 'Delete',
          color: 'red',
          cb: async () => {
            try {
              await deleteJobAd(job.id)
              components.setPopUp({
                title: 'Success',
                description: 'Job ad deleted successfully!',
                buttons: [{ title: 'OK' }]
              })
            } catch (error) {
              components.setPopUp({
                title: 'Error',
                description: 'Failed to delete job ad. Please try again.',
                buttons: [{ title: 'OK' }]
              })
            }
          }
        }
      ]
    })
  }

  const handleApply = async (jobId: string) => {
    try {
      await applyToJob(jobId)
      components.setPopUp({
        title: 'Application Sent',
        description: 'Your application has been submitted successfully!',
        buttons: [{ title: 'OK' }]
      })
    } catch (error) {
      components.setPopUp({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        buttons: [{ title: 'OK' }]
      })
    }
  }

  const getDisplayedJobs = () => {
    switch (activeTab) {
      case 'browse':
        return getFilteredAds(filters)
      case 'favorites':
        return jobAds.filter(job => favorites.includes(job.id))
      case 'my-ads':
        return getMyAds()
      default:
        return []
    }
  }

  const displayedJobs = getDisplayedJobs()

  return (
    <div className={`job-hub ${config.theme}`}>
      <div className="job-hub-header">
        <div className="header-top">
          <h1 className="app-title">Job Hub</h1>
          <div className="header-actions">
            {config.isDev && (
              <div className="dev-indicator">DEV</div>
            )}
            {config.isBoss && (
              <button
                className="btn btn-primary btn-small"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus size={16} />
                Post Job
              </button>
            )}
          </div>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <Briefcase size={20} />
            Browse
          </button>
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={20} />
            Favorites
          </button>
          {config.isBoss && (
            <button
              className={`tab-btn ${activeTab === 'my-ads' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-ads')}
            >
              <User size={20} />
              My Ads
            </button>
          )}
        </div>

        {activeTab === 'browse' && (
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        )}
      </div>

      <div className="job-hub-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} />
            <h3>
              {activeTab === 'browse' && 'No jobs found'}
              {activeTab === 'favorites' && 'No favorite jobs'}
              {activeTab === 'my-ads' && 'No job ads posted'}
            </h3>
            <p>
              {activeTab === 'browse' && 'Try adjusting your search filters'}
              {activeTab === 'favorites' && 'Jobs you favorite will appear here'}
              {activeTab === 'my-ads' && 'Create your first job ad to get started'}
            </p>
            {activeTab === 'my-ads' && config.isBoss && (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus size={16} />
                Create Job Ad
              </button>
            )}
          </div>
        ) : (
          <div className="jobs-list">
            {displayedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFavorited={favorites.includes(job.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={setSelectedJob}
                onApply={activeTab !== 'my-ads' ? handleApply : undefined}
                showApplications={activeTab === 'my-ads'}
              />
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetails
          job={selectedJob}
          isFavorited={favorites.includes(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
          onToggleFavorite={toggleFavorite}
          onApply={activeTab !== 'my-ads' ? handleApply : undefined}
          showApplications={activeTab === 'my-ads'}
        />
      )}

      {showCreateForm && (
        <CreateJobForm
          onClose={() => {
            setShowCreateForm(false)
            setEditingJob(null)
          }}
          onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
          editingJob={editingJob || undefined}
        />
      )}

      {activeTab === 'my-ads' && displayedJobs.length > 0 && (
        <div className="floating-actions">
          {displayedJobs.map((job) => (
            <div key={job.id} className="job-actions">
              <button
                className="btn btn-secondary btn-small"
                onClick={() => {
                  setEditingJob(job)
                  setShowCreateForm(true)
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDeleteJob(job)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}