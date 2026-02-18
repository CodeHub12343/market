'use client';

import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useCreateDocument } from '@/hooks/useDocuments';
import { useFaculties, useDepartmentsByFaculty } from '@/hooks/useFaculties';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

const UploadContainer = styled.div`
  background: #1a1a1a;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  color: white;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 60px 40px;
    min-height: 240px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    background: #0d0d0d;
    transform: scale(1.02);
  }

  &.active {
    border-color: rgba(255, 255, 255, 0.8);
    background: #0d0d0d;
    transform: scale(1.02);
  }
`;

const UploadIcon = styled.div`
  font-size: 56px;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 64px;
  }
`;

const UploadText = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const UploadSubtext = styled.p`
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

const HiddenInput = styled.input`
  display: none;
`;

const SelectedFileContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 2px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (min-width: 768px) {
    padding: 16px 20px;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const FileSize = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const FileIcon = styled.div`
  font-size: 28px;
  flex-shrink: 0;
`;

const RemoveButton = styled.button`
  background: #f5f5f5;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  color: #d32f2f;
  font-weight: 700;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #ffe0e0;
    border-color: #d32f2f;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    padding: 24px;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-column: ${(props) => (props.fullWidth ? '1 / -1' : 'auto')};
    gap: 20px;
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 700;
    color: #333;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Required = styled.span`
  color: #d32f2f;
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
  background: white;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    background: #f8f7ff;
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  background: white;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    background: #f8f7ff;
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  color: #333;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    background: #f8f7ff;
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }

  option {
    color: #333;
    background: white;
    padding: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;

  @media (min-width: 1024px) {
    grid-column: 1 / -1;
    gap: 16px;
  }
`;

const Button = styled.button`
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background: #1a1a1a;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }
`;

const MessageBox = styled.div`
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    grid-column: ${(props) => (props.fullWidth ? '1 / -1' : 'auto')};
  }
`;

const ErrorMessage = styled(MessageBox)`
  background: #ffebee;
  color: #d32f2f;
  border-left: 4px solid #d32f2f;
`;

const SuccessMessage = styled(MessageBox)`
  background: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #2e7d32;
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
  margin-top: 4px;
`;

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase();
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

export default function DocumentUpload({ onSuccess, onCancel }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    faculty: '',
    department: '',
    course: '',
    academicLevel: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: faculties = [], isLoading: loadingFaculties } = useFaculties();
  const { data: departments = [], isLoading: loadingDepartments } = useDepartmentsByFaculty(
    formData.faculty
  );

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
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles[0]) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setError('');
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('❌ File size exceeds 50MB limit');
      return;
    }
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/zip',
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('❌ File type not allowed. Please upload PDF, DOC, XLS, PPT, or TXT');
      return;
    }
    setFile(selectedFile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('❌ Please select a file');
      return;
    }

    if (!formData.title.trim()) {
      setError('❌ Title is required');
      return;
    }

    if (!formData.faculty.trim()) {
      setError('❌ Faculty is required');
      return;
    }

    if (!formData.department.trim()) {
      setError('❌ Department is required');
      return;
    }

    if (!formData.academicLevel) {
      setError('❌ Academic level is required');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('category', formData.category);
    uploadFormData.append('faculty', formData.faculty);
    uploadFormData.append('department', formData.department);
    uploadFormData.append('courseCode', formData.course);
    uploadFormData.append('academicLevel', formData.academicLevel);

    createDocument(uploadFormData, {
      onSuccess: () => {
        setSuccess('✅ Document uploaded successfully!');
        setFile(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          faculty: '',
          department: '',
          course: '',
          academicLevel: '',
        });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      },
      onError: (err) => {
        setError(`❌ ${err.message || 'Failed to upload document'}`);
      },
    });
  };

  return (
    <PageWrapper as="form" onSubmit={handleSubmit}>
      <UploadContainer
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={dragActive ? 'active' : ''}
        onClick={() => fileInputRef.current?.click()}
      >
        <HiddenInput
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFile(e.target.files?.[0])}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
        />
        <UploadIcon>📤</UploadIcon>
        <UploadText>Drag file here or click to select</UploadText>
        <UploadSubtext>Maximum 50MB • Supported: PDF, DOC, XLS, PPT, TXT, ZIP</UploadSubtext>
      </UploadContainer>

      {file && (
        <SelectedFileContainer>
          <FileIcon>{getFileIcon(file.name)}</FileIcon>
          <FileInfo>
            <FileName title={file.name}>{file.name}</FileName>
            <FileSize>{formatFileSize(file.size)}</FileSize>
          </FileInfo>
          <RemoveButton type="button" onClick={() => setFile(null)}>
            Remove
          </RemoveButton>
        </SelectedFileContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormContainer>
        <FormSection fullWidth>
          <h3>📋 Document Details</h3>
          <FormGroup>
            <Label htmlFor="title">
              Title <Required>*</Required>
            </Label>
            <Input
              id="title"
              type="text"
              name="title"
              placeholder="e.g., Algorithms Lecture Notes - Week 3"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isPending}
              required
            />
            <HelpText>Be descriptive to help others find your document</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              placeholder="Add more context about this document (optional)"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isPending}
            />
          </FormGroup>
        </FormSection>

        <FormSection fullWidth>
          <h3>🎓 Academic Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormGroup>
              <Label htmlFor="faculty">
                Faculty <Required>*</Required>
              </Label>
              <Select
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                disabled={isPending || loadingFaculties}
                required
              >
                <option value="">Select Faculty</option>
                {faculties.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="department">
                Department <Required>*</Required>
              </Label>
              <Select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!formData.faculty || isPending || loadingDepartments}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormGroup>
              <Label htmlFor="course">Course Code</Label>
              <Input
                id="course"
                type="text"
                name="course"
                placeholder="e.g., CS 101"
                value={formData.course}
                onChange={handleInputChange}
                disabled={isPending}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="academicLevel">
                Academic Level <Required>*</Required>
              </Label>
              <Select
                id="academicLevel"
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleInputChange}
                disabled={isPending}
                required
              >
                <option value="">Select Level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
                <option value="postgraduate">Postgraduate</option>
              </Select>
            </FormGroup>
          </div>
        </FormSection>

        <FormSection fullWidth>
          <h3>🏷️ Document Type</h3>

          <FormGroup>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={isPending}
            >
              <option value="">Select Category (optional)</option>
              <option value="note">Lecture Notes</option>
              <option value="assignment">Assignment</option>
              <option value="past-question">Past Questions</option>
              <option value="project">Project</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>
        </FormSection>

        <ButtonGroup>
          <SubmitButton type="submit" disabled={isPending}>
            {isPending ? '⏳ Uploading...' : '📤 Upload Document'}
          </SubmitButton>
          <CancelButton type="button" onClick={onCancel} disabled={isPending}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </FormContainer>
    </PageWrapper>
  );
}
