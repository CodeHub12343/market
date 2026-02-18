'use client'

import styled from 'styled-components'
import { useState } from 'react'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  min-height: 100px;
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
  flex-direction: column;
  gap: 12px;
`

const RatingLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`

const StarRating = styled.div`
  display: flex;
  gap: 8px;
`

const StarButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid ${props => props.$selected ? '#ffc107' : '#e0e0e0'};
  background: ${props => props.$selected ? '#fffaed' : 'white'};
  font-size: 18px;
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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`

const CategoryGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

export function RoommateReviewForm({ roommateId, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    cleanliness: 0,
    communication: 0,
    respectful: 0
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

  const handleCategoryChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      [category]: rating
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      roommate: roommateId,
      rating: parseInt(formData.rating),
      cleanliness: parseInt(formData.cleanliness),
      communication: parseInt(formData.communication),
      respectful: parseInt(formData.respectful)
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Overall Rating</Label>
        <StarRating>
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
        </StarRating>
        <Info>{formData.rating > 0 ? `Rated: ${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Select rating'}</Info>
      </FormGroup>

      <FormGroup>
        <Label>Review Comment</Label>
        <TextArea
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Share your experience with this roommate listing. What did you like? What could be improved?"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Rate Specific Aspects</Label>
        <CategoriesGrid>
          {['cleanliness', 'communication', 'respectful'].map(category => (
            <CategoryGroup key={category}>
              <RatingLabel>{category.charAt(0).toUpperCase() + category.slice(1)}</RatingLabel>
              <StarRating>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarButton
                    key={star}
                    type="button"
                    style={{ width: '32px', height: '32px', fontSize: '14px' }}
                    $selected={formData[category] >= star}
                    onClick={() => handleCategoryChange(category, star)}
                  >
                    ⭐
                  </StarButton>
                ))}
              </StarRating>
            </CategoryGroup>
          ))}
        </CategoriesGrid>
      </FormGroup>

      <ButtonGroup>
        <Button type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" $primary disabled={isLoading || formData.rating === 0}>
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </ButtonGroup>
    </Form>
  )
}
