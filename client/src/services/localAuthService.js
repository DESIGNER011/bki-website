// ============================================================
//  LOCAL MOCK: authService.js 
// ============================================================

const mockUser = {
  email: 'admin@bushidokarate.com',
  getIdToken: async () => 'mock-admin-jwt-token-123456'
};

export async function loginAdmin(password) {
  if (password === 'admin123' || password === '12345678') {
    localStorage.setItem('bki_admin_auth', 'true');
    window.dispatchEvent(new Event('storage'));
    return { user: mockUser };
  }
  throw new Error('Invalid mock admin password. Use "admin123" or "12345678" for testing.');
}

export async function logoutAdmin() {
  localStorage.removeItem('bki_admin_auth');
  window.dispatchEvent(new Event('storage'));
}

export function onAuthChange(callback) {
  const checkAuth = () => {
    const isAuth = localStorage.getItem('bki_admin_auth') === 'true';
    callback(isAuth ? mockUser : null);
  };
  
  checkAuth();
  
  window.addEventListener('storage', checkAuth);
  
  return () => {
    window.removeEventListener('storage', checkAuth);
  };
}

