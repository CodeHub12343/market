'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useRoommateCategories } from '@/hooks/useCategories'
import { Upload, X } from 'lucide-react'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`

const ImageUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const UploadBox = styled.label`
  padding: 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;

  &:hover {
    border-color: #1a1a1a;
    background: #f5f5f5;
  }

  input {
    display: none;
  }
`

const UploadText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  svg {
    width: 24px;
    height: 24px;
    color: #666;
  }

  .main {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .sub {
    font-size: 12px;
    color: #999;
  }
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
`

const ImageThumb = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const RemoveImageBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  svg {
    width: 14px;
    height: 14px;
    color: white;
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    flex: 1;
    margin: 0;
    font-weight: 500;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.$primary ? `
    background: #1a1a1a;
    color: white;

    &:hover {
      background: #333;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  ` : `
    background: white;
    color: #1a1a1a;
    border: 1px solid #e0e0e0;

    &:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }
  `}
`

export function RoommateForm({ initialData, onSubmit, isLoading }) {
  const { data: categories = [], isLoading: categoriesLoading } = useRoommateCategories();
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    location: '',
    category: '',
    roomType: 'shared',
    roommates: 1,
    rentPrice: '',
    deposit: '',
    phoneNumber: '',
    whatsapp: '',
    amenities: [],
    images: [],
    isAvailable: true,
    leaseType: 'flexible'
  })

  const [imagePreviews, setImagePreviews] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    if (name === 'isAvailable') {
      setFormData(prev => ({
        ...prev,
        isAvailable: checked
      }))
    }
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    
    setImagePreviews(prev => [...prev, ...newPreviews])
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...files]
    }))
  }

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()

    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData.images.forEach(image => {
          if (image instanceof File) {
            data.append('images', image)
          }
        })
      } else if (key === 'amenities') {
        data.append('amenities', JSON.stringify(formData.amenities))
      } else {
        data.append(key, formData[key])
      }
    })

    await onSubmit(data)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* Basic Information */}
      <FormSection>
        <SectionTitle>Basic Information</SectionTitle>
        <FormGroup>
          <Label>Title</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Spacious 3-Bedroom Apartment Near Campus"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your roommate listing in detail..."
            required
          />
        </FormGroup>

        <Row>
          <FormGroup>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Lekki, Lagos"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Room Type</Label>
            <Select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
            >
              <option value="shared">Shared Room</option>
              <option value="private">Private Room</option>
              <option value="studio">Studio</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Category</Label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={categoriesLoading}
              required
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </option>
              {Array.isArray(categories) && categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FormGroup>
        </Row>
      </FormSection>

      {/* Pricing & Details */}
      <FormSection>
        <SectionTitle>Pricing & Details</SectionTitle>
        <Row>
          <FormGroup>
            <Label>Monthly Rent (₦)</Label>
            <Input
              type="number"
              name="rentPrice"
              value={formData.rentPrice}
              onChange={handleInputChange}
              placeholder="e.g., 50000"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Deposit (₦)</Label>
            <Input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleInputChange}
              placeholder="e.g., 50000"
            />
          </FormGroup>
          <FormGroup>
            <Label>Number of Roommates</Label>
            <Input
              type="number"
              name="roommates"
              value={formData.roommates}
              onChange={handleInputChange}
              min="1"
              required
            />
          </FormGroup>
        </Row>

        <FormGroup>
          <Label>Lease Type</Label>
          <Select
            name="leaseType"
            value={formData.leaseType}
            onChange={handleInputChange}
          >
            <option value="flexible">Flexible</option>
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
          </Select>
        </FormGroup>
      </FormSection>

      {/* Contact Information */}
      <FormSection>
        <SectionTitle>Contact Information</SectionTitle>
        <Row>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="e.g., +234 701 234 5678"
            />
          </FormGroup>
          <FormGroup>
            <Label>WhatsApp Number (Optional)</Label>
            <Input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="e.g., +234 701 234 5678"
            />
          </FormGroup>
        </Row>
      </FormSection>

      {/* Amenities */}
      <FormSection>
        <SectionTitle>Amenities</SectionTitle>
        <Row>
          {['WiFi', 'Kitchen', 'Bathroom', 'Parking', 'AC', 'Water', 'Generator'].map(amenity => (
            <CheckboxGroup key={amenity}>
              <input
                type="checkbox"
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
              />
              <label htmlFor={amenity}>{amenity}</label>
            </CheckboxGroup>
          ))}
        </Row>
      </FormSection>

      {/* Images */}
      <FormSection>
        <SectionTitle>Images</SectionTitle>
        <ImageUploadArea>
          <UploadBox>
            <UploadText>
              <Upload />
              <div className="main">Click to upload or drag and drop</div>
              <div className="sub">PNG, JPG, GIF up to 10MB</div>
            </UploadText>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </UploadBox>

          {imagePreviews.length > 0 && (
            <div>
              <Label>Uploaded Images</Label>
              <ImageGrid>
                {imagePreviews.map((preview, index) => (
                  <ImageThumb key={index}>
                    <img src={preview} alt={`Preview ${index}`} />
                    <RemoveImageBtn
                      type="button"
                      onClick={() => removeImage(index)}
                    >
                      <X />
                    </RemoveImageBtn>
                  </ImageThumb>
                ))}
              </ImageGrid>
            </div>
          )}
        </ImageUploadArea>
      </FormSection>

      {/* Availability */}
      <FormSection>
        <CheckboxGroup>
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isAvailable">This listing is currently available</label>
        </CheckboxGroup>
      </FormSection>

      {/* Buttons */}
      <ButtonGroup>
        <Button type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" $primary disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Listing'}
        </Button>
      </ButtonGroup>
    </Form>
  )
}
