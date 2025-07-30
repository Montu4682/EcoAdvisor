import { useState, useCallback } from 'react';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Convert to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read image file'));
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      setPreviewUrl(null);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const resetUpload = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setIsUploading(false);
  }, [previewUrl]);

  return {
    uploadImage,
    resetUpload,
    isUploading,
    previewUrl,
  };
}
