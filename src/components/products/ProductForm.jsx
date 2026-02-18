'use client';

import { useProductForm } from '@/hooks/useProductForm';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useMyShop } from '@/hooks/useShops';
import { useProductCategories } from '@/hooks/useCategories';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import { Upload, X, Plus } from 'lucide-react';
import styled from 'styled-components';

/* ============ FORM CONTAINER ============ */
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

/* ============ SECTION STYLING ============ */
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 20px;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
    gap: 24px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;

const SectionIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 6px;
  color: #1a1a1a;
  font-weight: 600;

  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

/* ============ FORM GROUP ============ */
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormGroupDouble = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

/* ============ LABELS & INPUTS ============ */
const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 4px;

  @media (min-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const RequiredAsterisk = styled.span`
  color: #e53935;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: #f9f9f9;
  border: 1px solid ${(props) => (props.$error ? '#e53935' : '#e5e5e5')};
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.2s ease;
  font-family: inherit;

  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 14px;
  }

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
  }

  &:disabled {
    background: #f0f0f0;
    cursor: not-allowed;
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  background: #f9f9f9;
  border: 1px solid ${(props) => (props.$error ? '#e53935' : '#e5e5e5')};
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;

  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 14px;
    min-height: 120px;
  }

  @media (min-width: 1024px) {
    min-height: 140px;
  }

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
  }

  &:disabled {
    background: #f0f0f0;
    cursor: not-allowed;
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  background: #f9f9f9;
  border: 1px solid ${(props) => (props.$error ? '#e53935' : '#e5e5e5')};
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.2s ease;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1a1a' d='M1 4l5 4 5-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

  @media (min-width: 768px) {
    padding: 13px 16px;
    padding-right: 38px;
    font-size: 14px;
  }

  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
  }

  option {
    background: #ffffff;
    color: #1a1a1a;
  }
`;

/* ============ ERROR & HELP TEXT ============ */
const ErrorMessage = styled.span`
  font-size: 12px;
  color: #e53935;
  display: flex;
  align-items: center;
  gap: 4px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

/* ============ IMAGE UPLOAD ============ */
const ImageUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ImageUploadArea = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  padding: 20px 16px;
  border: 2px dashed ${(props) => (props.$error ? '#e53935' : '#e5e5e5')};
  border-radius: 12px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    padding: 24px 20px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    padding: 28px 24px;
    gap: 16px;
  }

  &:hover {
    border-color: #1a1a1a;
    background: #ffffff;
  }

  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 8px;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const UploadText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const UploadTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const UploadSubtitle = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ImagePreviewCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:hover button {
    opacity: 1;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(229, 57, 53, 0.9);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  color: white;

  @media (max-width: 767px) {
    opacity: 1;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #e53935;
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }
`;

/* ============ TAGS ============ */
const TagsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TagInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.2s ease;
  font-family: inherit;

  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 14px;
  }

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f0f0;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 13px;
  color: #1a1a1a;

  @media (min-width: 768px) {
    padding: 8px 14px;
    font-size: 14px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    transition: color 0.2s ease;

    &:hover {
      color: #e53935;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const AddTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 14px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 14px;
  }

  &:hover {
    background: #f0f0f0;
    border-color: #1a1a1a;
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ============ ACTION BUTTONS ============ */
const ActionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #ffffff;

  @media (min-width: 768px) {
    padding: 20px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    border-top: none;
    padding-top: 0;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    padding: 16px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    flex: 1;
    padding: 16px;
    font-size: 15px;
  }

  &:hover:not(:disabled) {
    background: #333333;
    box-shadow: 0 4px 12px rgba(26, 26, 26, 0.15);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background: #d0d0d0;
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: #f5f5f5;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    padding: 16px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    flex: 1;
    padding: 16px;
    font-size: 15px;
  }

  &:hover {
    background: #e5e5e5;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function ProductForm({ product = null, isEditing = false }) {
  const router = useRouter();
  const { user } = useAuth(); // Get current user
  const { data: myShop, isLoading: shopLoading, isError: shopError } = useMyShop(); // Fetch user's shop
  const { data: categories, isLoading: categoriesLoading } = useProductCategories(); // Fetch product categories
  const {
    formData,
    errors,
    previewImages,
    handleChange,
    handleImageChange,
    removeImage,
    addTag,
    removeTag,
    setFormErrors,
    setFormData, // Import setFormData to update shop field
  } = useProductForm(product);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const [tagInput, setTagInput] = useState('');
  const shopSetRef = useRef(false);

  // Debug: Log shop loading state
  console.log('ProductForm - myShop:', myShop, 'shopLoading:', shopLoading, 'shopError:', shopError);

  // Auto-fill shop field when shop data is loaded
  useEffect(() => {
    if (myShop?._id && !shopSetRef.current) {
      console.log('Setting shop to:', myShop._id);
      setFormData((prev) => ({
        ...prev,
        shop: myShop._id,
      }));
      shopSetRef.current = true;
    } else if (myShop === null && !shopSetRef.current) {
      console.log('User has no shop (returned null)');
      shopSetRef.current = true;
    }
  }, [myShop, setFormData]);

  // Clean up images when editing - remove string URLs, keep only File objects
  useEffect(() => {
    if (isEditing && product?.images) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img instanceof File),
      }));
    }
  }, [isEditing, product?.images, setFormData]);

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.shop) newErrors.shop = 'Shop is required to create a product';
    if (!isEditing && formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditing) {
        // Only send editable fields, exclude backend-generated and read-only fields
        const productDataToSend = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          condition: formData.condition,
          location: formData.location,
          quantity: formData.quantity,
          tags: formData.tags,
          shop: formData.shop,
        };
        
        // Filter images: only include File objects
        const filteredImages = formData.images.filter(
          (img) => img instanceof File && img.size > 0
        );
        
        await updateMutation.mutateAsync({
          id: product._id,
          productData: productDataToSend,
          images: filteredImages,
        });
      } else {
        // For new products, only send the editable fields
        const productDataToSend = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          condition: formData.condition,
          location: formData.location,
          quantity: formData.quantity,
          tags: formData.tags,
          shop: formData.shop,
        };
        
        // Filter to only send File objects
        const filteredImages = formData.images.filter((img) => img instanceof File);
        
        const result = await createMutation.mutateAsync({
          productData: productDataToSend,
          images: filteredImages,
        });

        // Store creator info in localStorage for ownership verification
        // This is temporary until backend populates shop/createdBy field
        if (result?._id) {
          const creatorInfo = {
            productId: result._id,
            createdAt: new Date().toISOString(),
          };
          const myCreatedProducts = JSON.parse(localStorage.getItem('myCreatedProducts') || '{}');
          myCreatedProducts[result._id] = creatorInfo;
          localStorage.setItem('myCreatedProducts', JSON.stringify(myCreatedProducts));
        }
      }

      router.push('/products');
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput);
      setTagInput('');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && (
        <ErrorAlert
          message={error.message || 'An error occurred'}
          onClose={() => {}}
        />
      )}

      {/* ===== SECTION 1: BASIC INFO ===== */}
      <FormSection>
        <SectionTitle>
          <SectionIcon>1</SectionIcon>
          Basic Information
        </SectionTitle>

        {/* Product Name */}
        <FormGroup>
          <Label>
            Product Name
            <RequiredAsterisk>*</RequiredAsterisk>
          </Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Physics Textbook"
            $error={!!errors.name}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        {/* Description */}
        <FormGroup>
          <Label>
            Description
            <RequiredAsterisk>*</RequiredAsterisk>
          </Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed description of your product. Include condition, any defects, features, etc."
            $error={!!errors.description}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          <HelpText>{formData.description.length}/500 characters</HelpText>
        </FormGroup>
      </FormSection>

      {/* ===== SECTION 2: PRICING & DETAILS ===== */}
      <FormSection>
        <SectionTitle>
          <SectionIcon>2</SectionIcon>
          Pricing & Details
        </SectionTitle>

        {/* Price and Quantity */}
        <FormGroupDouble>
          <FormGroup>
            <Label>
              Price
              <RequiredAsterisk>*</RequiredAsterisk>
            </Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
              $error={!!errors.price}
            />
            {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              placeholder="1"
            />
          </FormGroup>
        </FormGroupDouble>

        {/* Category and Condition */}
        <FormGroupDouble>
          <FormGroup>
            <Label>
              Category
              <RequiredAsterisk>*</RequiredAsterisk>
            </Label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              $error={!!errors.category}
              disabled={categoriesLoading}
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
            {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
            {categoriesLoading && <HelpText>Loading categories...</HelpText>}
          </FormGroup>

          <FormGroup>
            <Label>Condition</Label>
            <Select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="new">New - Unused</option>
              <option value="like-new">Like New - Almost unused</option>
              <option value="good">Good - Lightly used</option>
              <option value="fair">Fair - Visibly used</option>
            </Select>
          </FormGroup>
        </FormGroupDouble>

        {/* Location */}
        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., South Campus, Engineering Block"
          />
        </FormGroup>

        {/* Shop (Hidden or Read-only) */}
        {formData.shop && myShop && (
          <FormGroup>
            <Label>
              Shop
              <RequiredAsterisk>*</RequiredAsterisk>
            </Label>
            <div style={{
              padding: '12px 14px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              color: '#1a1a1a',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #e5e5e5'
            }}>
              {myShop?.name || 'Your Shop'}
              <input
                type="hidden"
                name="shop"
                value={formData.shop}
              />
            </div>
            <HelpText>This product will be listed under your shop</HelpText>
          </FormGroup>
        )}
        {!formData.shop && !shopLoading && (
          <FormGroup>
            <Label style={{ color: '#e53935' }}>
              ⚠️ No Shop Found
              <RequiredAsterisk>*</RequiredAsterisk>
            </Label>
            <div style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '14px',
              border: '1px solid #fecaca',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>You need to create a shop before you can list products</div>
              <button
                type="button"
                onClick={() => router.push('/shops/new')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  alignSelf: 'flex-start'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1a1a1a';
                }}
              >
                Create Shop Now →
              </button>
            </div>
            <HelpText style={{ color: '#b91c1c' }}>
              You&apos;ll be able to list products once your shop is created
            </HelpText>
          </FormGroup>
        )}
      </FormSection>

      {/* ===== SECTION 3: IMAGES ===== */}
      <FormSection>
        <SectionTitle>
          <SectionIcon>3</SectionIcon>
          Product Images
        </SectionTitle>

        <ImageUploadWrapper>
          <ImageUploadArea $error={!!errors.images}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <UploadIcon>
              <Upload />
            </UploadIcon>
            <UploadText>
              <UploadTitle>Upload images</UploadTitle>
              <UploadSubtitle>PNG, JPG up to 5MB each</UploadSubtitle>
            </UploadText>
          </ImageUploadArea>

          {errors.images && (
            <ErrorMessage style={{ marginTop: '8px' }}>
              {errors.images}
            </ErrorMessage>
          )}

          {previewImages.length > 0 && (
            <>
              <HelpText style={{ marginTop: '4px' }}>
                {previewImages.length} image{previewImages.length !== 1 ? 's' : ''} uploaded
              </HelpText>
              <ImagePreviewGrid>
                {previewImages.map((preview, index) => (
                  <ImagePreviewCard key={index}>
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <RemoveImageButton
                      type="button"
                      onClick={() => removeImage(index)}
                      title="Remove image"
                    >
                      <X />
                    </RemoveImageButton>
                  </ImagePreviewCard>
                ))}
              </ImagePreviewGrid>
            </>
          )}
        </ImageUploadWrapper>
      </FormSection>

      {/* ===== SECTION 4: TAGS ===== */}
      <FormSection>
        <SectionTitle>
          <SectionIcon>4</SectionIcon>
          Tags (Optional)
        </SectionTitle>

        <TagsWrapper>
          <TagInput
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="e.g., 'second hand', 'barely used'"
          />

          <AddTagButton type="button" onClick={handleAddTag}>
            <Plus />
            Add Tag
          </AddTagButton>

          {formData.tags.length > 0 && (
            <TagsList>
              {formData.tags.map((tag) => (
                <Tag key={tag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    title="Remove tag"
                  >
                    <X />
                  </button>
                </Tag>
              ))}
            </TagsList>
          )}

          <HelpText>
            Tags help buyers find your product. Add up to 5 relevant tags.
          </HelpText>
        </TagsWrapper>
      </FormSection>

      {/* ===== ACTION BUTTONS ===== */}
      <ActionButtonsWrapper>
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="sm" /> : null}
          {isLoading
            ? 'Processing...'
            : isEditing
            ? 'Update Product'
            : 'Publish Product'}
        </SubmitButton>
        <CancelButton
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </CancelButton>
      </ActionButtonsWrapper>
    </FormContainer>
  );
}