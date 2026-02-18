'use client';

import styled from 'styled-components';
import { useState, useRef, useCallback } from 'react';
import { useSendMessage } from '@/hooks/useMessages';
import { useSocket } from '@/context/SocketContext';
import { useNotification } from '@/context/NotificationContext';
import { Send, Plus } from 'lucide-react';

// ===== CONTAINER =====
const Container = styled.div`
  padding: 12px 16px 16px 16px;
  border-top: 1px solid #f0f0f0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 14px 20px 20px 20px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    padding: 16px 24px 24px 24px;
    gap: 16px;
  }
`;

// ===== ATTACHMENTS PREVIEW =====
const AttachmentsPreview = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 0 0 8px 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e5e5e5;
    border-radius: 2px;
  }

  @media (min-width: 768px) {
    gap: 12px;
    padding-bottom: 10px;
  }
`;

// ===== ATTACHMENT PREVIEW ITEM =====
const AttachmentPreview = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #e5e5e5;

  @media (min-width: 768px) {
    width: 90px;
    height: 90px;
    border-radius: 12px;
  }
`;

const AttachmentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AttachmentFile = styled.div`
  text-align: center;
  font-size: 28px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(26, 26, 26, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.2s ease, transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(26, 26, 26, 1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
`;

// ===== INPUT WRAPPER =====
const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;

  @media (min-width: 768px) {
    gap: 12px;
  }

  @media (min-width: 1024px) {
    gap: 12px;
  }
`;

// ===== ATTACH BUTTON =====
const AttachButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease, background 0.2s ease;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;

  &:hover {
    color: #1a1a1a;
    background: #f5f5f5;
  }

  &:active {
    background: #e5e5e5;
  }

  @media (min-width: 768px) {
    padding: 10px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ===== TEXTAREA INPUT =====
const Input = styled.textarea`
  flex: 1;
  padding: 11px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  max-height: 120px;
  color: #1a1a1a;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.08);
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 15px;
  }
`;

// ===== SEND BUTTON =====
const SendButton = styled.button`
  padding: 8px 14px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
  min-width: 40px;
  height: 40px;

  &:hover:not(:disabled) {
    background: #333;
    box-shadow: 0 2px 8px rgba(26, 26, 26, 0.15);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 44px;
    height: 44px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ===== HIDDEN FILE INPUT =====
const FileInput = styled.input`
  display: none;
`;

export default function MessageInput({ chatId, onMessageSent }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { showNotification } = useNotification();
  const { mutateAsync: sendMessage, isPending } = useSendMessage();
  const { setTypingStatus } = useSocket();

  // Handle typing indicator
  const handleTextChange = useCallback(
    (e) => {
      setText(e.target.value);

      if (!isTyping) {
        setIsTyping(true);
        setTypingStatus(chatId, true);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingStatus(chatId, false);
      }, 2000);
    },
    [chatId, isTyping, setTypingStatus]
  );

  // Handle send message
  const handleSend = useCallback(async () => {
    if (!text.trim() && attachments.length === 0) return;

    try {
      setIsTyping(false);
      setTypingStatus(chatId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      let messageData;
      if (attachments.length > 0) {
        messageData = new FormData();
        messageData.append('chatId', chatId);
        messageData.append('content', text.trim());

        attachments.forEach((attachment) => {
          messageData.append('attachments', attachment.file);
        });
      } else {
        messageData = {
          chatId,
          content: text.trim()
        };
      }

      await sendMessage({
        chatId,
        messageData
      });

      setText('');
      setAttachments([]);
      onMessageSent?.();

      if (attachments.length > 0) {
        showNotification(
          'success',
          'Message sent',
          `${attachments.length} attachment${attachments.length > 1 ? 's' : ''} sent`
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('error', 'Failed to send', error.message);
    }
  }, [text, chatId, attachments, sendMessage, setTypingStatus, onMessageSent, showNotification]);

  // Handle file selection
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null,
      name: file.name,
      size: file.size
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Remove attachment
  const removeAttachment = useCallback((id) => {
    setAttachments((prev) => {
      const updated = prev.filter((att) => att.id !== id);
      const removed = prev.find((att) => att.id === id);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  }, []);

  // Handle keyboard send
  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!chatId) {
    console.warn('⚠️ MessageInput: chatId is missing');
    return null;
  }

  return (
    <Container>
      {attachments.length > 0 && (
        <AttachmentsPreview>
          {attachments.map((attachment) => (
            <AttachmentPreview key={attachment.id}>
              {attachment.preview ? (
                <AttachmentImage
                  src={attachment.preview}
                  alt={attachment.name}
                />
              ) : (
                <AttachmentFile>📄</AttachmentFile>
              )}
              <RemoveButton
                onClick={() => removeAttachment(attachment.id)}
                title="Remove"
              >
                ×
              </RemoveButton>
            </AttachmentPreview>
          ))}
        </AttachmentsPreview>
      )}

      <InputWrapper>
        <AttachButton
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
        >
          <Plus size={20} />
        </AttachButton>

        <Input
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isPending}
        />

        <SendButton
          onClick={handleSend}
          disabled={isPending || (!text.trim() && attachments.length === 0)}
          title="Send message (Ctrl+Enter)"
        >
          <Send size={18} />
        </SendButton>
      </InputWrapper>

      <FileInput
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.mp3,.mp4"
      />
    </Container>
  );
}
