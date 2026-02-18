'use client';

import styled from 'styled-components';
import { useOfferForm } from '@/hooks/useOfferForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import SuccessAlert from '@/components/common/SuccessAlert';
import { DollarSign, Clock, MessageSquare } from 'lucide-react';

// ===== FORM CONTAINER =====
const FormContainer = styled.div`
  padding: 0;
  background: white;
  border-radius: 0;
  box-shadow: none;
`;

const FormContent = styled.div`
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
  }
`;

// ===== ALERTS =====
const AlertContainer = styled.div`
  margin-bottom: 12px;

  @media (min-width: 640px) {
    margin-bottom: 16px;
  }
`;

// ===== FORM SECTION =====
const FormSection = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    margin-bottom: 24px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 28px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 14px;
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
    margin-bottom: 16px;
  }
`;

// ===== FORM GROUP =====
const FormGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

// ===== ICON WRAPPER =====
const IconWrapper = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  pointer-events: none;
  z-index: 1;

  @media (min-width: 640px) {
    left: 16px;
  }

  @media (min-width: 1024px) {
    left: 18px;
  }

  svg {
    width: 16px;
    height: 16px;

    @media (min-width: 640px) {
      width: 18px;
      height: 18px;
    }
  }
`;

// ===== INPUT & SELECT =====
const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 12px 44px;
  background: #f8f8f8;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 50px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 52px;
  }

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #333;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f5f5f5;
  }
`;

const Select = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 12px 44px;
  background: #f8f8f8;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23aaa' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 50px 14px 50px;
    background-position: right 16px center;
    padding-right: 44px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 52px 16px 52px;
    background-position: right 18px center;
    padding-right: 46px;
  }

  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: #333;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  option {
    padding: 8px;
    background: white;
    color: #333;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px;
  background: #f8f8f8;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  resize: vertical;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 120px;
    padding: 14px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 130px;
    padding: 16px;
  }

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #333;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

// ===== ERROR & HELPER TEXT =====
const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;

  @media (min-width: 640px) {
    font-size: 13px;
    margin-top: 8px;
  }
`;

const CharCounter = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 6px;
  font-weight: 500;

  @media (min-width: 640px) {
    font-size: 12px;
    margin-top: 8px;
  }
`;

// ===== AMOUNT DISPLAY BOX =====
const AmountBox = styled.div`
  background: #f8f8f8;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  margin-top: 12px;

  @media (min-width: 640px) {
    padding: 16px;
    margin-top: 14px;
  }

  @media (min-width: 1024px) {
    padding: 18px;
    margin-top: 16px;
  }
`;

const AmountDisplay = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 640px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
`;

const AmountLabel = styled.div`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin-top: 6px;

  @media (min-width: 640px) {
    font-size: 11px;
    margin-top: 8px;
  }

  @media (min-width: 1024px) {
    font-size: 12px;
  }
`;

// ===== BUTTONS =====
const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 640px) {
    gap: 14px;
    margin-top: 24px;
    padding-top: 24px;
  }

  @media (min-width: 1024px) {
    margin-top: 28px;
    padding-top: 28px;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 24px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 28px;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 20px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 24px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 28px;
  }

  @media (hover: hover) {
    &:hover {
      background: #e5e7eb;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function OfferForm({
  requestId,
  request,
  onSubmit,
  isLoading = false,
  error = null,
  success = null,
  onCancel = null
}) {
  const {
    formData,
    handleInputChange,
    validateForm,
    errors,
    resetForm,
    messageCharCount,
    messageCharLimit
  } = useOfferForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form data before validation:', formData);
    console.log('RequestId prop:', requestId);

    if (!validateForm()) {
      console.log('Validation failed. Errors:', errors);
      return;
    }

    // Only send fields that backend expects
    const submitData = {
      request: requestId || request?._id || formData.request,
      amount: parseFloat(formData.amount),
      ...(formData.message && { message: formData.message.trim() })
    };

    console.log('Submitting offer data:', submitData);
    onSubmit(submitData);
  };

  return (
    <FormContainer>
      <AlertContainer>
        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}
      </AlertContainer>

      <FormContent>
        <form onSubmit={handleSubmit}>
          {/* OFFER AMOUNT SECTION */}
          <FormSection>
            <SectionTitle>Your Offer Price</SectionTitle>
            
            <FormGroup>
              <IconWrapper>
                <DollarSign size={16} />
              </IconWrapper>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter offer amount"
                min="1"
                step="100"
                required
              />
              {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
            </FormGroup>

            {formData.amount && (
              <AmountBox>
                <AmountDisplay>₦{parseInt(formData.amount).toLocaleString()}</AmountDisplay>
                <AmountLabel>Your Offer Amount</AmountLabel>
              </AmountBox>
            )}
          </FormSection>

          {/* AVAILABILITY SECTION */}
          <FormSection>
            <SectionTitle>Delivery Timeline</SectionTitle>

            <FormGroup>
              <IconWrapper>
                <Clock size={16} />
              </IconWrapper>
              <Select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
              >
                <option value="">Select delivery time</option>
                <option value="immediate">Immediately</option>
                <option value="few-days">In a few days</option>
                <option value="one-week">Within a week</option>
                <option value="two-weeks">Within two weeks</option>
              </Select>
            </FormGroup>
          </FormSection>

          {/* MESSAGE SECTION */}
          <FormSection>
            <SectionTitle>Your Pitch</SectionTitle>

            <FormGroup>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your offer, what you can deliver, guarantees, shipping options, and why you're the best choice..."
                required
              />
              {errors.message && <ErrorText>{errors.message}</ErrorText>}
              <CharCounter>
                {messageCharCount} / {messageCharLimit} characters
              </CharCounter>
            </FormGroup>
          </FormSection>

          {/* ACTION BUTTONS */}
          <ButtonGroup>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Offer'}
            </SubmitButton>
            <CancelButton type="button" onClick={onCancel || resetForm}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </form>
      </FormContent>
    </FormContainer>
  );
}
