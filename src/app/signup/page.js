"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/hooks/useAuth";
import { useCampuses } from "@/hooks/useQueries";

import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt,
  FaUsers,
  FaRocket,
} from "react-icons/fa";

/* =========================
   SIGNUP COMPONENT
========================= */

const Signup = () => {
  const router = useRouter();

  const {
    signup,
    isSigningUp,
    verifyGoogle,
    isVerifyingGoogle,
    completeGoogleSignup,
    isCompletingSignup,
  } = useAuth();

  const { data: campuses = [] } = useCampuses();
  console.log(campuses);

  const [step, setStep] = useState("method");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleData, setGoogleData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    campusId: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const googleButtonRef = useRef(null);

  /* =========================
     GOOGLE CALLBACK
  ========================= */

  const handleGoogleResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        setError("Failed to get Google credential");
        return;
      }

      try {
        const result = await verifyGoogle(response.credential);

        if (result?.data?.token) {
          router.push("/dashboard");
          return;
        }

        if (result?.data?.data?.tempToken) {
          setGoogleData({
            tempToken: result.data.data.tempToken,
            email: result.data.data.email,
            fullName: result.data.data.fullName,
          });
          setStep("google-campus");
          setError(null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Google sign-up failed");
      }
    },
    [verifyGoogle, router]
  );

  /* =========================
     INIT GOOGLE BUTTON
  ========================= */

  useEffect(() => {
    if (step !== "method" || !googleButtonRef.current) {
      return;
    }

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

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "signup_with",
          width: "100%",
        });
        console.log("Google button rendered successfully");
      } catch (err) {
        console.error("Google button init error:", err);
      }
    };

    loadGoogleScript();
  }, [step, handleGoogleResponse]);

  /* =========================
     FORM HANDLERS
  ========================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const validateEmailForm = () => {
    const { fullName, email, password, confirmPassword, campusId } = formData;

    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!campusId) {
      setError("Please select a campus");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmailForm()) {
      return;
    }

    const { fullName, email, password, campusId } = formData;

    try {
      await signup({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        campus: campusId,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Sign-up failed. Please try again."
      );
    }
  };

  const handleGoogleCampusSelect = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.campusId) {
      setError("Please select a campus");
      return;
    }

    try {
      await completeGoogleSignup({
        tempToken: googleData.tempToken,
        campusId: formData.campusId,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Sign-up failed. Please try again."
      );
    }
  };

  const handleBackStep = () => {
    setFormData({
      fullName: "",
      email: "",
      campusId: "",
      password: "",
      confirmPassword: "",
      remember: false,
    });
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================
     STEP 1 — METHOD
  ========================= */

  if (step === "method") {
    return (
      <Container>
          <HeaderNav onClick={() => router.back()} title="Go back">
            <FaArrowLeft />
          </HeaderNav>

          <HeroSection>
            <LogoArea>
              <FaShoppingBag size={56} />
            </LogoArea>

            <Title>Join Our Marketplace</Title>
            <SubTitle>Connect with your university community in seconds</SubTitle>

            <BenefitsGrid>
              <BenefitCard>
                <BenefitIcon>
                  <FaUsers />
                </BenefitIcon>
                <BenefitTitle>Network</BenefitTitle>
                <BenefitText>Connect with verified students</BenefitText>
              </BenefitCard>
              <BenefitCard>
                <BenefitIcon>
                  <FaRocket />
                </BenefitIcon>
                <BenefitTitle>Discover</BenefitTitle>
                <BenefitText>Find curated campus deals</BenefitText>
              </BenefitCard>
              <BenefitCard>
                <BenefitIcon>
                  <FaShieldAlt />
                </BenefitIcon>
                <BenefitTitle>Safe</BenefitTitle>
                <BenefitText>University-verified members only</BenefitText>
              </BenefitCard>
            </BenefitsGrid>
          </HeroSection>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <GoogleButtonWrapper ref={googleButtonRef} />

          {isVerifyingGoogle && (
            <LoadingContainer>
              <FaSpinner /> Creating your account…
            </LoadingContainer>
          )}

          <Divider>
            <DividerLine />
            <DividerText>or continue with email</DividerText>
            <DividerLine />
          </Divider>

          <Button
            type="button"
            onClick={() => {
              handleBackStep();
              setStep("email");
            }}
          >
            Sign up with Email
          </Button>

          <FooterLink>
            Already a member? <a href="/login">Sign in here</a>
          </FooterLink>
        </Container>
    );
  }

  /* =========================
     STEP 2 — EMAIL
  ========================= */

  if (step === "email") {
    return (
      <Container>
          <HeaderNav
            onClick={() => {
              handleBackStep();
              setStep("method");
            }}
            title="Go back"
          >
            <FaArrowLeft />
          </HeaderNav>

          <LogoArea>
            <FaShoppingBag size={56} />
          </LogoArea>

          <Title>Create Your Account</Title>
          <SubTitle>Get started in just 2 minutes</SubTitle>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleEmailSignup}>
            <FormGroup>
              <IconWrapper>
                <FaUser />
              </IconWrapper>
              <Input
                name="fullName"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSigningUp}
              />
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FaEnvelope />
              </IconWrapper>
              <Input
                name="email"
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                disabled={isSigningUp}
              />
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FaBuilding />
              </IconWrapper>
              <Select
                name="campusId"
                value={formData.campusId}
                onChange={handleChange}
                disabled={isSigningUp}
              >
                <option value="">Select your campus</option>
                {campuses?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FaLock />
              </IconWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSigningUp}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSigningUp}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </IconButton>
            </FormGroup>

            <FormGroup>
              <IconWrapper>
                <FaLock />
              </IconWrapper>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSigningUp}
              />
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSigningUp}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </IconButton>
            </FormGroup>

            <CheckboxLabel>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                disabled={isSigningUp}
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </CheckboxLabel>

            <Button type="submit" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <FaSpinner /> Creating account…
                </>
              ) : (
                "Create Your Account"
              )}
            </Button>
          </Form>

          <FooterLink>
            Already a member? <a href="/login">Sign in here</a>
          </FooterLink>
        </Container>
    );
  }

  /* =========================
     STEP 3 — GOOGLE CAMPUS
  ========================= */

  if (step === "google-campus" && googleData) {
    return (
      <Container>
          <HeaderNav
            onClick={() => {
              handleBackStep();
              setGoogleData(null);
              setStep("method");
            }}
            title="Go back"
          >
            <FaArrowLeft />
          </HeaderNav>

          <LogoArea>
            <FaBuilding size={60} />
          </LogoArea>

          <Title>Welcome, {googleData.fullName}!</Title>
          <SmallText>{googleData.email}</SmallText>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubTitle>Select your campus to complete signup</SubTitle>

          <Form onSubmit={handleGoogleCampusSelect}>
            <FormGroup>
              <IconWrapper>
                <FaBuilding />
              </IconWrapper>
              <Select
                name="campusId"
                value={formData.campusId}
                onChange={handleChange}
                disabled={isCompletingSignup}
              >
                <option value="">Select Campus</option>
                {campuses?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <Button type="submit" disabled={isCompletingSignup}>
              {isCompletingSignup ? (
                <>
                  <FaSpinner /> Completing…
                </>
              ) : (
                "Complete Signup"
              )}
            </Button>
          </Form>
        </Container>
    );
  }

  return null;
};

