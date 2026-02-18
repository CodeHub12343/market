'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Star, X, Send } from 'lucide-react';

const FormContainer = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;

  @media (min-width: 640px) {
    padding: 20px;
  }
`;

const FormTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

const RatingSelector = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StarButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RatingValue = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;
  min-width: 80px;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;

  @media (min-width: 640px) {
    justify-content: flex-end;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const SubmitButton = styled(Button)`
  background: #1a1a1a;
  color: white;

  &:hover:not(:disabled) {
    background: #333;
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #1a1a1a;

  &:hover:not(:disabled) {
    background: #e5e5e5;
  }
`;

const CharCount = styled.div`
  font-size: 11px;
  color: #999;
  text-align: right;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 12px;
  padding: 8px 12px;
  background: #fee2e2;
  border-radius: 6px;
  border-left: 3px solid #dc2626;
`;

export default function ReviewForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  initialData = null,
}) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating) {
      alert('Please select a rating');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!content.trim()) {
      alert('Please enter a review');
      return;
    }

    onSubmit({
      rating,
      title,
      content,
    });
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <StarButton
        key={star}
        onClick={() => setRating(star)}
        disabled={isLoading}
        type="button"
        aria-label={`Rate ${star} stars`}
      >
        <Star
          size={24}
          fill={star <= rating ? '#fbbf24' : 'none'}
          color={star <= rating ? '#fbbf24' : '#d1d5db'}
        />
      </StarButton>
    ));
  };

  return (
    <FormContainer>
      <FormTitle>
        {initialData ? '✏️ Edit Review' : '⭐ Write a Review'}
      </FormTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Rating</Label>
          <RatingSelector>
            {renderStars()}
            <RatingValue>
              {rating ? `${rating} out of 5` : 'Select rating'}
            </RatingValue>
          </RatingSelector>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="review-title">Review Title</Label>
          <TextInput
            id="review-title"
            placeholder="What's the main point of your review?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            maxLength={100}
          />
          <CharCount>{title.length}/100</CharCount>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="review-content">Your Review</Label>
          <TextArea
            id="review-content"
            placeholder="Share your detailed thoughts about this product..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            maxLength={1000}
          />
          <CharCount>{content.length}/1000</CharCount>
        </FormGroup>

        <ButtonGroup>
          <CancelButton
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X size={16} />
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={isLoading}>
            <Send size={16} />
            {isLoading
              ? 'Submitting...'
              : initialData
              ? 'Update Review'
              : 'Submit Review'}
          </SubmitButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
}
