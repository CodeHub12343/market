'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Trash2, Plus, GripVertical } from 'lucide-react';

const FormSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

const OptionItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  align-items: flex-start;
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  color: #ccc;
  cursor: grab;
  margin-top: 4px;

  &:active {
    cursor: grabbing;
  }
`;

const OptionFields = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #ccc;
  }
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 70px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #ccc;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  margin-top: 4px;

  &:hover {
    background: #fecaca;
    border-color: #dc2626;
  }
`;

const AddButton = styled.button`
  padding: 10px 16px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const NoOptions = styled.p`
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 14px;
`;

const Hint = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
  margin-top: 4px;
`;

export default function ServiceOptionsForm({ options = [], onChange, disabled = false }) {
  const [localOptions, setLocalOptions] = useState(options || []);

  const handleAddOption = () => {
    const newOption = {
      id: Date.now().toString(), // Temporary ID for new options
      name: '',
      description: '',
      price: '',
      duration: '',
      durationUnit: 'hour',
      deliveryTime: '',
      revisions: 0
    };
    const updated = [...localOptions, newOption];
    setLocalOptions(updated);
    onChange(updated);
  };

  const handleUpdateOption = (index, field, value) => {
    const updated = [...localOptions];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setLocalOptions(updated);
    onChange(updated);
  };

  const handleRemoveOption = (index) => {
    const updated = localOptions.filter((_, i) => i !== index);
    setLocalOptions(updated);
    onChange(updated);
  };

  return (
    <FormSection>
      <SectionTitle>
        📦 Service Options/Packages
      </SectionTitle>

      <Hint>
        Add different package options with varying prices and durations (e.g., Basic, Standard, Premium)
      </Hint>

      {localOptions.length === 0 ? (
        <NoOptions>No options added yet. Create your first package option below.</NoOptions>
      ) : (
        <OptionsList>
          {localOptions.map((option, index) => (
            <OptionItem key={option._id || option.id}>
              <DragHandle title="Drag to reorder">
                <GripVertical size={18} />
              </DragHandle>

              <OptionFields>
                <FormGroup>
                  <Label>Package Name *</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Basic, Standard, Premium"
                    value={option.name || ''}
                    onChange={(e) => handleUpdateOption(index, 'name', e.target.value)}
                    disabled={disabled}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Price (₦) *</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 2000"
                    value={option.price || ''}
                    onChange={(e) => handleUpdateOption(index, 'price', e.target.value)}
                    disabled={disabled}
                    required
                  />
                </FormGroup>

                <FullWidthField>
                  <FormGroup>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="e.g., Includes 1 hour of tutoring, basic materials"
                      value={option.description || ''}
                      onChange={(e) => handleUpdateOption(index, 'description', e.target.value)}
                      disabled={disabled}
                    />
                  </FormGroup>
                </FullWidthField>

                <FormGroup>
                  <Label>Duration</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    value={option.duration || ''}
                    onChange={(e) => handleUpdateOption(index, 'duration', e.target.value)}
                    disabled={disabled}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Duration Unit</Label>
                  <Input
                    as="select"
                    value={option.durationUnit || 'hour'}
                    onChange={(e) => handleUpdateOption(index, 'durationUnit', e.target.value)}
                    disabled={disabled}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Delivery Time</Label>
                  <Input
                    type="text"
                    placeholder="e.g., 24 hours"
                    value={option.deliveryTime || ''}
                    onChange={(e) => handleUpdateOption(index, 'deliveryTime', e.target.value)}
                    disabled={disabled}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Number of Revisions</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 2 (use -1 for unlimited)"
                    value={option.revisions !== undefined ? option.revisions : ''}
                    onChange={(e) => handleUpdateOption(index, 'revisions', e.target.value)}
                    disabled={disabled}
                  />
                </FormGroup>
              </OptionFields>

              <DeleteButton
                type="button"
                onClick={() => handleRemoveOption(index)}
                disabled={disabled}
                title="Delete this option"
              >
                <Trash2 size={16} />
                Delete
              </DeleteButton>
            </OptionItem>
          ))}
        </OptionsList>
      )}

      <AddButton
        type="button"
        onClick={handleAddOption}
        disabled={disabled}
      >
        <Plus size={18} />
        Add Option
      </AddButton>
    </FormSection>
  );
}
