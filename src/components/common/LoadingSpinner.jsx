import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  height: ${(props) => {
    if (props.size === 'sm') return '16px';
    if (props.size === 'lg') return '48px';
    return '32px';
  }};
  width: ${(props) => {
    if (props.size === 'sm') return '16px';
    if (props.size === 'lg') return '48px';
    return '32px';
  }};
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function LoadingSpinner({ size = 'md' }) {
  return (
    <SpinnerContainer>
      <Spinner size={size} />
    </SpinnerContainer>
  );
}