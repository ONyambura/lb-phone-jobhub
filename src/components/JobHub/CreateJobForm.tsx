import React, { useState } from 'react'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import { JobAd } from '../../types'

interface CreateJobFormProps {
  onClose: () => void
  onSubmit: (jobData: Omit<JobAd, 'id' | 'createdAt' | 'applications' | 'citizenId'>) => void
  editingJob?: JobAd
  businessLogo?: string
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({ onClose, onSubmit, editingJob, businessLogo }) => {
  const [formData, setFormData] = useState({
    businessId: editingJob?.businessId || 'business-1',
    businessName: editingJob?.businessName || 'My Business',
    businessLogo: editingJob?.businessLogo || businessLogo || '',
    jobTitle: editingJob?.jobTitle || '',
    jobDescription: editingJob?.jobDescription || '',
    hourlyPay: editingJob?.hourlyPay || 25,
    validUntilDate: editingJob?.validUntilDate || '',
    photos: editingJob?.photos || [],
    phoneNumber: editingJob?.phoneNumber || '',
    streetName: editingJob?.streetName || '',
    location: editingJob?.location || null
  })

  const [newPhotoUrl, setNewPhotoUrl] = useState('')

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addPhoto = () => {
    if (newPhotoUrl && formData.photos.length < 4) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl]
      }))
      setNewPhotoUrl('')
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.jobTitle || !formData.jobDescription || !formData.validUntilDate) {
      components.setPopUp({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        buttons: [{ title: 'OK' }]
      })
      return
    }

    if (new Date(formData.validUntilDate) <= new Date()) {
      components.setPopUp({
        title: 'Invalid Date',
        description: 'The expiry date must be in the future.',
        buttons: [{ title: 'OK' }]
      })
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="create-job-overlay">
      <div className="create-job-form">
        <div className="form-header">
          <h2>{editingJob ? 'Edit Job Ad' : 'Create Job Ad'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g. Police Officer, Chef, Mechanic"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Hourly Pay ($) *</label>
            <input
              type="number"
              min="1"
              value={formData.hourlyPay}
              onChange={(e) => handleInputChange('hourlyPay', parseInt(e.target.value) || 0)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Valid Until *</label>
            <input
              type="date"
              value={formData.validUntilDate}
              onChange={(e) => handleInputChange('validUntilDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Phone *</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="555-0123"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={formData.streetName}
                onChange={(e) => handleInputChange('streetName', e.target.value)}
                placeholder="Street name or area"
                className="form-input"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => {
                  // This will send a message to Lua to get current position
                  if (typeof fetchNui !== 'undefined') {
                    fetchNui('getCurrentPosition').then((position: any) => {
                      if (position) {
                        setFormData(prev => ({
                          ...prev,
                          location: position.coords,
                          streetName: position.streetName || prev.streetName
                        }))
                      }
                    }).catch(() => {
                      components.setPopUp({
                        title: 'Error',
                        description: 'Could not get current position.',
                        buttons: [{ title: 'OK' }]
                      })
                    })
                  } else {
                    // Dev mode - mock position
                    setFormData(prev => ({
                      ...prev,
                      location: { x: 100, y: 200, z: 30 },
                      streetName: prev.streetName || 'Mock Street'
                    }))
                  }
                }}
              >
                Pin Position
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => handleInputChange('jobDescription', e.target.value)}
              placeholder="Describe the job responsibilities, requirements, and benefits..."
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Photos (Max 4)</label>
            <div className="photos-section">
              {formData.photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Photo ${index + 1}`} className="photo-preview" />
                  <button
                    type="button"
                    className="remove-photo"
                    onClick={() => removePhoto(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {formData.photos.length < 4 && (
                <div className="add-photo">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Photo URL"
                    className="photo-input"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={addPhoto}
                    disabled={!newPhotoUrl}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingJob ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}