'use client';

import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: ${props => props.isEditable ? 'pointer' : 'default'};

  &:hover {
    ${props => props.isEditable ? `
      background: #c7d2fe;
      transform: translateY(-1px);
    ` : ''}
  }

  @media (min-width: 768px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #3730a3;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EmptyState = styled.div`
  font-size: 14px;
  color: #999;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const EventTags = ({ tags = [], onRemove, isEditable = false }) => {
  // Default tags if none provided
  const defaultTags = [
    'Networking',
    'Professional Development',
    'Innovation',
    'Tech',
    'Career Growth'
  ];

  const tagsList = tags && tags.length > 0 ? tags : defaultTags;

  if (!tagsList || tagsList.length === 0) {
    return <EmptyState>No tags added yet</EmptyState>;
  }

  return (
    <TagsContainer>
      {tagsList.map((tag, index) => (
        <Tag key={index} isEditable={isEditable}>
          {typeof tag === 'string' ? tag : tag.name || tag.label}
          {isEditable && onRemove && (
            <RemoveButton
              onClick={() => onRemove(index)}
              title={`Remove ${tag}`}
            >
              <X />
            </RemoveButton>
          )}
        </Tag>
      ))}
    </TagsContainer>
  );
};

export default EventTags;
