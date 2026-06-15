// ============================================================
//  client/src/services/storageService.js  —  Firebase Storage
// ============================================================
import { storage } from '../firebase';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { addMediaRecord } from './dbService';

/**
 * Uploads a file to Firebase Storage and saves its metadata record in Firestore.
 * 
 * @param {File} file - File object to upload
 * @param {string} label - Optional tag/label
 * @param {function} onProgress - Progress callback with percentage (0-100)
 * @returns {Promise<object>} The Firestore database record object
 */
export async function uploadMedia(file, label = '', onProgress = null) {
  const filename = `${Date.now()}_${file.name}`;
  const isVideo = file.type.startsWith('video/');
  const folder = isVideo ? 'bki/videos' : 'bki/images';
  const filePath = `${folder}/${filename}`;
  const fileRef = ref(storage, filePath);
  
  const uploadTask = uploadBytesResumable(fileRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        if (onProgress) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(pct);
        }
      }, 
      (error) => {
        reject(error);
      }, 
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const size = file.size;
          const mimetype = file.type;
          const type = isVideo ? 'video' : 'image';
          
          const record = await addMediaRecord({
            filename,
            originalName: file.name,
            mimetype,
            type,
            url: downloadUrl,
            publicId: filePath, // Stores the Storage filepath to use during deletion
            size,
            label
          });
          
          resolve(record);
        } catch (dbErr) {
          reject(dbErr);
        }
      }
    );
  });
}

/**
 * Deletes a file from Firebase Storage.
 * @param {string} filePath - Full reference path in storage
 * @returns {Promise<void>}
 */
export async function deleteStorageFile(filePath) {
  const fileRef = ref(storage, filePath);
  return deleteObject(fileRef);
}
