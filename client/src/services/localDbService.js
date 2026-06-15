// ============================================================
//  LOCAL MOCK: dbService.js 
// ============================================================

const getStore = (key, defaultVal = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultVal));
  } catch (err) {
    return defaultVal;
  }
};
const setStore = (key, val) => localStorage.setItem(key, JSON.stringify(val));

/* ── Site Content ── */
export async function getSiteContent(key, fallback = []) {
  const store = getStore('bki_site_content', {});
  return store[key] || fallback;
}

export async function updateSiteContent(key, data) {
  const store = getStore('bki_site_content', {});
  store[key] = data;
  setStore('bki_site_content', store);
  return data;
}

/* ── Messages ── */
export async function getMessages() {
  const msgs = getStore('bki_messages');
  return msgs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addMessage(data) {
  const msgs = getStore('bki_messages');
  const record = { _id: Date.now().toString(), ...data, date: new Date().toISOString(), read: false };
  msgs.push(record);
  setStore('bki_messages', msgs);
  return record;
}

export async function deleteMessage(id) {
  const msgs = getStore('bki_messages');
  setStore('bki_messages', msgs.filter(m => m._id !== id));
}

/* ── Trials ── */
export async function getTrials() {
  const trials = getStore('bki_trials');
  return trials.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
}

export async function addTrial(data) {
  const trials = getStore('bki_trials');
  const record = { _id: Date.now().toString(), ...data, bookedAt: new Date().toISOString(), status: 'pending' };
  trials.push(record);
  setStore('bki_trials', trials);
  return record;
}

export async function deleteTrial(id) {
  const trials = getStore('bki_trials');
  setStore('bki_trials', trials.filter(t => t._id !== id));
}

/* ── Media ── */
export async function getMedia(type = 'all', label = '') {
  let media = getStore('bki_media');
  if (type !== 'all') media = media.filter(m => m.type === type);
  if (label) media = media.filter(m => m.label === label);
  return media.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

export async function addMediaRecord(data) {
  const media = getStore('bki_media');
  const record = { _id: Date.now().toString(), ...data, uploadedAt: new Date().toISOString() };
  media.push(record);
  setStore('bki_media', media);
  return record;
}

export async function deleteMediaRecord(id) {
  const media = getStore('bki_media');
  setStore('bki_media', media.filter(m => m._id !== id));
}

export async function updateMediaLabel(id, label) {
  const media = getStore('bki_media');
  const index = media.findIndex(m => m._id === id);
  if (index !== -1) {
    media[index].label = label;
    setStore('bki_media', media);
    return media[index];
  }
  return null;
}
