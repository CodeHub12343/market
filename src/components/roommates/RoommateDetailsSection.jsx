'use client'

import styled from 'styled-components'
import { MapPin, Users, DoorOpen, Wifi, Droplets, Wind, Zap, Calendar, User, Mail, Phone } from 'lucide-react'

const Container = styled.div`
  display: grid;
  gap: 24px;
`

const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: #2196f3;
  }
`

const DescriptionText = styled.p`
  color: #555;
  line-height: 1.6;
  font-size: 14px;
  margin: 0;
`

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;

  svg {
    width: 18px;
    height: 18px;
    color: #2196f3;
    flex-shrink: 0;
  }
`

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const DetailIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: #2196f3;
  }
`

const DetailContent = styled.div`
  flex: 1;
`

const DetailLabel = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`

const DetailValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`

const LandlordCard = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 16px;
`

const LandlordAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background: #e0e0e0;
`

const LandlordInfo = styled.div`
`

const LandlordName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
`

const LandlordMeta = styled.div`
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 8px;
`

const LandlordActions = styled.div`
  display: flex;
  gap: 8px;
`

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: #666;
  }

  &:hover {
    background: #2196f3;
    border-color: #2196f3;
    color: white;

    svg {
      color: white;
    }
  }
`

const PrimaryButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`

const RulesSection = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    color: #555;
    display: flex;
    gap: 8px;

    &:last-child {
      border-bottom: none;
    }

    &::before {
      content: '✓';
      color: #4caf50;
      font-weight: 700;
      flex-shrink: 0;
    }
  }
`

export function RoommateDetailsSection({
  roommate,
  onApply = () => {},
  onMessage = () => {},
  onCall = () => {},
  isApplied = false,
  isLoading = false,
}) {
  const amenitiesMap = {
    wifi: { icon: Wifi, label: 'WiFi' },
    kitchen: { icon: DoorOpen, label: 'Kitchen' },
    bathroom: { icon: Droplets, label: 'Bathroom' },
    parking: { icon: Users, label: 'Parking' },
    ac: { icon: Wind, label: 'AC' },
    water: { icon: Droplets, label: 'Water' },
    generator: { icon: Zap, label: 'Generator' },
  }

  return (
    <Container>
      {/* About Section */}
      <Section>
        <SectionTitle>About This Room</SectionTitle>
        <DescriptionText>
          {roommate?.description || 'No description provided.'}
        </DescriptionText>
      </Section>

      {/* Room Details */}
      <Section>
        <SectionTitle>
          <DoorOpen /> Room Details
        </SectionTitle>
        <DetailsGrid>
          <DetailItem>
            <DetailIcon>
              <DoorOpen />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Room Type</DetailLabel>
              <DetailValue>{roommate?.roomType || 'N/A'}</DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <Users />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Number of Rooms</DetailLabel>
              <DetailValue>{roommate?.numberOfRooms || 1} room(s)</DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <Calendar />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Lease Length</DetailLabel>
              <DetailValue>{roommate?.preferences?.leaseLength || 'Flexible'}</DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <MapPin />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Location</DetailLabel>
              <DetailValue>{roommate?.location?.address || 'N/A'}</DetailValue>
            </DetailContent>
          </DetailItem>
        </DetailsGrid>
      </Section>

      {/* Amenities */}
      {roommate?.amenities && roommate.amenities.length > 0 && (
        <Section>
          <SectionTitle>
            <Wifi /> Amenities
          </SectionTitle>
          <AmenitiesGrid>
            {roommate.amenities.map((amenity) => {
              const amenityConfig = amenitiesMap[amenity.toLowerCase()]
              const IconComponent = amenityConfig?.icon || Wifi
              return (
                <AmenityItem key={amenity}>
                  <IconComponent />
                  {amenityConfig?.label || amenity}
                </AmenityItem>
              )
            })}
          </AmenitiesGrid>
        </Section>
      )}

      {/* House Rules */}
      {roommate?.rules && roommate.rules.length > 0 && (
        <Section>
          <SectionTitle>House Rules</SectionTitle>
          <RulesSection>
            {roommate.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </RulesSection>
        </Section>
      )}

      {/* Landlord Information */}
      {roommate?.landlord && (
        <Section>
          <SectionTitle>
            <User /> Landlord Information
          </SectionTitle>
          <LandlordCard>
            <LandlordAvatar
              src={roommate.landlord.avatar || '/default-avatar.svg'}
              alt={roommate.landlord.name}
              onError={(e) => {
                e.target.src = '/default-avatar.svg'
              }}
            />
            <LandlordInfo>
              <LandlordName>{roommate.landlord.name}</LandlordName>
              <LandlordMeta>
                <span>🏠 Landlord</span>
                <span>•</span>
                <span>{roommate.landlord.listingCount || 0} listings</span>
              </LandlordMeta>
            </LandlordInfo>
            <LandlordActions>
              <IconButton onClick={onMessage} title="Send message">
                <Mail />
              </IconButton>
              <IconButton onClick={onCall} title="Call landlord">
                <Phone />
              </IconButton>
            </LandlordActions>
          </LandlordCard>
        </Section>
      )}

      {/* Action Button */}
      <Section>
        <PrimaryButton
          onClick={onApply}
          disabled={isApplied || isLoading}
        >
          {isLoading ? 'Processing...' : isApplied ? '✓ Already Applied' : 'Apply for This Room'}
        </PrimaryButton>
      </Section>
    </Container>
  )
}
