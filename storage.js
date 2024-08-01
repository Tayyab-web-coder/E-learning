import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';
import { storage, db } from './firebaseConfig.js';

// Upload file
export const uploadFile = async (file, metadata) => {
  const fileRef = ref(storage, `files/${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file, { customMetadata: metadata });

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      null,
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, 'files'), {
          name: file.name,
          url: downloadURL,
          description: metadata.description
        });
        resolve(file.name);
      }
    );
  });
};

// Update file metadata
export const updateFileMetadata = async (fileId, newMetadata) => {
  const fileRef = doc(db, 'files', fileId);
  await updateDoc(fileRef, newMetadata);
};

// Delete file
export const deleteFile = async (fileId, fileName) => {
  const fileRef = ref(storage, `files/${fileName}`);
  await deleteObject(fileRef);
  const metadataRef = doc(db, 'files', fileId);
  await deleteDoc(metadataRef);
};
