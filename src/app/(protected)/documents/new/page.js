'use client';

import styled from 'styled-components';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateDocument, useDocuments } from '@/hooks/useDocuments';
import { useFaculties, useDepartmentsByFaculty } from '@/hooks/useFaculties';

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 12px;

  @media (min-width: 480px) {
    padding: 16px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

const BackButton = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }

  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 280px;
    gap: 24px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 480px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const CardIcon = styled.div`
  font-size: 28px;
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;

  @media (min-width: 480px) {
    font-size: 18px;
  }

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const CardDescription = styled.p`
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.9;

  @media (min-width: 480px) {
    font-size: 13px;
  }
`;

const FormSection = styled.div`
  padding: 16px;

  @media (min-width: 480px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 480px) {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 480px) {
    font-size: 13px;
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  background: white;
  transition: all 0.2s ease;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 480px) {
    padding: 14px 16px;
    font-size: 15px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  option {
    color: #333;
    background: white;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 480px) {
    padding: 14px 16px;
    font-size: 15px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  background: white;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 480px) {
    padding: 14px 16px;
    font-size: 15px;
    min-height: 120px;
  }
`;

const UploadDropZone = styled.div`
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;

  &:hover {
    border-color: #1a1a1a;
    background: #f5f5f5;
  }

  &.active {
    border-color: #1a1a1a;
    background: #f0f0f0;
  }

  @media (min-width: 480px) {
    padding: 32px;
  }
`;

const UploadIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;

  @media (min-width: 480px) {
    font-size: 48px;
    margin-bottom: 16px;
  }
`;

const UploadText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;

  @media (min-width: 480px) {
    font-size: 15px;
  }
`;

const UploadSubText = styled.p`
  margin: 6px 0 0 0;
  font-size: 12px;
  color: #666;

  @media (min-width: 480px) {
    font-size: 13px;
  }
`;

const FileInputHidden = styled.input`
  display: none;
`;

const SelectedFile = styled.div`
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 480px) {
    padding: 14px;
    margin-top: 14px;
  }
`;

const FileIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  word-break: break-word;

  @media (min-width: 480px) {
    font-size: 13px;
  }
`;

const FileSize = styled.p`
  margin: 4px 0 0 0;
  font-size: 11px;
  color: #999;

  @media (min-width: 480px) {
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px;

  @media (min-width: 480px) {
    gap: 14px;
    padding: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Button = styled.button`
  padding: 14px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 480px) {
    font-size: 14px;
    padding: 16px 18px;
  }
`;

const PrimaryButton = styled(Button)`
  background: #1a1a1a;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  grid-column: span 2;

  &:hover:not(:disabled) {
    background: #0d0d0d;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  @media (min-width: 1024px) {
    grid-column: span 1;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f0f0f0;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }
`;

const Sidebar = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  @media (min-width: 480px) {
    padding: 14px;
  }

  @media (min-width: 768px) {
    grid-column: span 1;
  }
`;

const InfoTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 11px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 480px) {
    font-size: 12px;
  }
`;

const InfoContent = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;

  @media (min-width: 480px) {
    font-size: 13px;
  }
`;

const InfoBadge = styled.span`
  display: inline-block;
  background: #f0f0f0;
  color: #1a1a1a;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-top: 6px;

  @media (min-width: 480px) {
    font-size: 12px;
    padding: 5px 10px;
  }
`;

const ProgressContainer = styled.div`
  padding: 16px;

  @media (min-width: 480px) {
    padding: 20px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1a1a1a, #0d0d0d);
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  text-align: center;

  @media (min-width: 480px) {
    font-size: 13px;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  border: 1px solid #ffcdd2;
  color: #d32f2f;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  margin-bottom: 12px;

  @media (min-width: 480px) {
    padding: 14px;
    font-size: 13px;
  }
`;

