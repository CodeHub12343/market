'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

const FormContainer = styled.div`
  padding: 16px;
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  svg {
    width: 28px;
    height: 28px;
    color: ${(props) => (props.$filled ? '#ffc107' : '#e5e5e5')};
    fill: ${(props) => (props.$filled ? '#ffc107' : 'none')};
  }

  &:hover {
    transform: scale(1.2);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const CharCount = styled.span`
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.$primary ? '#1a1a1a' : '#e5e5e5')};
  background: ${(props) => (props.$primary ? '#1a1a1a' : '#ffffff')};
  color: ${(props) => (props.$primary ? '#ffffff' : '#666')};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    ${(props) =>
      props.$primary
        ? 'background: #333; border-color: #333;'
        : 'background: #f5f5f5; border-color: #999;'}
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const ErrorMessage = styled.div`
  padding: 10px 12px;
  background: #fee2e2;
  border: 1px solid #dc2626;
  border-radius: 6px;
  color: #7f1d1d;
  font-size: 13px;
  margin-bottom: 12px;
`;

export default function ServiceReviewForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = null,
  error = null,
}) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.review || initialData?.content || '');
  const [formError, setFormError] = useState(error);

  useEffect(() => {
    setFormError(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!rating) {
      setFormError('Please select a rating');
      return;
    }

    if (!title.trim()) {
      setFormError('Please enter a review title');
      return;
    }

    if (!content.trim()) {
      setFormError('Please enter a review');
      return;
    }

    onSubmit({
      rating,
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <FormContainer>
      {formError && <ErrorMessage>{formError}</ErrorMessage>}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Rating</Label>
          <StarRating>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarButton
                key={star}
                type="button"
                $filled={star <= rating}
                onClick={() => setRating(star)}
                disabled={isLoading}
              >
                <Star />
              </StarButton>
            ))}
          </StarRating>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="title">Title (100 characters max)</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            placeholder="Brief title for your review"
            disabled={isLoading}
            maxLength={100}
          />
          <CharCount>{title.length}/100</CharCount>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Review (1000 characters max)</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 1000))}
            placeholder="Share your experience with this service..."
            disabled={isLoading}
            maxLength={1000}
          />
          <CharCount>{content.length}/1000</CharCount>
        </FormGroup>

        <ButtonGroup>
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="submit"
            $primary
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
}
