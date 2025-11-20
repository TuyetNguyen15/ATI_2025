import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

/**
 * Upload image to Firebase Storage
 * @param {string} uri - Local file URI
 * @param {string} userId - Current user ID
 * @returns {Promise<string>} - Download URL
 */
export const uploadImage = async (uri, userId) => {
  try {
    console.log('📤 Uploading image:', uri);

    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create unique filename
    const timestamp = Date.now();
    const filename = `chat-images/${userId}/${timestamp}.jpg`;
    const storageRef = ref(storage, filename);

    // Upload file
    console.log('⬆️ Uploading to Firebase Storage...');
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Image uploaded successfully:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw new Error('Không thể tải ảnh lên. Vui lòng thử lại.');
  }
};

/**
 * Upload audio to Firebase Storage
 * @param {string} uri - Local audio file URI
 * @param {string} userId - Current user ID
 * @returns {Promise<string>} - Download URL
 */
export const uploadAudio = async (uri, userId) => {
  try {
    console.log('📤 Uploading audio:', uri);

    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create unique filename
    const timestamp = Date.now();
    const filename = `chat-audio/${userId}/${timestamp}.m4a`;
    const storageRef = ref(storage, filename);

    // Upload file
    console.log('⬆️ Uploading to Firebase Storage...');
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Audio uploaded successfully:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading audio:', error);
    throw new Error('Không thể tải âm thanh lên. Vui lòng thử lại.');
  }
};

/**
 * Upload avatar image
 * @param {string} uri - Local image URI
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Download URL
 */
export const uploadAvatar = async (uri, userId) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `avatars/${userId}.jpg`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

/**
 * Delete file from Firebase Storage
 * @param {string} fileUrl - Full download URL
 */
export const deleteFile = async (fileUrl) => {
  try {
    // Extract path from URL
    const urlObj = new URL(fileUrl);
    const path = decodeURIComponent(
      urlObj.pathname.split('/o/')[1].split('?')[0]
    );

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);

    console.log('✅ File deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting file:', error);
  }
};