const SuccessMessage = styled.div`
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  margin-bottom: 12px;

  @media (min-width: 480px) {
    padding: 14px;
    font-size: 13px;
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 480px) {
    gap: 14px;
  }

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const getFileIcon = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase() || 'pdf';
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '🎯',
    pptx: '🎯',
    txt: '📄',
    zip: '🗜️',
  };
  return icons[ext] || '📎';
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default function DocumentUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    faculty: '',
    department: '',
    courseCode: '',
    academicLevel: '',
    category: '',
    visibility: 'department',
    allowComments: true,
  });

  const { data: faculties = [] } = useFaculties();
  const { data: departments = [] } = useDepartmentsByFaculty(formData.faculty);
  const { mutate: createDocument, isPending } = useCreateDocument();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a document title');
      return;
    }

    if (!formData.faculty) {
      setError('Please select a faculty');
      return;
    }

    const data = new FormData();
    data.append('file', selectedFile);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('faculty', formData.faculty);
    data.append('department', formData.department);
    data.append('courseCode', formData.courseCode);
    data.append('academicLevel', formData.academicLevel);
    data.append('category', formData.category);
    data.append('visibility', formData.visibility);
    data.append('allowComments', formData.allowComments);

    createDocument(data, {
      onSuccess: () => {
        setSuccess('Document uploaded successfully!');
        setTimeout(() => router.push('/documents'), 1500);
      },
      onError: (error) => {
        setError(error?.response?.data?.message || 'Upload failed. Please try again.');
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <PageWrapper>
      <PageContainer>
        <Header>
          <BackButton onClick={handleCancel}>← Back</BackButton>
          <HeaderTitle>Upload Document</HeaderTitle>
        </Header>

        <MainGrid>
          <ContentWrapper>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {/* File Upload Card */}
            <Card>
              <CardHeader>
                <CardIcon>📤</CardIcon>
                <div>
                  <CardTitle>Upload File</CardTitle>
                  <CardDescription>Select or drag your document</CardDescription>
                </div>
              </CardHeader>

              <FormSection>
                <UploadDropZone
                  className={dragActive ? 'active' : ''}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon>📁</UploadIcon>
                  <UploadText>Click to browse or drag & drop</UploadText>
                  <UploadSubText>Supported: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX</UploadSubText>
                </UploadDropZone>

                <FileInputHidden
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                />

                {selectedFile && (
                  <SelectedFile>
                    <FileIcon>{getFileIcon(selectedFile.name)}</FileIcon>
                    <FileInfo>
                      <FileName>{selectedFile.name}</FileName>
                      <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
                    </FileInfo>
                  </SelectedFile>
                )}
              </FormSection>
            </Card>

            {/* Document Details Card */}
            <Card>
              <CardHeader>
                <CardIcon>📝</CardIcon>
                <div>
                  <CardTitle>Document Details</CardTitle>
                  <CardDescription>Provide information about your document</CardDescription>
                </div>
              </CardHeader>

              <FormSection>
                <SectionTitle>Basic Information</SectionTitle>
                <FormGroup>
                  <Label>Document Title *</Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Enter document title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isPending}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    name="description"
                    placeholder="Describe your document..."
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isPending}
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Academic Information</SectionTitle>
                <FormGroup>
                  <Label>Faculty *</Label>
                  <Select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleInputChange}
                    disabled={isPending}
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map(f => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Department</Label>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={isPending || !formData.faculty}
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <GridRow>
                  <FormGroup>
                    <Label>Course Code</Label>
                    <Input
                      type="text"
                      name="courseCode"
                      placeholder="e.g., CS101"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      disabled={isPending}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Academic Level</Label>
                    <Select
                      name="academicLevel"
                      value={formData.academicLevel}
                      onChange={handleInputChange}
                      disabled={isPending}
                    >
                      <option value="">Select Level</option>
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="500">500 Level</option>
                    </Select>
                  </FormGroup>
                </GridRow>

                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isPending}
                  >
                    <option value="">Select Category</option>
                    <option value="lecture">Lecture Notes</option>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam Questions</option>
                    <option value="project">Project</option>
                    <option value="book">Book</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Sharing Settings</SectionTitle>
                <FormGroup>
                  <Label>Visibility</Label>
                  <Select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    disabled={isPending}
                  >
                    <option value="public">Public</option>
                    <option value="faculty">Faculty Only</option>
                    <option value="department">Department Only</option>
                    <option value="private">Private</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '0' }}>
                    <input
                      type="checkbox"
                      name="allowComments"
                      checked={formData.allowComments}
                      onChange={handleInputChange}
                      disabled={isPending}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    Allow comments on this document
                  </Label>
                </FormGroup>
              </FormSection>

              <ButtonGroup>
                <SecondaryButton onClick={handleCancel} disabled={isPending}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={isPending || !selectedFile || !formData.title.trim()}>
                  {isPending ? '⏳ Uploading...' : '✓ Upload Document'}
                </PrimaryButton>
              </ButtonGroup>
            </Card>
          </ContentWrapper>

          {/* Sidebar */}
          <Sidebar>
            <InfoBox>
              <InfoTitle>📏 File Requirements</InfoTitle>
              <InfoContent>Max size: 50 MB</InfoContent>
              <InfoBadge>PDF, DOC, DOCX</InfoBadge>
            </InfoBox>

            <InfoBox>
              <InfoTitle>🔒 Privacy</InfoTitle>
              <InfoContent>Control who can see your document</InfoContent>
              <InfoBadge>Customizable</InfoBadge>
            </InfoBox>

            <InfoBox>
              <InfoTitle>💬 Comments</InfoTitle>
              <InfoContent>Allow others to discuss</InfoContent>
              <InfoBadge>Optional</InfoBadge>
            </InfoBox>

            <InfoBox>
              <InfoTitle>⭐ Ratings</InfoTitle>
              <InfoContent>Get feedback from community</InfoContent>
              <InfoBadge>Enabled</InfoBadge>
            </InfoBox>
          </Sidebar>
        </MainGrid>
      </PageContainer>
    </PageWrapper>
  );
}