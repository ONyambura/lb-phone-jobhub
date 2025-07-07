import React from 'react'
import { X, MapPin, Clock, DollarSign, Calendar, Users, Heart } from 'lucide-react'
import { JobAd } from '../../types'
import { format } from 'date-fns'

interface JobDetailsProps {
  job: JobAd
  isFavorited: boolean
  onClose: () => void
  onToggleFavorite: (jobId: string) => void
  onApply?: (jobId: string) => void
  showApplications?: boolean
}

export const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  isFavorited,
  onClose,
  onToggleFavorite,
  onApply,
  showApplications = false
}) => {
  const daysUntilExpiry = Math.ceil(
    (new Date(job.validUntilDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const hasApplied = job.applications.some(app => app.citizenId === 'citizen-123')

  return (
    <div className="job-details-overlay">
      <div className="job-details">
        <div className="job-details-header">
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          <button
            className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={() => onToggleFavorite(job.id)}
          >
            <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="job-details-content">
          <div className="business-header">
            {job.businessLogo && (
              <img src={job.businessLogo} alt={job.businessName} className="business-logo-large" />
            )}
            <div className="business-info">
              <h2 className="business-name">{job.businessName}</h2>
              <h1 className="job-title">{job.jobTitle}</h1>
            </div>
          </div>

          <div className="job-stats">
            <div className="stat-item">
              <DollarSign size={20} />
              <div>
                <span className="stat-value">${job.hourlyPay}</span>
                <span className="stat-label">per hour</span>
              </div>
            </div>
            <div className="stat-item">
              <Clock size={20} />
              <div>
                <span className="stat-value">
                  {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                </span>
                <span className="stat-label">until expiry</span>
              </div>
            </div>
            <div className="stat-item">
              <Calendar size={20} />
              <div>
                <span className="stat-value">{format(new Date(job.createdAt), 'MMM dd')}</span>
                <span className="stat-label">posted</span>
              </div>
            </div>
            {showApplications && (
              <div className="stat-item">
                <Users size={20} />
                <div>
                  <span className="stat-value">{job.applications.length}</span>
                  <span className="stat-label">applications</span>
                </div>
              </div>
            )}
          </div>

          <div className="job-description-full">
            <h3>Job Description</h3>
            <p>{job.jobDescription}</p>
          </div>

          {job.photos.length > 0 && (
            <div className="job-photos-full">
              <h3>Photos</h3>
              <div className="photos-grid">
                {job.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Job photo ${index + 1}`} className="photo-full" />
                ))}
              </div>
            </div>
          )}

          {showApplications && job.applications.length > 0 && (
            <div className="applications-section">
              <h3>Applications ({job.applications.length})</h3>
              <div className="applications-list">
                {job.applications.map((application) => (
                  <div key={application.id} className="application-item">
                    <div className="applicant-info">
                      <span className="applicant-name">{application.citizenName}</span>
                      <span className="application-date">
                        {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <span className={`application-status ${application.status}`}>
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {onApply && !hasApplied && daysUntilExpiry > 0 && (
          <div className="job-details-actions">
            <button className="btn btn-primary btn-large" onClick={() => onApply(job.id)}>
              Apply for this Job
            </button>
          </div>
        )}

        {hasApplied && (
          <div className="job-details-actions">
            <button className="btn btn-disabled btn-large" disabled>
              Application Submitted
            </button>
          </div>
        )}
      </div>
    </div>
  )
}