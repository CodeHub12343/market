"use client";

import styled from "styled-components";

/* Page Wrapper (body replacement) */
export const PageWrapper = styled.div`
  margin: 0;
  padding: 0;
  font-family: "Inter", sans-serif;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
`;

/* Main Container */
export const LoginContainer = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* Back Button */
export const BackButton = styled.div`
  align-self: flex-start;
  padding: 10px 0;
  font-size: 24px;
  color: #000;
  margin-bottom: 20px;
  cursor: pointer;
`;

/* Icon Section */
export const IconSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const CarIcon = styled.div`
  font-size: 90px;
  color: #000;
`;

/* Heading */
export const Heading = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-bottom: 40px;
  text-align: center;
`;

/* Social Logins */
export const SocialLogins = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

export const SocialButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f7f7f7;
  }
`;

/* Separator */
export const Separator = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #888;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
`;

export const OrText = styled.span`
  padding: 0 15px;
  font-size: 14px;
`;

/* Sign In Button */
export const SignInButton = styled.button`
  width: 100%;
  padding: 18px 20px;
  border: none;
  border-radius: 12px;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 15px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }
`;

/* Sign Up Prompt */
export const SignupPrompt = styled.p`
  font-size: 14px;
  color: #888;
  text-align: center;
`;

export const SignupLink = styled.span`
  color: #000;
  font-weight: 600;
  cursor: pointer;
`;
