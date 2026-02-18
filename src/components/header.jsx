"use client"

import styled from "styled-components"
import { Bell, Heart, LogOut, Settings, Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

// ===== HEADER WRAPPER =====
const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 40;

  @media (min-width: 768px) {
    padding: 16px 20px;
  }

  @media (min-width: 1024px) {
    padding: 16px 24px;
  }
`

// ===== USER SECTION =====
const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

// ===== AVATAR =====
const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
  border: 2px solid #f0f0f0;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (min-width: 1024px) {
    width: 40px;
    height: 40px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

// ===== AVATAR FALLBACK =====
const AvatarFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
`

// ===== USER INFO =====
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`

// ===== GREETING =====
const Greeting = styled.span`
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 11px;
  }
`

// ===== USER NAME =====
const UserName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`

// ===== ACTIONS CONTAINER =====
const Actions = styled.div`
  position: fixed;
  top: 14px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  z-index: 41;

  @media (min-width: 768px) {
    top: 16px;
    right: 20px;
    gap: 10px;
  }

  @media (min-width: 1024px) {
    top: 16px;
    right: 24px;
    gap: 8px;
  }
`

// ===== MENU BUTTON =====
const MenuButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }

  @media (min-width: 1024px) {
    width: 36px;
    height: 36px;
  }

  &:hover {
    background: #f5f5f5;
    border-color: #e5e5e5;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #1a1a1a;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #1a1a1a;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
      width: 20px;
      height: 20px;
    }

    @media (min-width: 1024px) {
      width: 18px;
      height: 18px;
    }
  }
`

// ===== DROPDOWN MENU =====
const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  min-width: 220px;
  overflow: hidden;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

// ===== MENU ITEM =====
const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
  text-align: left;

  &:hover {
    background: #f5f5f5;
  }

  &:focus {
    outline: none;
    background: #f0f0f0;
  }

  &:first-child {
    border-top: none;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  ${props => props.variant === 'danger' && `
    color: #e53935;
    
    svg {
      color: #e53935;
    }

    &:hover {
      background: rgba(229, 57, 53, 0.08);
    }
  `}
`

// ===== MENU DIVIDER =====
const MenuDivider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0;
`

// ===== OVERLAY =====
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`

// ===== NOTIFICATION BADGE =====
const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: #e53935;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  border: 2px solid #ffffff;
`

// ===== GREETING FUNCTION =====
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 18) return "Good Afternoon"
  return "Good Evening"
}

// ===== HEADER COMPONENT =====
export function Header() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !menuButtonRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    logout()
    setIsMenuOpen(false)
    router.push("/login")
  }

  const handleMenuItemClick = (callback) => {
    callback()
    setIsMenuOpen(false)
  }

  if (isLoading) {
    return (
      <HeaderWrapper>
        <div>Loading...</div>
      </HeaderWrapper>
    )
  }

  if (!user) {
    return (
      <HeaderWrapper>
        <div>Please log in</div>
      </HeaderWrapper>
    )
  }

  // Get user initials for fallback avatar
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  }

  // Check multiple possible picture field names
  const userPicture = 
    user.profilePicture || 
    user.picture || 
    user.avatar || 
    user.profileImage ||
    user.photo ||
    user.image ||
    null

  return (
    <>
      <HeaderWrapper>
        <UserSection>
          <Avatar title={user.fullName}>
            {userPicture ? (
              <img
                src={userPicture}
                alt={user.fullName || "User avatar"}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
            )}
          </Avatar>
          <UserInfo>
            <Greeting>{getGreeting()}</Greeting>
            <UserName>{user.fullName || "User"}</UserName>
          </UserInfo>
        </UserSection>
      </HeaderWrapper>

      <Actions>
        <MenuButton
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          title="Menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </MenuButton>

        {isMenuOpen && (
          <>
            <Overlay onClick={() => setIsMenuOpen(false)} />
            <DropdownMenu ref={menuRef} role="menu">
              <MenuItem
                role="menuitem"
                onClick={() => handleMenuItemClick(() => {})}
                title="Notifications"
              >
                <Bell />
                <span>Notifications</span>
              </MenuItem>

              <MenuItem
                role="menuitem"
                onClick={() => handleMenuItemClick(() => {})}
                title="Favorites"
              >
                <Heart />
                <span>Favorites</span>
              </MenuItem>

              <MenuDivider />

              <MenuItem
                role="menuitem"
                onClick={() => handleMenuItemClick(() => router.push('/settings'))}
                title="Settings"
              >
                <Settings />
                <span>Settings</span>
              </MenuItem>

              <MenuItem
                role="menuitem"
                variant="danger"
                onClick={() => handleMenuItemClick(handleLogout)}
                title="Logout"
              >
                <LogOut />
                <span>Logout</span>
              </MenuItem>
            </DropdownMenu>
          </>
        )}
      </Actions>
    </>
  )
}