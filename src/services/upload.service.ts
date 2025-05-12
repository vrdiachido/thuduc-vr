// filepath: d:\MY_PROJECTS\VR_WEB\frontend\src\services\upload.service.ts
import supabase from "../library/supabase.client";

/**
 * Upload a file to Supabase storage
 * @param bucketName - Name of the bucket to upload to
 * @param filePath - Path/name to store the file under
 * @param file - The file to upload
 * @param options - Upload options (cacheControl, upsert)
 * @returns Promise with the upload result
 */
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File,
  options = { cacheControl: "3600", upsert: false }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, options);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { data: null, error };
  }
};

/**
 * Get public URL for a file in Supabase storage
 * @param bucketName - Name of the public bucket
 * @param filePath - Path of the file within the bucket
 * @returns Object containing the public URL
 */
export const getPublicUrl = (bucketName: string, filePath: string) => {
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return { data, error: null };
  } catch (error) {
    console.error("Error getting public URL:", error);
    return { data: null, error };
  }
};

/**
 * Create a unique filename based on timestamp and original filename
 * @param originalFilename - Original filename
 * @returns string with unique filename
 */
export const createUniqueFilename = (originalFilename: string): string => {
  const timestamp = new Date().getTime();
  const extension = originalFilename.split('.').pop();
  return `${timestamp}.${extension}`;
};