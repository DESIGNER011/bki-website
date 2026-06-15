// ============================================================
//  client/src/services/authService.js  —  Firebase Authentication
// ============================================================
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const ADMIN_EMAIL = 'admin@bushidokarate.com';

/**
 * Log in the administrator using their password mapped to the default admin email.
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export async function loginAdmin(password) {
  return signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
}

/**
 * Log out the authenticated administrator.
 * @returns {Promise<void>}
 */
export async function logoutAdmin() {
  return signOut(auth);
}

/**
 * Listen for authentication changes.
 * @param {function} callback 
 * @returns {Unsubscribe}
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
