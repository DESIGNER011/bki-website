// ============================================================
//  LOCAL MOCK: storageService.js 
// ============================================================
import { addMediaRecord } from './localDbService'; // Explicitly use local mock

export async function uploadMedia(file, label = '', onProgress = null) {
  if (onProgress) {
    onProgress(50);
    setTimeout(() => onProgress(100), 400);
  }
  
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // Use createObjectURL to avoid massive Base64 strings crashing the 5MB localStorage limit.
        // Note: These URLs will break if the browser tab is refreshed since it's a temporary mock!
        const url = URL.createObjectURL(file);
        const filename = `${Date.now()}_${file.name}`;
        const isVideo = file.type.startsWith('video/');
        
        const record = await addMediaRecord({
          filename,
          originalName: file.name,
          mimetype: file.type,
          type: isVideo ? 'video' : 'image',
          url,
          publicId: `mock/${filename}`,
          size: file.size,
          label
        });
        resolve(record);
      } catch (err) {
        console.error("Mock upload failed:", err);
        reject(err);
      }
    }, 500);
  });
}

export async function deleteStorageFile(filePath) {
  return Promise.resolve();
}
