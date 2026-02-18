"use client";

import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
/* import {
  PageWrapper,
  Container,
  Header,
  BackButton,
  LogoSection,
  CarIcon,
  Title,
  LoginForm,
  InputGroup,
  InputIcon,
  Input,
  TogglePassword,
  SignInButton,
  ForgotPassword,
  Divider,
  SocialLogin,
  SignupLink,
  ErrorMessage,
} from './styles'; */
import {
  FaArrowLeft,
  FaShoppingBag,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheckCircle,
  FaLightbulb,
} from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const { login, verifyGoogle, isLoggingIn, isVerifyingGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const googleButtonRef = useRef(null);

  const handleGoogleResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        setError("Google authentication failed");
        return;
      }

      try {
        const result = await verifyGoogle(response.credential);
        if (result?.data?.token) {
          router.push("/dashboard");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Google sign-in failed");
      }
    },
    [verifyGoogle, router]
  );

  useEffect(() => {
    if (showForm) return;
    if (!googleButtonRef.current) return;

    // Load Google script dynamically if not already loaded
    const loadGoogleScript = () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        initializeGoogle();
        return;
      }

      // Check if script is already being loaded
      if (
        document.querySelector(
          'script[src="https://accounts.google.com/gsi/client"]'
        )
      ) {
        // Script already exists, wait for it to load
        const checkInterval = setInterval(() => {
          if (
            window.google &&
            window.google.accounts &&
            window.google.accounts.id
          ) {
            clearInterval(checkInterval);
            initializeGoogle();
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google script loaded");
        setTimeout(initializeGoogle, 100);
      };
      script.onerror = () => {
        console.error("Failed to load Google script");
      };
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (!window?.google?.accounts?.id) {
        console.log("Google not loaded yet, retrying...");
        setTimeout(loadGoogleScript, 500);
        return;
      }

      console.log("Google loaded, rendering button...");

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: "100%",
          });
          console.log("Google button rendered successfully");
        }
      } catch (error) {
        console.error("Error rendering Google button:", error);
      }
    };

    loadGoogleScript();
  }, [showForm, handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  /* ================= PASSWORD LOGIN ================= */
  if (showForm) {
    return (
      <Container>
          <Header>
            <BackButton onClick={() => setShowForm(false)}>
              <FaArrowLeft />
            </BackButton>
          </Header>

          <LogoSection>
            <BrandIcon>
              <FaShoppingBag />
            </BrandIcon>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to access your marketplace</Subtitle>
          </LogoSection>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <LoginForm onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
              />
              <TogglePassword onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </TogglePassword>
            </InputGroup>

            <SignInButton disabled={isLoggingIn}>
              {isLoggingIn ? "Signing in..." : "Sign in to your account"}
            </SignInButton>
          </LoginForm>

          <ForgotPassword href="/forgot-password">
            <FaQuestionCircle /> Forgot your password?
          </ForgotPassword>

          <SignupLink>
            New to the marketplace? <a href="/signup">Create an account</a>
          </SignupLink>
        </Container>
    );
  }

  /* ================= SOCIAL LOGIN ================= */
  return (
    <Container>
        <Header>
          <BackButton onClick={() => router.back()}>
            <FaArrowLeft />
          </BackButton>
        </Header>

        <HeroSection>
          <LogoSection>
            <BrandIcon>
              <FaShoppingBag />
            </BrandIcon>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to your university marketplace account</Subtitle>
          </LogoSection>

          <TrustSignals>
            <TrustItem>
              <TrustIcon>
                <FaShieldAlt />
              </TrustIcon>
              <TrustText>Secure login</TrustText>
            </TrustItem>
            <TrustItem>
              <TrustIcon>
                <FaCheckCircle />
              </TrustIcon>
              <TrustText>Fast access</TrustText>
            </TrustItem>
            <TrustItem>
              <TrustIcon>
                <FaLightbulb />
              </TrustIcon>
              <TrustText>One-click sign-in</TrustText>
            </TrustItem>
          </TrustSignals>
        </HeroSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Divider>
          <span>Sign in with</span>
        </Divider>

        <SocialLogin>
          <div ref={googleButtonRef} style={{ width: "100%" }} />
        </SocialLogin>

        <Divider>
          <span>or</span>
        </Divider>

        <SignInButton
          onClick={() => setShowForm(true)}
          disabled={isVerifyingGoogle}
        >
          Sign in with email
        </SignInButton>

        <SignupLink>
          New here? <a href="/signup">Create your account</a> — it takes 2
          minutes
        </SignupLink>
      </Container>
  );
};

export default LoginPage;


const Container = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px 24px;
  background-color: #ffffff;
  border-radius: 0;
  box-shadow: none;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 60px 40px;
    border-radius: 0;
  }
`;

const HeroSection = styled.div`
  margin-bottom: 32px;
`;

const Header = styled.div`
  margin-bottom: 32px;

  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: #1a1a1a;
  }

  @media (min-width: 768px) {
    font-size: 22px;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 36px;

  @media (min-width: 768px) {
    margin-bottom: 48px;
  }
`;

const BrandIcon = styled.div`
  font-size: 56px;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;

  @media (min-width: 768px) {
    font-size: 64px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 32px;
    margin-bottom: 12px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const TrustSignals = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const TrustItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 12px;
  text-align: center;

  @media (min-width: 768px) {
    padding: 14px;
    border-radius: 14px;
  }
`;

const TrustIcon = styled.div`
  font-size: 24px;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const TrustText = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.3px;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    gap: 20px;
    margin-bottom: 40px;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1.5px solid #f0f0f0;
  background-color: #f9f9f9;
  border-radius: 12px;
  font-size: 14px;
  color: #1a1a1a;
  outline: none;
  transition: all 0.2s ease;
  font-family: "Poppins", sans-serif;

  &:focus {
    background-color: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(26, 26, 26, 0.08);
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
  }

  @media (min-width: 768px) {
    padding: 16px 18px 16px 50px;
    font-size: 15px;
    border-radius: 14px;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
  pointer-events: none;

  @media (min-width: 768px) {
    left: 18px;
    font-size: 18px;
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #1a1a1a;
  }

  @media (min-width: 768px) {
    right: 18px;
    font-size: 18px;
  }
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
  font-family: "Poppins", sans-serif;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(26, 26, 26, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 24px;
    font-size: 16px;
    border-radius: 14px;
  }
`;

const ForgotPassword = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: #1a1a1a;
  }

  svg {
    font-size: 14px;
  }

  @media (min-width: 768px) {
    margin-bottom: 40px;
    font-size: 15px;

    svg {
      font-size: 15px;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 32px 0;
  color: #999;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #f0f0f0;
  }

  span {
    padding: 0 12px;
    font-size: 13px;
    font-weight: 500;
    color: #999;
  }

  @media (min-width: 768px) {
    margin: 40px 0;

    span {
      font-size: 14px;
      padding: 0 16px;
    }
  }
`;

const SocialLogin = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 32px;

  div {
    width: 100%;
  }

  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SignupLink = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;

  a {
    color: #1a1a1a;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.2s ease;

    &:hover {
      color: #333;
    }
  }

  @media (min-width: 768px) {
    margin-top: 28px;
    font-size: 14px;
    padding-top: 16px;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fff5f5;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  border: 1px solid #feb2b2;
  line-height: 1.4;

  @media (min-width: 768px) {
    padding: 14px 18px;
    margin-bottom: 24px;
    font-size: 14px;
    border-radius: 12px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

const FaQuestionCircle = styled(FaLightbulb)``;
