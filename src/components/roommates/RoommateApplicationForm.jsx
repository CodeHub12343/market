'use client'

import styled from 'styled-components'
import { useState } from 'react'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormSection = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`

const RatingGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const StarButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid ${props => props.$selected ? '#ffc107' : '#e0e0e0'};
  background: ${props => props.$selected ? '#fffaed' : 'white'};
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #ffc107;
    background: #fffaed;
  }
`

const Info = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  font-weight: 500;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.$primary ? `
    background: #1a1a1a;
    color: white;

    &:hover:not(:disabled) {
      background: #333;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #1a1a1a;
    border: 1px solid #e0e0e0;

    &:hover {
      background: #f5f5f5;
    }
  `}
`

export function RoommateApplicationForm({ roommateId, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    message: '',
    rating: 0,
    budget: '',
    moveInDate: '',
    duration: '12'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      roommate: roommateId,
      rating: parseInt(formData.rating)
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection>
        <FormGroup>
          <Label>Application Message</Label>
          <TextArea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell the landlord about yourself, your occupation, and why you're interested in this room..."
            required
          />
          <Info>Minimum 50 characters recommended for better chances of approval</Info>
        </FormGroup>

        <FormGroup>
          <Label>Monthly Budget (₦)</Label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            placeholder="e.g., 50000"
            style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Move-In Date</Label>
          <input
            type="date"
            name="moveInDate"
            value={formData.moveInDate}
            onChange={handleInputChange}
            style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Lease Duration</Label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            style={{
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="flexible">Flexible</option>
          </select>
        </FormGroup>

        <FormGroup>
          <Label>How would you rate your cleanliness?</Label>
          <RatingGroup>
            {[1, 2, 3, 4, 5].map(star => (
              <StarButton
                key={star}
                type="button"
                $selected={formData.rating >= star}
                onClick={() => handleRatingChange(star)}
              >
                ⭐
              </StarButton>
            ))}
          </RatingGroup>
          <Info>{formData.rating > 0 ? `Rated: ${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Select rating'}</Info>
        </FormGroup>
      </FormSection>

      <ButtonGroup>
        <Button type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" $primary disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </ButtonGroup>
    </Form>
  )
}
