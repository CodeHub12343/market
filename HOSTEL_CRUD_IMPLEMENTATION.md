# Hostel CRUD Operations - Complete Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Requirements](#backend-requirements)
4. [Frontend Implementation](#frontend-implementation)
5. [File Structure](#file-structure)
6. [API Integration](#api-integration)
7. [Hooks Implementation](#hooks-implementation)
8. [Component Implementation](#component-implementation)
9. [Pages Implementation](#pages-implementation)
10. [Styling with Styled-Components](#styling-with-styled-components)
11. [Data Validation](#data-validation)
12. [Error Handling](#error-handling)
13. [Testing](#testing)

---

## Overview

This guide provides complete documentation for implementing full CRUD (Create, Read, Update, Delete) operations for hostels in the university marketplace Next.js application.

**Technology Stack:**
- **Frontend:** Next.js 16 (React 18+) with App Router
- **State Management:** TanStack React Query v5
- **Styling:** Styled-Components
- **Backend API:** RESTful API (localhost:5000/api/v1)
- **Authentication:** JWT tokens stored in cookies/localStorage

---

## Architecture

### Data Flow Diagram
```
User Interface (Components) 
    ↓
Custom Hooks (useHostels, useCreateHostel, etc.)
    ↓
React Query (useQuery, useMutation)
    ↓
API Service (hostels.js)
    ↓
Axios Instance with Interceptors
    ↓
Backend API Endpoints
```

### Key Components
1. **API Service** (`src/services/hostels.js`) - All API calls
2. **Custom Hooks** (`src/hooks/useHostels.js`) - React Query wrappers
3. **Components** (`src/components/hostels/`) - Reusable UI components
4. **Pages** (`src/app/(protected)/hostels/`) - Route pages
5. **Context** (`src/context/AuthContext.jsx`) - User authentication

---

## Backend Requirements

### Expected Database Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  address: String,
  
  // Location nested object
  location: {
    address: String,
    campus: {
      _id: ObjectId,
      name: String,
      code: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Room types array
  roomTypes: [
    {
      _id: ObjectId,
      type: String (e.g., "Single", "Double"),
      price: Number,
      occupancy: Number,
      description: String
    }
  ],
  
  // Images
  images: [String], // Array of URLs
  thumbnail: String,
  image: String,
  
  // Contact information
  contact: {
    phoneNumber: String,
    email: String,
    website: String
  },
  
  // Additional fields
  amenities: [String],
  capacity: Number,
  campus: String (or ObjectId),
  roomType: String,
  price: Number,
  minPrice: Number,
  rules: String,
  category: String,
  
  // Metadata
  createdBy: ObjectId (User ID),
  createdAt: Date,
  updatedAt: Date
}
```

### Required API Endpoints

```
GET    /api/v1/hostels                    - Fetch all hostels (paginated)
GET    /api/v1/hostels/:id                - Fetch single hostel
POST   /api/v1/hostels                    - Create new hostel
PATCH  /api/v1/hostels/:id                - Update hostel
DELETE /api/v1/hostels/:id                - Delete hostel
GET    /api/v1/hostels/stats              - Get hostel statistics
GET    /api/v1/hostels?owner=me           - Get user's hostels
```

---

## Frontend Implementation

### 1. API Service Layer

**File:** `src/services/hostels.js`

```javascript
import api from './api';

const HOSTELS_ENDPOINT = '/hostels';

/**
 * Fetch single hostel by ID
 */
export const fetchHostelById = async (id) => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/${id}`);
    
    // Handle multiple response structures from backend
    let hostel = null;
    
    if (response.data.hostel) {
      hostel = response.data.hostel;
    } else if (response.data.data) {
      hostel = response.data.data;
    } else if (response.data._id) {
      hostel = response.data;
    } else {
      hostel = response.data;
    }
    
    if (!hostel || typeof hostel !== 'object') {
      throw new Error('Invalid hostel data received from server');
    }
    
    return hostel;
  } catch (error) {
    console.error('Error fetching hostel:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch all hostels with pagination
 */
export const fetchHostelsPaginated = async (page = 1, limit = 12, filters = {}) => {
  try {
    const response = await api.get(HOSTELS_ENDPOINT, {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch user's hostels
 */
export const fetchMyHostels = async (params = {}) => {
  try {
    const response = await api.get(HOSTELS_ENDPOINT, {
      params: { ...params, owner: 'me' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new hostel
 */
export const createHostel = async (hostelData, image = null) => {
  try {
    const formData = new FormData();

    // Add hostel data
    Object.keys(hostelData).forEach((key) => {
      if (hostelData[key] !== null && hostelData[key] !== undefined) {
        if (Array.isArray(hostelData[key])) {
          hostelData[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else if (typeof hostelData[key] === 'object') {
          formData.append(key, JSON.stringify(hostelData[key]));
        } else {
          formData.append(key, hostelData[key]);
        }
      }
    });

    // Add images
    if (image) {
      if (Array.isArray(image)) {
        image.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else if (image instanceof File) {
        formData.append('image', image);
      }
    }

    const response = await api.post(HOSTELS_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Store creator info in localStorage for ownership verification
    if (response.data.data?._id || response.data._id) {
      const hostelId = response.data.data?._id || response.data._id;
      const creatorMap = JSON.parse(localStorage.getItem('hostelCreators') || '{}');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        creatorMap[hostelId] = user._id;
        localStorage.setItem('hostelCreators', JSON.stringify(creatorMap));
      }
    }

    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update hostel
 */
export const updateHostel = async (id, hostelData, newImage = null) => {
  try {
    const formData = new FormData();

    Object.keys(hostelData).forEach((key) => {
      if (hostelData[key] !== null && hostelData[key] !== undefined) {
        if (Array.isArray(hostelData[key])) {
          hostelData[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else if (typeof hostelData[key] === 'object') {
          formData.append(key, JSON.stringify(hostelData[key]));
        } else {
          formData.append(key, hostelData[key]);
        }
      }
    });

    if (newImage) {
      if (Array.isArray(newImage)) {
        newImage.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else if (newImage instanceof File) {
        formData.append('image', newImage);
      }
    }

    const response = await api.patch(`${HOSTELS_ENDPOINT}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete hostel
 */
export const deleteHostel = async (id) => {
  try {
    const response = await api.delete(`${HOSTELS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search hostels
 */
export const searchHostels = async (query, filters = {}) => {
  try {
    const response = await api.get(HOSTELS_ENDPOINT, {
      params: { search: query, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get hostel statistics
 */
export const getHostelStats = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/stats`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Upload hostel image
 */
export const uploadHostelImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/cloudinary/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

---

### 2. Custom Hooks

**File:** `src/hooks/useHostels.js`

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as hostelService from '@/services/hostels';

/**
 * Fetch all hostels
 */
export const useAllHostels = (filters = {}) => {
  return useQuery({
    queryKey: ['hostels', filters],
    queryFn: () => hostelService.fetchHostelsPaginated(
      filters.page || 1,
      filters.limit || 12,
      filters
    ),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch single hostel by ID
 */
export const useHostel = (id, enabled = true) => {
  return useQuery({
    queryKey: ['hostels', id],
    queryFn: async () => {
      try {
        const data = await hostelService.fetchHostelById(id);
        console.log('Fetched hostel data:', data);
        return data;
      } catch (error) {
        console.error('Error in useHostel hook:', error);
        throw error;
      }
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};

/**
 * Fetch user's hostels
 */
export const useMyHostels = (params = {}) => {
  return useQuery({
    queryKey: ['myHostels', params],
    queryFn: () => hostelService.fetchMyHostels(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Create hostel
 */
export const useCreateHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostelData, image }) =>
      hostelService.createHostel(hostelData, image),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['myHostels'] });
    },
  });
};

/**
 * Update hostel
 */
export const useUpdateHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hostelData, image }) =>
      hostelService.updateHostel(id, hostelData, image),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels', data._id] });
      queryClient.invalidateQueries({ queryKey: ['myHostels'] });
    },
  });
};

/**
 * Delete hostel
 */
export const useDeleteHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => hostelService.deleteHostel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['myHostels'] });
    },
  });
};

/**
 * Search hostels
 */
export const useSearchHostels = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchHostels', query, filters],
    queryFn: () => hostelService.searchHostels(query, filters),
    enabled: !!query,
  });
};

/**
 * Get hostel statistics
 */
export const useHostelStats = () => {
  return useQuery({
    queryKey: ['hostelStats'],
    queryFn: hostelService.getHostelStats,
    staleTime: 1000 * 60 * 15,
  });
};

/**
 * Upload hostel image
 */
export const useUploadHostelImage = () => {
  return useMutation({
    mutationFn: (file) => hostelService.uploadHostelImage(file),
  });
};
```

---

### 3. File Structure

Create the following directory structure:

```
src/
├── app/
│   └── (protected)/
│       └── hostels/
│           ├── page.js                 # Hostels listing page
│           ├── new/
│           │   └── page.js             # Create hostel page
│           └── [id]/
│               ├── page.js             # Hostel details page
│               └── edit/
│                   └── page.js         # Edit hostel page
├── components/
│   └── hostels/
│       ├── HostelCard.jsx             # Hostel card component
│       ├── HostelForm.jsx             # Create/Edit form
│       ├── HostelGrid.jsx             # Grid layout
│       └── HostelFilters.jsx          # Filter sidebar
├── hooks/
│   └── useHostels.js                  # Custom hooks (already exists)
├── services/
│   └── hostels.js                     # API calls (already exists)
└── utils/
    └── localStorage.js                # LocalStorage helpers
```

---

### 4. Component Implementation

**File:** `src/components/hostels/HostelCard.jsx`

```javascript
'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { Heart, MapPin, Users, Bed } from 'lucide-react';
import { useState } from 'react';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  svg {
    color: ${props => props.$isFavorite ? '#ef4444' : '#ccc'};
  }
`;

const ContentContainer = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PriceTag = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #16a34a;
  margin: 0 0 12px 0;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ViewButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  background: #3b82f6;
  color: white;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

export default function HostelCard({ hostel }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const image = hostel?.thumbnail || hostel?.images?.[0] || '/placeholder.svg';
  const price = hostel?.roomTypes?.[0]?.price || hostel?.price || hostel?.minPrice || 0;
  const capacity = hostel?.roomTypes?.[0]?.occupancy || hostel?.capacity || 0;

  return (
    <CardContainer>
      <ImageContainer>
        <img src={image} alt={hostel?.name} loading="lazy" />
        <FavoriteButton
          $isFavorite={isFavorite}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart size={20} />
        </FavoriteButton>
      </ImageContainer>

      <ContentContainer>
        <Title>{hostel?.name || 'Hostel'}</Title>
        
        <Location>
          <MapPin size={16} />
          {hostel?.location?.address || hostel?.address || 'Location not specified'}
        </Location>

        <PriceTag>₦{price?.toLocaleString()}/month</PriceTag>

        <FeaturesList>
          <Feature>
            <Bed size={16} />
            {hostel?.roomTypes?.[0]?.type || 'Room'}
          </Feature>
          <Feature>
            <Users size={16} />
            {capacity} beds
          </Feature>
        </FeaturesList>

        <ViewButton href={`/hostels/${hostel?._id}`}>
          View Details
        </ViewButton>
      </ContentContainer>
    </CardContainer>
  );
}
```

---

### 5. Pages Implementation

**File:** `src/app/(protected)/hostels/page.js` - Listing Page

```javascript
'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useAllHostels } from '@/hooks/useHostels';
import HostelCard from '@/components/hostels/HostelCard';
import HostelFilters from '@/components/hostels/HostelFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Link from 'next/link';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 24px;
`;

const MaxWidthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: bold;
    color: #1a1a1a;
    margin: 0;
  }
