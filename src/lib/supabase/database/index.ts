
// Re-export all database functions
export { createProfilesTable } from './tables';
export { updateUserProfile, deleteUser } from './profiles';
export { getUserRole } from './roles';
export { ensureTestAdminUser } from './admin';

// Initialize admin user
import { ensureTestAdminUser } from './admin';

// Initialize admin user when this module is loaded
setTimeout(() => {
  ensureTestAdminUser().catch(err => {
    console.error('Failed to set testad1@mailinator.com as admin:', err);
  });
}, 3000);
