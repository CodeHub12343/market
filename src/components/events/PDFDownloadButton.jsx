'use client';

import React from 'react';
import styled from 'styled-components';
import { Download, Loader } from 'lucide-react';
import { useGenerateAgendaPDF } from '@/hooks/useEventSchedule';

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 11px 18px;
    font-size: 15px;
  }
`;

const PDFDownloadButton = ({
  eventId,
  eventData,
  compact = false,
  label = 'Download Agenda'
}) => {
  const { mutate: generatePDF, isPending } = useGenerateAgendaPDF();

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    generatePDF({
      eventId,
      eventData
    });
  };

  return (
    <DownloadButton
      onClick={handleDownload}
      disabled={isPending || !eventData}
      title={label}
    >
      {isPending ? (
        <>
          <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download />
          {!compact && <span>{label}</span>}
        </>
      )}
      
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </DownloadButton>
  );
};

export default PDFDownloadButton;