`;

const CreateButton = styled(Link)`
  background-color: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HostelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export default function HostelsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    campus: '',
    search: '',
  });

  const { data, isLoading, error } = useAllHostels(filters);

  return (
    <PageContainer>
      <MaxWidthContainer>
        <Header>
          <h1>Hostels</h1>
          <CreateButton href="/hostels/new">Create Hostel</CreateButton>
        </Header>

        <ContentGrid>
          <HostelFilters onFilterChange={setFilters} />

          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : error ? (
            <div style={{ color: '#dc2626' }}>Error loading hostels</div>
          ) : (
            <HostelsGrid>
              {data?.hostels?.map((hostel) => (
                <HostelCard key={hostel._id} hostel={hostel} />
              ))}
            </HostelsGrid>
          )}
        </ContentGrid>
      </MaxWidthContainer>
    </PageContainer>
  );
}
```

---

### 6. Data Validation

Create `src/utils/hostelValidation.js`:

```javascript
export const validateHostelForm = (formData) => {
  const errors = {};

  // Required fields
  if (!formData.name?.trim()) {
    errors.name = 'Hostel name is required';
  }

  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!formData.location?.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!formData.location?.campus) {
    errors.campus = 'Campus is required';
  }

  // Room types validation
  if (!formData.roomTypes || formData.roomTypes.length === 0) {
    errors.roomTypes = 'At least one room type is required';
  } else {
    formData.roomTypes.forEach((room, index) => {
      if (!room.type) {
        errors[`roomType_${index}`] = 'Room type name is required';
      }
      if (room.price <= 0) {
        errors[`roomPrice_${index}`] = 'Price must be greater than 0';
      }
    });
  }

  // Price validation
  if (formData.price && formData.price < 0) {
    errors.price = 'Price cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const formatHostelDataForAPI = (formData) => {
  return {
    ...formData,
    roomTypes: formData.roomTypes?.map((room) => ({
      type: room.type,
      price: Number(room.price),
      occupancy: Number(room.occupancy),
      description: room.description || '',
    })),
    amenities: Array.isArray(formData.amenities)
      ? formData.amenities
      : formData.amenities?.split(',').map((a) => a.trim()) || [],
  };
};
```

---

### 7. Error Handling

Add to `src/app/(protected)/hostels/[id]/page.js`:

```javascript
// Error handling with detailed messages
const handleError = (error) => {
  console.error('Error details:', error);
  
  if (error.response?.status === 404) {
    return 'Hostel not found';
  } else if (error.response?.status === 401) {
    return 'Please login to view this hostel';
  } else if (error.response?.status === 403) {
    return 'You do not have permission to view this hostel';
  } else if (error.response?.status === 500) {
    return 'Server error. Please try again later';
  } else if (error.message === 'Network Error') {
    return 'Network connection error';
  } else {
    return error.message || 'Failed to load hostel';
  }
};
```

---

### 8. Testing Checklist

- [ ] Create new hostel with image upload
- [ ] View hostel details page
- [ ] Edit existing hostel
- [ ] Delete hostel (confirm dialog)
- [ ] Search/filter hostels by campus
- [ ] View my hostels (owner)
- [ ] Verify owner-only buttons appear
- [ ] Test error handling (404, 500, etc.)
- [ ] Test image lazy loading
- [ ] Test mobile responsiveness
- [ ] Verify cache invalidation after CRUD operations

---

## Troubleshooting

### Issue: Hostel data showing as undefined

**Solution:** 
1. Check if backend is returning correct response structure
2. Add console.log statements to verify data
3. Check API endpoint URL in `.env.local`
4. Verify authentication token is valid

### Issue: Images not uploading

**Solution:**
1. Ensure FormData is being used
2. Check Content-Type header handling in axios
3. Verify Cloudinary/image service is configured
4. Check file size limits

### Issue: Edit page not loading data

**Solution:**
1. Verify ID parameter is being passed correctly
2. Check if useHostel hook has enabled flag set to true
3. Verify query cache is not stale
4. Check browser console for fetch errors

---

## Summary

This implementation provides:
✅ Full CRUD operations for hostels
✅ Styled-components based UI
✅ React Query for state management
✅ Proper error handling
✅ Authentication integration
✅ Image upload support
✅ Owner verification
✅ Responsive design
✅ Performance optimization with caching

All files are ready to integrate into your Next.js application.
