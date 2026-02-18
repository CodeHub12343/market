'use client';

import styled from 'styled-components';
import { useState, useCallback } from 'react';
import { useCreateGroupChat } from '@/hooks/useChats';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const MembersSection = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  margin-bottom: 12px;
`;

const MembersList = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const MemberItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f5f5f5;
  }

  ${props => props.$selected && `
    background: #e8f0fe;
  `}
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const MemberEmail = styled.div`
  font-size: 12px;
  color: #999;
`;

const SelectedMembers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const SelectedMember = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #e8f0fe;
  border-radius: 16px;
  font-size: 13px;
  color: #667eea;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: #d32f2f;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #333;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const CreateButton = styled(Button)`
  background: #667eea;
  color: white;

  &:hover:not(:disabled) {
    background: #5568d3;
  }
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

export default function CreateGroupChatModal({ isOpen, onClose, users = [] }) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const router = useRouter();
  const { showNotification } = useNotification();
  const { mutateAsync: createGroupChat, isPending } = useCreateGroupChat();

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMember = useCallback((user) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m._id === user._id);
      if (isSelected) {
        return prev.filter(m => m._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  }, []);

  const handleRemoveMember = useCallback((userId) => {
    setSelectedMembers(prev => prev.filter(m => m._id !== userId));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!groupName.trim()) {
      showNotification('warning', 'Missing information', 'Please enter a group name');
      return;
    }

    if (selectedMembers.length < 2) {
      showNotification('warning', 'Minimum members', 'Select at least 2 members');
      return;
    }

    try {
      const chat = await createGroupChat({
        name: groupName,
        description: description.trim(),
        memberIds: selectedMembers.map(m => m._id)
      });

      showNotification('success', 'Group created', `"${groupName}" has been created`);
      
      // Reset form
      setGroupName('');
      setDescription('');
      setSearchQuery('');
      setSelectedMembers([]);
      
      // Close modal and navigate to chat
      onClose();
      router.push(`/messages/${chat._id}`);
    } catch (error) {
      console.error('Error creating group chat:', error);
      showNotification('error', 'Failed to create', error.message || 'Unable to create group chat');
    }
  }, [groupName, description, selectedMembers, createGroupChat, showNotification, onClose, router]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>Create Group Chat</Title>

        <FormGroup>
          <Label htmlFor="groupName">Group Name *</Label>
          <Input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Study Group 2024"
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this group about? (optional)"
            disabled={isPending}
          />
        </FormGroup>

        <MembersSection>
          <Label>Add Members * (minimum 2)</Label>
          <SearchInput
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isPending}
          />
          
          <MembersList>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <MemberItem
                  key={user._id}
                  $selected={selectedMembers.some(m => m._id === user._id)}
                >
                  <Checkbox
                    type="checkbox"
                    checked={selectedMembers.some(m => m._id === user._id)}
                    onChange={() => handleSelectMember(user)}
                    disabled={isPending}
                  />
                  <MemberInfo>
                    <MemberName>{user.fullName}</MemberName>
                    <MemberEmail>{user.email}</MemberEmail>
                  </MemberInfo>
                </MemberItem>
              ))
            ) : (
              <EmptyState>
                {searchQuery ? 'No users found' : 'No users available'}
              </EmptyState>
            )}
          </MembersList>

          {selectedMembers.length > 0 && (
            <SelectedMembers>
              {selectedMembers.map(member => (
                <SelectedMember key={member._id}>
                  {member.fullName}
                  <RemoveButton onClick={() => handleRemoveMember(member._id)}>
                    ✕
                  </RemoveButton>
                </SelectedMember>
              ))}
            </SelectedMembers>
          )}
        </MembersSection>

        <ButtonGroup>
          <CancelButton onClick={onClose} disabled={isPending}>
            Cancel
          </CancelButton>
          <CreateButton 
            onClick={handleCreate} 
            disabled={isPending || !groupName.trim() || selectedMembers.length < 2}
          >
            {isPending ? '⏳ Creating...' : '✓ Create Group'}
          </CreateButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}
