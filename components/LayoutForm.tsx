'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFlowStore } from '@/store/useFlowStore';
import styled from 'styled-components';
import { THEME_COLORS } from '@/lib/theme/constants';
import { generateFormSchema, extractPlatformData, FormField, FormSchema } from '@/lib/utils/formGenerator';
import LinkPreview from './LinkPreview';
import { Link, Theme } from '@/types';
import { User } from 'firebase/auth';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 3rem;
    max-width: 100%;
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0; /* Allow flex item to shrink below content size */
  
  @media (min-width: 1024px) {
    min-width: 500px; /* Ensure minimum width for form fields */
  }
`;

const PreviewSection = styled.div`
  width: 100%;
  
  @media (min-width: 1024px) {
    width: 400px;
    flex-shrink: 0;
    position: sticky;
    top: 2rem;
    align-self: start;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
`;

const GroupContainer = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const GroupTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 0.5rem 0;
`;

const GroupDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FieldLabel = styled.label<{ $required?: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  
  &::after {
    content: ${(props) => (props.$required ? '" *"' : '""')};
    color: #ef4444;
  }
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${THEME_COLORS.primary};
    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:invalid {
    border-color: #ef4444;
  }
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${THEME_COLORS.primary};
    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ImageUploadArea = styled.div<{ $hasImage: boolean }>`
  border: 2px dashed ${(props) => (props.$hasImage ? '#d1d5db' : THEME_COLORS.primary)};
  border-radius: 0.5rem;
  padding: ${(props) => (props.$hasImage ? '0.5rem' : '2rem')};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.$hasImage ? 'transparent' : '#fff7ed')};
  min-height: ${(props) => (props.$hasImage ? 'auto' : '120px')};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${THEME_COLORS.primary};
    background-color: #fff7ed;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const ImagePreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const AddItemButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: #e5e7eb;
    border-color: #d1d5db;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ItemInput = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const DeleteItemButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.25rem;
  flex-shrink: 0;
  transition: color 0.2s;
  line-height: 1;

  &:hover {
    color: #dc2626;
  }
`;

const ValidationError = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

const PreviewTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 1rem 0;
`;

interface LayoutFormProps {
  layoutId: string;
  selectedPlatforms: string[];
  platformLinks: Record<string, string>;
  links: Link[];
  user: User | null;
  currentTheme: Theme;
  onFormDataChange: (data: Record<string, any>) => void;
}

export default function LayoutForm({
  layoutId,
  selectedPlatforms,
  platformLinks,
  links,
  user,
  currentTheme,
  onFormDataChange,
}: LayoutFormProps) {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Get profileFormData from Zustand store
  const { profileFormData, updateProfileFormData } = useFlowStore();

  // Track previous layoutId and platforms to detect changes
  const prevLayoutIdRef = useRef<string | undefined>(layoutId);
  const prevPlatformsRef = useRef<string[]>(selectedPlatforms);
  const isInitialMountRef = useRef(true);

  // Generate form schema and initialize form data from Zustand
  useEffect(() => {
    const schema = generateFormSchema(layoutId, selectedPlatforms);
    setFormSchema(schema);
    
    // Check if layout or platforms changed
    const layoutChanged = prevLayoutIdRef.current !== layoutId;
    const platformsChanged = JSON.stringify(prevPlatformsRef.current) !== JSON.stringify(selectedPlatforms);
    
    // Only initialize from Zustand on mount or when layout/platforms change
    // Don't re-initialize when profileFormData changes due to our own updates
    const shouldLoadFromZustand = isInitialMountRef.current || layoutChanged || platformsChanged;
    
    // Initialize form data - first try to load from Zustand, then use defaults
    const initialData: Record<string, any> = {};
    schema.fields.forEach((field) => {
      // If we should load from Zustand and have saved data, use it
      if (shouldLoadFromZustand && profileFormData && profileFormData[field.id] !== undefined) {
        initialData[field.id] = profileFormData[field.id];
      } else if (field.type === 'image' && field.id !== 'profilePic') {
        initialData[field.id] = [];
      } else if (field.type === 'video' || field.type === 'product') {
        initialData[field.id] = [];
      } else {
        initialData[field.id] = field.defaultValue || '';
      }
    });
    
    // Initialize if form is empty, or if layout/platforms changed
    if (Object.keys(formData).length === 0 || shouldLoadFromZustand) {
      setFormData(initialData);
      prevLayoutIdRef.current = layoutId;
      prevPlatformsRef.current = selectedPlatforms;
      isInitialMountRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutId, selectedPlatforms]); // Only depend on layout and platforms, not profileFormData

  // Auto-fill from platform links
  useEffect(() => {
    if (!formSchema) return;

    const autoFilled: Record<string, any> = {};
    formSchema.fields.forEach((field) => {
      if (field.autoFill?.fromPlatform && platformLinks[field.autoFill.fromPlatform]) {
        const platformData = extractPlatformData(
          field.autoFill.fromPlatform,
          platformLinks[field.autoFill.fromPlatform]
        );
        if (platformData[field.id]) {
          autoFilled[field.id] = platformData[field.id];
        }
      }
    });

    if (Object.keys(autoFilled).length > 0) {
      setFormData((prev) => ({ ...prev, ...autoFilled }));
    }
  }, [platformLinks, formSchema]);

  // Update Zustand store and notify parent of form data changes (debounced to avoid infinite loop)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Update Zustand store
      updateProfileFormData(formData);
      // Also notify parent callback if provided
      if (onFormDataChange) {
        onFormDataChange(formData);
      }
    }, 150); // Debounce to avoid too many updates
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, updateProfileFormData]); // Include updateProfileFormData

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleImageUpload = (fieldId: string, files: FileList | null, multiple = false) => {
    if (!files || files.length === 0) return;

    const readers: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readers).then((results) => {
      if (multiple) {
        setFormData((prev) => ({
          ...prev,
          [fieldId]: [...(prev[fieldId] || []), ...results],
        }));
      } else {
        setFormData((prev) => ({ ...prev, [fieldId]: results[0] }));
      }
    });
  };

  const handleRemoveImage = (fieldId: string, index?: number) => {
    if (index !== undefined) {
      // Remove from array
      setFormData((prev) => ({
        ...prev,
        [fieldId]: (prev[fieldId] || []).filter((_: any, i: number) => i !== index),
      }));
    } else {
      // Remove single image
      setFormData((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleAddItem = (fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), ''],
    }));
  };

  const handleItemChange = (fieldId: string, index: number, value: string) => {
    setFormData((prev) => {
      const items = [...(prev[fieldId] || [])];
      items[index] = value;
      return { ...prev, [fieldId]: items };
    });
  };

  const handleRemoveItem = (fieldId: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: (prev[fieldId] || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <FieldInput
            type="text"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <FieldTextarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'image':
        const isMultiple = field.id === 'gallery';
        const images = isMultiple ? (value || []) : (value ? [value] : []);

        return (
          <ImageUploadArea
            $hasImage={images.length > 0}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = isMultiple;
              input.onchange = (e) =>
                handleImageUpload(field.id, (e.target as HTMLInputElement).files, isMultiple);
              input.click();
            }}
          >
            {images.length > 0 ? (
              <ImagePreview>
                {images.map((img: string, index: number) => (
                  <ImagePreviewItem key={index}>
                    <ImagePreviewImg src={img} alt={`${field.label} ${index + 1}`} />
                    <RemoveImageButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(field.id, isMultiple ? index : undefined);
                      }}
                    >
                      ×
                    </RemoveImageButton>
                  </ImagePreviewItem>
                ))}
              </ImagePreview>
            ) : (
              <div>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  {isMultiple ? 'Click to upload photos' : 'Click to upload image'}
                </p>
              </div>
            )}
          </ImageUploadArea>
        );

      case 'video':
      case 'product':
        const items = Array.isArray(value) ? value : [];

        return (
          <>
            <AddItemButton onClick={() => handleAddItem(field.id)}>
              + Add {field.type === 'video' ? 'Video' : 'Product'}
            </AddItemButton>
            {items.length > 0 && (
              <ItemList>
                {items.map((item: string, index: number) => (
                  <ItemInput key={index}>
                    <FieldInput
                      type="url"
                      placeholder={field.placeholder}
                      value={item}
                      onChange={(e) => handleItemChange(field.id, index, e.target.value)}
                    />
                    <DeleteItemButton onClick={() => handleRemoveItem(field.id, index)}>
                      ×
                    </DeleteItemButton>
                  </ItemInput>
                ))}
              </ItemList>
            )}
          </>
        );

      case 'url':
        return (
          <FieldInput
            type="url"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  if (!formSchema) {
    return <div>Loading form...</div>;
  }

  const groupedFields = formSchema.fields.reduce((acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = [];
    }
    acc[field.group].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  return (
    <FormContainer>
      <FormSection>
        {Object.entries(groupedFields).map(([groupKey, fields]) => {
          const group = formSchema.groups[groupKey as keyof typeof formSchema.groups];
          if (!group || fields.length === 0) return null;

          return (
            <GroupContainer key={groupKey}>
              <GroupTitle>{group.title}</GroupTitle>
              {group.description && <GroupDescription>{group.description}</GroupDescription>}
              <FieldsContainer>
                {fields.map((field) => (
                  <FieldGroup key={field.id}>
                    <FieldLabel $required={field.required}>{field.label}</FieldLabel>
                    {renderField(field)}
                  </FieldGroup>
                ))}
              </FieldsContainer>
            </GroupContainer>
          );
        })}
      </FormSection>

      <PreviewSection>
        <PreviewTitle>Live Preview</PreviewTitle>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', background: '#ffffff' }}>
          <LinkPreview
            links={links}
            user={user}
            currentTheme={currentTheme}
            layoutId={layoutId}
            profileData={formData}
          />
        </div>
      </PreviewSection>
    </FormContainer>
  );
}

