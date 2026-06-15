// ============================================================
//  client/src/services/dbService.js  —  Firestore CRUD Services
// ============================================================
import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  where,
  Timestamp
} from 'firebase/firestore';

// Helper to convert Firestore Timestamp to standard ISO strings so that existing
// client components do not crash when styling and parsing date fields.
function mapDoc(docSnap) {
  const data = docSnap.data();
  const mapped = { _id: docSnap.id, ...data };
  
  if (mapped.date && typeof mapped.date.toDate === 'function') {
    mapped.date = mapped.date.toDate().toISOString();
  }
  if (mapped.bookedAt && typeof mapped.bookedAt.toDate === 'function') {
    mapped.bookedAt = mapped.bookedAt.toDate().toISOString();
  }
  if (mapped.uploadedAt && typeof mapped.uploadedAt.toDate === 'function') {
    mapped.uploadedAt = mapped.uploadedAt.toDate().toISOString();
  }
  if (mapped.updatedAt && typeof mapped.updatedAt.toDate === 'function') {
    mapped.updatedAt = mapped.updatedAt.toDate().toISOString();
  }
  return mapped;
}

/* ── Site Content (courses, belts, achievements, schedules) ── */
export async function getSiteContent(key, fallback = []) {
  try {
    const docRef = doc(db, 'SiteContent', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data || fallback;
    }
    return fallback;
  } catch (err) {
    console.warn(`⚠️ Error reading SiteContent for key ${key}, using fallback:`, err.message);
    return fallback;
  }
}

export async function updateSiteContent(key, data) {
  const docRef = doc(db, 'SiteContent', key);
  return setDoc(docRef, {
    key,
    data,
    updatedAt: Timestamp.now()
  });
}

/* ── Messages (Contact Form) ── */
export async function getMessages() {
  const q = query(collection(db, 'messages'), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function addMessage(data) {
  const colRef = collection(db, 'messages');
  return addDoc(colRef, {
    ...data,
    date: Timestamp.now(),
    read: false
  });
}

export async function deleteMessage(id) {
  const docRef = doc(db, 'messages', id);
  return deleteDoc(docRef);
}

/* ── Trials (Intro Class Booking) ── */
export async function getTrials() {
  const q = query(collection(db, 'trials'), orderBy('bookedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function addTrial(data) {
  const colRef = collection(db, 'trials');
  return addDoc(colRef, {
    ...data,
    bookedAt: Timestamp.now(),
    status: 'pending'
  });
}

export async function deleteTrial(id) {
  const docRef = doc(db, 'trials', id);
  return deleteDoc(docRef);
}

/* ── Media Gallery ── */
export async function getMedia(type = 'all', label = '') {
  const constraints = [];
  if (type !== 'all') {
    constraints.push(where('type', '==', type));
  }
  if (label) {
    constraints.push(where('label', '==', label));
  }
  constraints.push(orderBy('uploadedAt', 'desc'));
  
  const q = query(collection(db, 'media'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function addMediaRecord(data) {
  const colRef = collection(db, 'media');
  const docRef = await addDoc(colRef, {
    ...data,
    uploadedAt: Timestamp.now()
  });
  return { _id: docRef.id, ...data, uploadedAt: new Date().toISOString() };
}

export async function deleteMediaRecord(id) {
  const docRef = doc(db, 'media', id);
  return deleteDoc(docRef);
}

export async function updateMediaLabel(id, label) {
  const docRef = doc(db, 'media', id);
  await updateDoc(docRef, { label });
  const docSnap = await getDoc(docRef);
  return mapDoc(docSnap);
}
