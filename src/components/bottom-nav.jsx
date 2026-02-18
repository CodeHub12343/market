"use client"

import Link from "next/link"
import styled from "styled-components"
import { Home, Package, MessageSquare, FileText, User } from "lucide-react"

/**
 * @typedef {Object} BottomNavProps
 * @property {("home" | "orders" | "inbox" | "wallet" | "profile")} active - The active navigation item
 */

// ===== NAV WRAPPER =====
const NavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  @media (min-width: 1024px) {
    position: static;
    border-top: none;
    border-right: 1px solid #f0f0f0;
    width: 80px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    background: #1a1a1a;
    backdrop-filter: none;
  }
`

// ===== NAV CONTAINER =====
const NavContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0;
  width: 100%;

  @media (min-width: 1024px) {
    max-width: none;
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`

// ===== NAV LIST =====
const NavList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 64px;
  padding: 0 16px;

  @media (min-width: 768px) {
    height: 72px;
  }

  @media (min-width: 1024px) {
    flex-direction: column;
    height: auto;
    gap: 4px;
    justify-content: flex-start;
    padding: 0 8px;
  }
`

// ===== NAV LINK =====
const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  height: 100%;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding: 0;
  border-radius: 12px;

  @media (min-width: 1024px) {
    flex: none;
    width: 100%;
    height: auto;
    padding: 12px 8px;
    gap: 8px;
  }

  svg {
    width: 22px;
    height: 22px;
    color: ${(props) => (props.$active ? "#1a1a1a" : "#666")};
    fill: ${(props) => (props.$active ? "#1a1a1a" : "none")};
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 768px) {
      width: 24px;
      height: 24px;
    }

    @media (min-width: 1024px) {
      width: 22px;
      height: 22px;
      color: ${(props) => (props.$active ? "#ffffff" : "#999")};
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${(props) => (props.$active ? "24px" : "0")};
    height: 3px;
    background: #1a1a1a;
    border-radius: 2px;
    transition: all 0.2s ease;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &:hover {
    @media (max-width: 1023px) {
      background: #f5f5f5;
    }

    @media (min-width: 1024px) {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  @media (min-width: 1024px) {
    background: ${(props) => (props.$active ? "rgba(255, 255, 255, 0.15)" : "transparent")};
  }
`

// ===== NAV LABEL =====
const NavLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${(props) => (props.$active ? "#1a1a1a" : "#666")};
  letter-spacing: 0.3px;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    font-size: 11px;
  }

  @media (min-width: 1024px) {
    display: block;
    font-size: 10px;
    color: ${(props) => (props.$active ? "#ffffff" : "#999")};
  }
`

// ===== NAV ITEMS =====
const navItems = [
  { id: "home", icon: Home, label: "Home", href: "/dashboard" },
  { id: "products", icon: Package, label: "Products", href: "/products" },
  { id: "messages", icon: MessageSquare, label: "Messages", href: "/messages" },
  { id: "My Offers", icon: FileText, label: "Offers", href: "/my-offers" },
  { id: "profile", icon: User, label: "Profile", href: "/profile" },
]

/**
 * @param {BottomNavProps} props - The component props
 */
export function BottomNav({ active }) {
  return (
    <NavWrapper>
      <NavContainer>
        <NavList>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <NavLink key={item.id} href={item.href} $active={isActive} title={item.label}>
                <Icon />
                <NavLabel $active={isActive}>{item.label}</NavLabel>
              </NavLink>
            )
          })}
        </NavList>
      </NavContainer>
    </NavWrapper>
  )
}
