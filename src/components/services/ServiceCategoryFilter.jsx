'use client';

import styled from 'styled-components';
import { useCategories } from '@/hooks/useCategories';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Container = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  justify-content: space-between;

  &:hover {
    background: #f0f0f0;
    border-color: #d5d5d5;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
    color: #666;
    transition: transform 0.2s ease;
    transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  margin-top: 8px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  min-width: 200px;

  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

const CategoryOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #1a1a1a;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  input[type='checkbox'] {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }

  span {
    flex: 1;
  }
`;

const SelectedCount = styled.span`
  font-size: 12px;
  background: #1a1a1a;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
`;

const EmptyMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

export default function ServiceCategoryFilter({ selectedCategories = [], onCategoriesChange }) {
  const { data: categories = [], isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (categoryId) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoriesChange(newSelected);
  };

  const categoryArray = Array.isArray(categories) ? categories : [];

  const getSelectedLabel = () => {
    if (selectedCategories.length === 0) {
      return 'All Categories';
    }
    if (selectedCategories.length === 1) {
      const selected = categoryArray.find(c => c._id === selectedCategories[0]);
      return selected ? selected.name : 'Category';
    }
    return `${selectedCategories.length} categories`;
  };

  return (
    <Container>
      <FilterButton $open={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>{getSelectedLabel()}</span>
        {selectedCategories.length > 0 && (
          <SelectedCount>{selectedCategories.length}</SelectedCount>
        )}
        <ChevronDown />
      </FilterButton>

      {isOpen && (
        <Dropdown>
          {isLoading ? (
            <EmptyMessage>Loading categories...</EmptyMessage>
          ) : categoryArray.length === 0 ? (
            <EmptyMessage>No categories available</EmptyMessage>
          ) : (
            <>
              <CategoryOption
                type="button"
                onClick={() => {
                  onCategoriesChange([]);
                  setIsOpen(false);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.length === 0}
                  readOnly
                />
                <span>All Categories</span>
              </CategoryOption>

              {categoryArray.map(category => (
                <CategoryOption
                  key={category._id}
                  type="button"
                  onClick={() => handleCategoryToggle(category._id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    readOnly
                  />
                  <span>{category.name}</span>
                </CategoryOption>
              ))}
            </>
          )}
        </Dropdown>
      )}
    </Container>
  );
}
