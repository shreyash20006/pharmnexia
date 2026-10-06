/**
 * PharmNexia Identity & Code System
 * 
 * Standardized Non-Sensitive Identifiers:
 * - Student:  PHN-STU-000001
 * - Mentor:   PHN-MNT-000001
 * - Support:  PHN-SPT-000001
 * - Admin:    PHN-ADM-000001
 * - Ticket:   PHN-TKT-000001
 * - Booking:  PHN-BKG-000128
 */

// Generate deterministic or incremental 6-digit number based on seed string
export function generateNumericHash(str, length = 6) {
  if (!str) return '001247';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const positive = Math.abs(hash);
  const modulo = Math.pow(10, length);
  const num = (positive % (modulo - 1000)) + 1000;
  return String(num).padStart(length, '0');
}

/**
 * Returns a standardized PharmNexia user identifier
 * @param {'STUDENT' | 'MENTOR' | 'SUPPORT' | 'ADMIN'} role
 * @param {string} userUid - unique uuid or email
 */
export function formatPharmNexiaId(role = 'STUDENT', userUid = '') {
  const normalizedRole = (role || 'STUDENT').toUpperCase();
  let prefix = 'PHN-STU';
  if (normalizedRole === 'MENTOR') prefix = 'PHN-MNT';
  else if (normalizedRole === 'SUPPORT') prefix = 'PHN-SPT';
  else if (normalizedRole === 'ADMIN') prefix = 'PHN-ADM';

  const digits = generateNumericHash(userUid || `user-${Date.now()}`, 6);
  return `${prefix}-${digits}`;
}

/**
 * Returns a unique Ticket ID
 * e.g. PHN-TKT-004821
 */
export function formatTicketId(indexOrSeed) {
  if (typeof indexOrSeed === 'number') {
    return `PHN-TKT-${String(indexOrSeed).padStart(6, '0')}`;
  }
  const digits = generateNumericHash(indexOrSeed || `tkt-${Date.now()}`, 6);
  return `PHN-TKT-${digits}`;
}

/**
 * Returns a unique Booking ID
 * e.g. PHN-BKG-000128
 */
export function formatBookingId(indexOrSeed) {
  if (typeof indexOrSeed === 'number') {
    return `PHN-BKG-${String(indexOrSeed).padStart(6, '0')}`;
  }
  const digits = generateNumericHash(indexOrSeed || `bkg-${Date.now()}`, 6);
  return `PHN-BKG-${digits}`;
}

export const SUPPORT_AGENTS = [
  {
    id: 'spt-001',
    pharmNexiaId: 'PHN-SPT-000001',
    name: 'Pooja Verma',
    roleTitle: 'Senior Support Executive',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    status: 'ONLINE'
  },
  {
    id: 'spt-002',
    pharmNexiaId: 'PHN-SPT-000002',
    name: 'Aman Sharma',
    roleTitle: 'Academic Support Executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    status: 'ONLINE'
  }
];
