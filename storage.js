import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';
import { storage, db } from './firebaseConfig.js';

// Upload file
export const uploadFile = async (file, metadata) => {
  if (!file || !metadata || !metadata.description) {
    throw new Error('Invalid file or metadata');
  }

  const fileRef = ref(storage, `files/${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file, { customMetadata: metadata });

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      null,
      (error) => {
        console.error('Upload error:', error);
        reject(new Error('File upload failed. Please check the console for details.'));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'files'), {
            name: file.name,
            url: downloadURL,
            description: metadata.description
          });
          resolve(file.name);
        } catch (error) {
          console.error('Error adding document:', error);
          reject(new Error('Failed to save file metadata. Please check the console for details.'));
        }
      }
    );
  });
};

// Update file metadata
export const updateFileMetadata = async (fileId, newMetadata) => {
  if (!fileId || !newMetadata) {
    throw new Error('Invalid file ID or metadata');
  }

  const fileRef = doc(db, 'files', fileId);
  try {
    await updateDoc(fileRef, newMetadata);
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update file metadata. Please check the console for details.');
  }
};

// Delete file
export const deleteFile = async (fileId, fileName) => {
  if (!fileId || !fileName) {
    throw new Error('Invalid file ID or file name');
  }

  try {
    const fileRef = ref(storage, `files/${fileName}`);
    await deleteObject(fileRef);

    const metadataRef = doc(db, 'files', fileId);
    await deleteDoc(metadataRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file. Please check the console for details.');
  }
};
