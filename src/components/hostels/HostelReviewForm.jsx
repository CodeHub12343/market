'use client';

import styled from 'styled-components';
import { Star, X } from 'lucide-react';
import { useState } from 'react';

const FormContainer = styled.form`
  padding: 16px;
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StarButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }

  svg {
    width: 28px;
    height: 28px;
    color: ${props => props.$filled ? '#ffc107' : '#e5e5e5'};
    fill: ${props => props.$filled ? '#ffc107' : 'none'};
    transition: all 0.2s ease;
  }
`;

const RatingLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-left: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  background: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.05);
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  background: #ffffff;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  max-height: 300px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.05);
  }

  &::placeholder {
    color: #999;
  }
`;

const CharCount = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  ${props => props.$primary ? `
    background: #1a1a1a;
    color: #ffffff;

    &:hover {
      background: #333333;
    }

    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  ` : `
    background: #f5f5f5;
    color: #1a1a1a;
    border: 1px solid #e5e5e5;

    &:hover {
      background: #f0f0f0;
      border-color: #d5d5d5;
    }
  `}
`;

const ValidationMessage = styled.div`
  font-size: 12px;
  color: #dc2626;
  margin-top: 6px;
`;

export default function HostelReviewForm({
  initialData = null,
  isLoading = false,
  onSubmit,
  onCancel
}) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!rating) {
      newErrors.rating = 'Please select a rating';
    }

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Review content is required';
    } else if (content.length < 20) {
      newErrors.content = 'Review must be at least 20 characters';
    } else if (content.length > 1000) {
      newErrors.content = 'Review cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        title,
        content
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Rating */}
      <FormGroup>
        <Label>Rating *</Label>
        <RatingContainer>
          {[1, 2, 3, 4, 5].map(star => (
            <StarButton
              key={star}
              type="button"
              onClick={() => setRating(star)}
              $filled={star <= rating}
              title={`${star} stars`}
            >
              <Star />
            </StarButton>
          ))}
          {rating > 0 && <RatingLabel>{rating}/5 stars</RatingLabel>}
        </RatingContainer>
        {errors.rating && <ValidationMessage>{errors.rating}</ValidationMessage>}
      </FormGroup>

      {/* Title */}
      <FormGroup>
        <Label>Review Title *</Label>
        <Input
          type="text"
          placeholder="Summarize your experience in a few words"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          maxLength="100"
        />
        <CharCount>{title.length}/100</CharCount>
        {errors.title && <ValidationMessage>{errors.title}</ValidationMessage>}
      </FormGroup>

      {/* Content */}
      <FormGroup>
        <Label>Your Review *</Label>
        <TextArea
          placeholder="Share your honest experience. What did you like? What could be improved? (At least 20 characters)"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors({ ...errors, content: '' });
          }}
          maxLength="1000"
        />
        <CharCount>{content.length}/1000</CharCount>
        {errors.content && <ValidationMessage>{errors.content}</ValidationMessage>}
      </FormGroup>

      {/* Actions */}
      <ButtonGroup>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          <X width={16} />
          Cancel
        </Button>
        <Button
          type="submit"
          $primary
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? 'Submitting...' : initialData ? 'Update Review' : 'Post Review'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
}
