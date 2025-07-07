import React from 'react'
import { Heart, MapPin, Clock, DollarSign, Eye, Users } from 'lucide-react'
import { JobAd } from '../../types'
import { formatDistanceToNow } from 'date-fns'

interface JobCardProps {
  job: JobAd
  isFavorited: boolean
  onToggleFavorite: (jobId: string) => void
  onViewDetails: (job: JobAd) => void
  onApply?: (jobId: string) => void
  showApplications?: boolean
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isFavorited,
  onToggleFavorite,
  onViewDetails,
  onApply,
  showApplications = false
}) => {
  const daysUntilExpiry = Math.ceil(
    (new Date(job.validUntilDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const hasApplied = job.applications.some(app => app.citizenId === 'citizen-123') // This would come from config

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="business-info">
          {job.businessLogo && (
            <img src={job.businessLogo} alt={job.businessName} className="business-logo" />
          )}
          <div className="business-details">
            <h3 className="business-name">{job.businessName}</h3>
            <p className="job-title">{job.jobTitle}</p>
          </div>
        </div>
        <button
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(job.id)}
        >
          <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="job-card-content">
        <div className="job-info">
          <div className="info-item">
            <DollarSign size={16} />
            <span>${job.hourlyPay}/hr</span>
          </div>
          <div className="info-item">
            <Clock size={16} />
            <span>
              {daysUntilExpiry > 0 
                ? `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
                : 'Expired'
              }
            </span>
          </div>
          {showApplications && (
            <div className="info-item">
              <Users size={16} />
              <span>{job.applications.length} application{job.applications.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <p className="job-description">{job.jobDescription}</p>

        {job.photos.length > 0 && (
          <div className="job-photos">
            {job.photos.slice(0, 4).map((photo, index) => (
              <img key={index} src={photo} alt={`Job photo ${index + 1}`} className="job-photo" />
            ))}
            {job.photos.length > 4 && (
              <div className="photo-count">+{job.photos.length - 4}</div>
            )}
          </div>
        )}
      </div>

      <div className="job-card-actions">
        {showApplications ? (
          <>
            <button className="btn btn-secondary" onClick={() => onViewDetails(job)}>
              <Eye size={14} />
              Manage
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => onViewDetails(job)}>
              <Eye size={14} />
              Details
            </button>
            {onApply && !hasApplied && daysUntilExpiry > 0 && (
              <button className="btn btn-primary" onClick={() => onApply(job.id)}>
                Apply
              </button>
            )}
            {hasApplied && (
              <button className="btn btn-disabled" disabled>
                Applied
              </button>
            )}
          </>
        )}
        {showApplications && (
          <button
            className="btn btn-danger btn-small"
            onClick={() => {
              components.setContextMenu({
                title: 'Job Actions',
                buttons: [
                  {
                    title: 'Edit Job',
                    cb: () => {
                      // This would be handled by parent component
                    }
                  },
                  {
                    title: 'Delete Job',
                    color: 'red',
                    cb: () => {
                      // This would be handled by parent component
                    }
                  }
                ]
              })
            }}
          >
            •••
          </button>
        )}
      </div>
    </div>
  )
}