export default Signup;

/* =========================
   STYLES
========================= */

const PageWrapper = styled.div`
  display: none;
`;

const Container = styled.div`
  width: 100%;
  max-width: 440px;
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
  margin-bottom: 36px;

  @media (min-width: 768px) {
    margin-bottom: 48px;
  }
`;

const HeaderNav = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  margin-bottom: 32px;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: #1a1a1a;
  }

  @media (min-width: 768px) {
    font-size: 22px;
    margin-bottom: 40px;
  }
`;

const LogoArea = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  color: #1a1a1a;
  font-size: 56px;

  @media (min-width: 768px) {
    font-size: 64px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 32px;
    margin-bottom: 12px;
  }
`;

const SubTitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  font-weight: 500;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 15px;
    margin-bottom: 28px;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    gap: 12px;
    margin-bottom: 32px;
  }
`;

const BenefitCard = styled.div`
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
    gap: 10px;
  }
`;

const BenefitIcon = styled.div`
  font-size: 24px;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const BenefitTitle = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const BenefitText = styled.p`
  font-size: 10px;
  color: #666;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

const SmallText = styled.p`
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    gap: 20px;
    margin-bottom: 40px;
  }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 0;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
  display: flex;
  align-items: center;
  pointer-events: none;

  @media (min-width: 768px) {
    left: 18px;
    font-size: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1.5px solid #f0f0f0;
  background: #f9f9f9;
  border-radius: 12px;
  font-size: 14px;
  color: #1a1a1a;
  outline: none;
  transition: all 0.2s ease;
  font-family: "Poppins", sans-serif;

  &::placeholder {
    color: #999;
  }

  &:focus {
    background: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(26, 26, 26, 0.08);
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 18px 16px 50px;
    font-size: 15px;
    border-radius: 14px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1.5px solid #f0f0f0;
  background: #f9f9f9;
  border-radius: 12px;
  font-size: 14px;
  color: #1a1a1a;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Poppins", sans-serif;
  appearance: none;

  option {
    background: white;
    color: #333;
  }

  &:focus {
    background: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(26, 26, 26, 0.08);
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 18px 16px 50px;
    font-size: 15px;
    border-radius: 14px;
  }
`;

const IconButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 16px;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    right: 18px;
    font-size: 18px;
  }
`;

const Button = styled.button`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 0;
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

  svg {
    animation: spin 1s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  @media (min-width: 768px) {
    padding: 16px 24px;
    font-size: 16px;
    border-radius: 14px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 32px 0;
  color: #999;

  @media (min-width: 768px) {
    margin: 40px 0;
  }
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #f0f0f0;
`;

const DividerText = styled.span`
  color: #999;
  font-size: 13px;
  font-weight: 500;
  padding: 0 12px;

  @media (min-width: 768px) {
    font-size: 14px;
    padding: 0 16px;
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #666;
  font-size: 14px;
  padding: 14px;

  svg {
    animation: spin 1s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const GoogleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  color: #333;
  width: 100%;
  margin-bottom: 32px;

  div {
    width: 100%;
  }

  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  user-select: none;
  line-height: 1.5;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  &:hover {
    color: #1a1a1a;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Checkmark = styled.span`
  position: absolute;
  left: 0;
  top: 3px;
  height: 20px;
  width: 20px;
  background-color: transparent;
  border: 2px solid #999;
  border-radius: 6px;
  transition: all 0.2s ease;

  ${CheckboxLabel} input:checked & {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
  }

  &:after {
    content: "";
    position: absolute;
    display: none;
  }

  ${CheckboxLabel} input:checked &:after {
    display: block;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const FooterLink = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #666;
  line-height: 1.5;

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
    margin-top: 24px;
    font-size: 14px;
  }
`;

const FaShoppingBag = styled(FaBuilding)``;

