"use client";

import styled from "styled-components";
import { Header } from "@/components/header";
import  {SearchBar}  from "@/components/search-bar";
import { SpecialOffers } from "@/components/special-offers";
import { CarBrands } from "@/components/car-brands";
import { TopDeals } from "@/components/top-deals";
import { BottomNav } from "@/components/bottom-nav";

// ===== PAGE WRAPPER =====
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;

  @media (max-width: 1023px) {
    flex-direction: column;
  }

  @media (min-width: 1024px) {
    background: #f9f9f9;
  }
`;

// ===== SIDEBAR (DESKTOP ONLY) =====
const Sidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    width: 80px;
    background: #1a1a1a;
    border-right: 1px solid #e5e5e5;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    gap: 12px;
  }

  @media (min-width: 1440px) {
    width: 80px;
  }
`;

// ===== MAIN CONTENT =====
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background: #ffffff;
  min-height: 100vh;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (min-width: 1024px) {
    margin-left: 80px;
    padding-bottom: 40px;
    background: #f9f9f9;
    padding: 0;
  }

  @media (min-width: 1440px) {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 0;
    padding: 0;
  }
`;

// ===== CONTENT AREA =====
const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 20px;

  @media (min-width: 1024px) {
    gap: 0;
    padding: 0;
    grid-column: 1;
  }

  @media (min-width: 1440px) {
    gap: 0;
  }
`;

// ===== RIGHT PANEL (DESKTOP ONLY) =====
const RightPanel = styled.aside`
  display: none;

  @media (min-width: 1440px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    grid-column: 2;
    background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
    border-left: 1px solid #f0f0f0;
    position: sticky;
    top: 0;
    height: fit-content;
    max-height: 100vh;
    overflow-y: auto;
  }
`;

// ===== SEARCH WRAPPER =====
const SearchWrapper = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 18px 20px;
  }

  @media (min-width: 1024px) {
    padding: 20px 24px;
    background: #f9f9f9;
    border-bottom: none;
  }
`;

// ===== SECTION WRAPPER =====
const SectionWrapper = styled.div`
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    padding: 24px 20px;
    gap: 18px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
    gap: 20px;
  }
`;

// ===== SECTION TITLE =====
const SectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 0 16px;

  @media (min-width: 768px) {
    font-size: 18px;
    padding: 0 20px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
    padding: 0 24px;
  }
`;

// ===== STATS CONTAINER =====
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 14px;
    padding: 20px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 16px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px;
  }
`;

// ===== STAT CARD =====
const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  @media (min-width: 768px) {
    padding: 14px;
    border-radius: 12px;
    gap: 8px;
  }

  @media (min-width: 1440px) {
    padding: 12px;
  }
`;

const StatLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1440px) {
    font-size: 18px;
  }
`;

// ===== RECOMMENDED CARD =====
const RecommendedCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a1a1a 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: #e5e5e5;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }
  }

  @media (min-width: 1440px) {
    padding: 18px;
  }

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    letter-spacing: -0.3px;
  }

  p {
    font-size: 12px;
    color: #999;
    margin: 0;
    line-height: 1.6;
  }
`;

// ===== BOTTOM NAV WRAPPER =====
const BottomNavWrapper = styled.div`
  @media (max-width: 1023px) {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
    background: #ffffff;
    border-top: 1px solid #f0f0f0;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;
export default function HomePage() {
  return (
    <PageWrapper>
      {/* DESKTOP SIDEBAR */}
      <Sidebar>
        <BottomNav active="home" />
      </Sidebar>

      {/* MAIN CONTENT */}
      <MainContent>
        <ContentArea>
          {/* HEADER - STICKY TOP */}
          <Header />

          {/* SEARCH BAR - STICKY */}
          <SearchWrapper>
            <SearchBar />
          </SearchWrapper>

          {/* SPECIAL OFFERS SECTION */}
          <SectionWrapper>
            <SpecialOffers />
          </SectionWrapper>

          {/* CAR BRANDS SECTION */}
          <SectionWrapper>
            <SectionTitle>Browse Categories</SectionTitle>
            <CarBrands />
          </SectionWrapper>

          {/* TOP DEALS SECTION */}
          <SectionWrapper>
            <TopDeals />
          </SectionWrapper>
        </ContentArea>

        {/* RIGHT PANEL - DESKTOP 1440px+ ONLY */}
        <RightPanel>
          {/* QUICK STATS CARD */}
          <RecommendedCard>
            <h3>📊 Quick Stats</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <span
                  style={{ fontSize: "12px", color: "#666", fontWeight: 600 }}
                >
                  Active Listings
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  12
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <span
                  style={{ fontSize: "12px", color: "#666", fontWeight: 600 }}
                >
                  Total Views
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  453
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                <span
                  style={{ fontSize: "12px", color: "#666", fontWeight: 600 }}
                >
                  Messages
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  8
                </span>
              </div>
            </div>
          </RecommendedCard>

          {/* FEATURED LISTINGS CARD */}
          <RecommendedCard>
            <h3>⭐ Featured Listings</h3>
            <p>
              Boost your visibility with featured listings. Promote your best
              items to stand out.
            </p>
          </RecommendedCard>

          {/* RECENT ACTIVITY CARD */}
          <RecommendedCard>
            <h3>🕐 Recent Activity</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#666",
                  padding: "6px 0",
                }}
              >
                <span>Last Listing</span>
                <span style={{ fontWeight: 600, color: "#1a1a1a" }}>Today</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#666",
                  padding: "6px 0",
                }}
              >
                <span>Last Message</span>
                <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
                  2h ago
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#666",
                  padding: "6px 0",
                }}
              >
                <span>Profile Views</span>
                <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
                  12 today
                </span>
              </div>
            </div>
          </RecommendedCard>
        </RightPanel>
      </MainContent>

      {/* BOTTOM NAVIGATION - MOBILE ONLY */}
      <BottomNavWrapper>
        <BottomNav active="home" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
