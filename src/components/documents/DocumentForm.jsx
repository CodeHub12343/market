'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import DocumentUpload from './DocumentUpload';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useCreateDocument, useUpdateDocument } from '@/hooks/useDocuments';
import { useFaculties } from '@/hooks/useFaculties';
import { useDepartments } from '@/hooks/useDepartments';

const FormContainer = styled.form`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #5568d3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const FileSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
`;

export default function DocumentForm({ document, onSuccess }) {
  const [formData, setFormData] = useState({
    title: document?.title || '',
    description: document?.description || '',
    category: document?.category || '',
    faculty: document?.faculty?._id || '',
    department: document?.department?._id || '',
    courseCode: document?.courseCode || '',
    semester: document?.semester || '',
    academicLevel: document?.academicLevel || '',
    difficulty: document?.difficulty || '',
    visibility: document?.visibility || 'private',
    tags: document?.tags?.join(',') || '',
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const { mutate: createDoc, isPending: isCreating, error: createError } = useCreateDocument();
  const { mutate: updateDoc, isPending: isUpdating, error: updateError } = useUpdateDocument();
  const { data: faculties = [] } = useFaculties();
  const { data: departments = [] } = useDepartments(formData.faculty);

  const isPending = isCreating || isUpdating;
  const error = createError || updateError;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    if (!document && !file) {
      setErrors({ file: 'File is required for new documents' });
      return;
    }

    const form = new FormData();
    
    // Add file if creating or updating with new file
    if (file) {
      form.append('file', file);
    }

    // Add fields
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    if (document) {
      // Update
      updateDoc(
        { id: document._id, updates: formData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      // Create
      createDoc(form, {
        onSuccess: () => {
          setFormData({
            title: '',
            description: '',
            category: '',
            faculty: '',
            department: '',
            courseCode: '',
            semester: '',
            academicLevel: '',
            difficulty: '',
            visibility: 'private',
            tags: '',
          });
          setFile(null);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <ErrorAlert message={error.message} />}

      <FormGroup>
        <Label>Document Title *</Label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Introduction to Algorithms"
        />
        {errors.title && <ErrorAlert message={errors.title} />}
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this document is about..."
        />
      </FormGroup>

      <Row>
        <FormGroup>
          <Label>Faculty</Label>
          <Select name="faculty" value={formData.faculty} onChange={handleChange}>
            <option value="">-- Select Faculty --</option>
            {faculties.map(f => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Department</Label>
          <Select name="department" value={formData.department} onChange={handleChange}>
            <option value="">-- Select Department --</option>
            {departments.map(d => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </Select>
        </FormGroup>
      </Row>

      <Row>
        <FormGroup>
          <Label>Course Code</Label>
          <Input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="e.g., CS101"
          />
        </FormGroup>

        <FormGroup>
          <Label>Semester</Label>
          <Select name="semester" value={formData.semester} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </Select>
        </FormGroup>
      </Row>

      <Row>
        <FormGroup>
          <Label>Academic Level</Label>
          <Select name="academicLevel" value={formData.academicLevel} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Difficulty</Label>
          <Select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </FormGroup>
      </Row>

      <Row>
        <FormGroup>
          <Label>Category</Label>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Lecture Notes"
          />
        </FormGroup>

        <FormGroup>
          <Label>Visibility</Label>
          <Select name="visibility" value={formData.visibility} onChange={handleChange}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </Select>
        </FormGroup>
      </Row>

      <FormGroup>
        <Label>Tags (comma separated)</Label>
        <Input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., algorithms, data-structures"
        />
      </FormGroup>

      {!document && (
        <FileSection>
          <FormGroup>
            <Label>Upload Document *</Label>
            <DocumentUpload onFileSelect={handleFileSelect} />
            {errors.file && <ErrorAlert message={errors.file} />}
          </FormGroup>
        </FileSection>
      )}

      <FormGroup>
        <SubmitButton disabled={isPending} type="submit">
          {isPending ? (
            <>
              <LoadingSpinner /> {document ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            document ? 'Update Document' : 'Create Document'
          )}
        </SubmitButton>
      </FormGroup>
    </FormContainer>
  );
}