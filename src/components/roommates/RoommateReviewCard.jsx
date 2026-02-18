'use client'

import styled from 'styled-components'
import { Star, User, Calendar, MessageCircle, Trash2 } from 'lucide-react'

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (min-width: 768px) {
    padding: 18px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f0f0;
`

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const AuthorName = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
`

const ReviewDate = styled.p`
  margin: 0;
  font-size: 11px;
  color: #999;
`

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
    color: #ffc107;
    fill: #ffc107;
  }

  .rating-value {
    font-size: 13px;
    font-weight: 700;
    color: #1a1a1a;
    margin-left: 4px;
  }
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #e53935;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const ReviewText = styled.p`
  margin: 12px 0 0 0;
  font-size: 13px;
  color: #333;
  line-height: 1.6;
`

const ReviewCategories = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 11px;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
  }

  .value {
    font-size: 13px;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 6px;

    svg {
      width: 14px;
      height: 14px;
      color: #ffc107;
      fill: #ffc107;
    }
  }
`

const formatDate = (date) => {
  const now = new Date()
  const reviewDate = new Date(date)
  const diffTime = Math.abs(now - reviewDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}m ago`
  return reviewDate.toLocaleDateString()
}

export function RoommateReviewCard({
  review,
  onDelete,
  canDelete = false,
  isLoading = false
}) {
  return (
    <Card>
      <Header>
        <AuthorSection>
          <Avatar src={review.author?.avatar || '/default-avatar.svg'} alt={review.author?.fullName} />
          <AuthorInfo>
            <AuthorName>{review.author?.fullName}</AuthorName>
            <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
          </AuthorInfo>
        </AuthorSection>
        {canDelete && (
          <DeleteButton
            onClick={() => onDelete?.(review._id)}
            disabled={isLoading}
            title="Delete review"
          >
            <Trash2 />
          </DeleteButton>
        )}
      </Header>

      <RatingStars>
        {[...Array(5)].map((_, i) => (
          <Star key={i} />
        ))}
        <span className="rating-value">{review.rating}</span>
      </RatingStars>

      {review.comment && (
        <ReviewText>{review.comment}</ReviewText>
      )}

      {(review.cleanliness || review.communication || review.respectful) && (
        <ReviewCategories>
          {review.cleanliness && (
            <Category>
              <div className="label">Cleanliness</div>
              <div className="value">
                {[...Array(review.cleanliness)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
            </Category>
          )}
          {review.communication && (
            <Category>
              <div className="label">Communication</div>
              <div className="value">
                {[...Array(review.communication)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
            </Category>
          )}
          {review.respectful && (
            <Category>
              <div className="label">Respectful</div>
              <div className="value">
                {[...Array(review.respectful)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
            </Category>
          )}
        </ReviewCategories>
      )}
    </Card>
  )
}
