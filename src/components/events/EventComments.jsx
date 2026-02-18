'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useAddEventComment, useEventComments } from '@/hooks/useEvents';
import { Send, MessageCircle } from 'lucide-react';

const CommentsWrapper = styled.div`
  margin-top: 0;
`;

const CommentsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;

  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 18px;
  }
`;

const CommentForm = styled.form`
  margin-bottom: 18px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    padding: 16px;
    margin-bottom: 20px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CommentInput = styled.textarea`
  padding: 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 10px 14px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    background: #000;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px 14px;
  background: white;
  color: #666;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }
`;

const CommentItem = styled.div`
  padding: 14px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  @media (min-width: 768px) {
    margin-bottom: 10px;
  }
`;

const CommentAuthor = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: #999;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    padding: 40px 24px;
  }
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #999;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px;
`;

export default function EventComments({ eventId }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!eventId) {
    return (
      <CommentsWrapper>
        <CommentsTitle>Comments</CommentsTitle>
        <LoadingText>Loading event...</LoadingText>
      </CommentsWrapper>
    );
  }

  const { data: comments = [], isLoading, refetch } = useEventComments(eventId);
  const addComment = useAddEventComment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict validation
    if (!eventId) {
      console.error('Event ID is missing');
      alert('Event ID is missing. Please refresh the page.');
      return;
    }
    
    if (!commentText || !commentText.trim()) {
      console.error('Comment text is empty');
      alert('Please enter a comment before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting comment:', { eventId, comment: commentText });
      await addComment.mutateAsync({ eventId, comment: commentText });
      setCommentText('');
      refetch();
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommentsWrapper>
      <CommentsTitle>Comments</CommentsTitle>

      <CommentForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Add your comment</Label>
          <CommentInput
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts about this event..."
            disabled={isSubmitting}
          />
        </FormGroup>
        <ButtonRow>
          <SubmitButton type="submit" disabled={isSubmitting || !commentText.trim() || !eventId}>
            <Send />
            <span>Post</span>
          </SubmitButton>
          <CancelButton
            type="button"
            onClick={() => setCommentText('')}
            disabled={!commentText.trim()}
          >
            Cancel
          </CancelButton>
        </ButtonRow>
      </CommentForm>

      {isLoading ? (
        <LoadingText>Loading comments...</LoadingText>
      ) : comments && comments.length > 0 ? (
        <CommentsList>
          {comments.map((c) => (
            <CommentItem key={c._id || c.createdAt}>
              <CommentHeader>
                <CommentAuthor>{c.user?.fullName || 'Anonymous'}</CommentAuthor>
                <CommentDate>
                  {new Date(c.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </CommentDate>
              </CommentHeader>
              <CommentText>{c.comment || c.text}</CommentText>
            </CommentItem>
          ))}
        </CommentsList>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <MessageCircle />
          </EmptyIcon>
          <EmptyText>No comments yet. Be the first to comment!</EmptyText>
        </EmptyState>
      )}
    </CommentsWrapper>
  );
}
