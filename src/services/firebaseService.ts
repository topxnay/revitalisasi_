import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../firebase';
import { PengajuanRevitalisasi, User, BantuanCatalogItem, AppThemeConfig } from '../types';
import { INITIAL_USERS, INITIAL_PENGAJUAN } from '../data/seedData';
import { STANDARD_CATALOG, DEFAULT_UTILITAS_CHECKLIST } from '../data/defaultCatalog';
import { DEFAULT_THEME } from '../data/themePresets';
import { 
  getStoredProposals, 
  getStoredUsers, 
  getStoredCatalog, 
  getStoredTheme,
  saveStoredProposals,
  saveStoredUsers,
  saveStoredCatalog,
  saveStoredTheme
} from '../utils/storage';

// Helper to remove undefined properties before saving to Firestore
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, value) => {
    return value === undefined ? null : value;
  }));
}

// -------------------------------------------------------------
// PROPOSALS SYNC
// -------------------------------------------------------------
export function subscribeProposals(
  onUpdate: (proposals: PengajuanRevitalisasi[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'proposals');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      // First time on fresh Firebase: seed from local storage or default seed
      seedProposalsIfEmpty().then((seeded) => {
        if (seeded && seeded.length > 0) {
          onUpdate(seeded);
        }
      }).catch(console.error);
      return;
    }

    const proposals: PengajuanRevitalisasi[] = [];
    snapshot.forEach((docSnap) => {
      proposals.push(docSnap.data() as PengajuanRevitalisasi);
    });

    // Sort proposals by createdAt / tanggalPengajuan descending
    proposals.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.tanggalPengajuan || 0).getTime();
      const dateB = new Date(b.createdAt || b.tanggalPengajuan || 0).getTime();
      return dateB - dateA;
    });

    // Cache locally
    saveStoredProposals(proposals);
    onUpdate(proposals);
  }, (err) => {
    console.error('Firestore proposals subscription error:', err);
    if (onError) onError(err);
  });
}

export async function saveProposalToCloud(proposal: PengajuanRevitalisasi): Promise<void> {
  const docRef = doc(db, 'proposals', proposal.id);
  const cleanData = sanitizeForFirestore(proposal);
  await setDoc(docRef, cleanData, { merge: true });
}

export async function deleteProposalFromCloud(proposalId: string): Promise<void> {
  const docRef = doc(db, 'proposals', proposalId);
  await deleteDoc(docRef);
}

// -------------------------------------------------------------
// USERS SYNC
// -------------------------------------------------------------
export function subscribeUsers(
  onUpdate: (users: User[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'users');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      seedUsersIfEmpty().then((seeded) => {
        if (seeded && seeded.length > 0) {
          onUpdate(seeded);
        }
      }).catch(console.error);
      return;
    }

    const users: User[] = [];
    snapshot.forEach((docSnap) => {
      users.push(docSnap.data() as User);
    });

    // Ensure at least one admin exists without overwriting custom admin passwords
    let hasAdmin = false;
    const sanitizedUsers = users.map(u => {
      if (u.role === 'admin') {
        hasAdmin = true;
      }
      // Only set initial fallback credentials for default primary admin if missing
      if (u.id === 'usr_admin' && u.username === 'admin' && !u.password) {
        return {
          ...u,
          password: 'akhmadtaufik84@',
          email: u.email || 'akhmadtaufik1984@gmail.com'
        };
      }
      return u;
    });

    if (!hasAdmin) {
      sanitizedUsers.unshift(INITIAL_USERS[0]);
      saveUserToCloud(INITIAL_USERS[0]).catch(console.error);
    }

    saveStoredUsers(sanitizedUsers);
    onUpdate(sanitizedUsers);
  }, (err) => {
    console.error('Firestore users subscription error:', err);
    if (onError) onError(err);
  });
}

export async function saveUserToCloud(user: User): Promise<void> {
  const docRef = doc(db, 'users', user.id);
  const cleanData = sanitizeForFirestore(user);
  await setDoc(docRef, cleanData, { merge: true });
}

export async function deleteUserFromCloud(userId: string): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await deleteDoc(docRef);
}

export async function bulkUpdateUsersInCloud(users: User[]): Promise<void> {
  const batch = writeBatch(db);
  for (const user of users) {
    const docRef = doc(db, 'users', user.id);
    batch.set(docRef, sanitizeForFirestore(user), { merge: true });
  }
  await batch.commit();
}

// -------------------------------------------------------------
// CATALOG SYNC
// -------------------------------------------------------------
export function subscribeCatalog(
  onUpdate: (catalog: BantuanCatalogItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'catalog');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      seedCatalogIfEmpty().then((seeded) => {
        if (seeded && seeded.length > 0) {
          onUpdate(seeded);
        }
      }).catch(console.error);
      return;
    }

    const items: BantuanCatalogItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as BantuanCatalogItem);
    });

    // Ensure Utilitas has 8 checklist items & 15% rate
    const updated = items.map((item) => {
      if (item.id === 'utilitas') {
        if (!item.checklistItems || item.checklistItems.length < 8 || !item.isPercentage || item.percentageRate !== 15) {
          return {
            ...item,
            name: 'Utilitas',
            category: 'sarana_utilitas' as const,
            isPercentage: true,
            percentageRate: 15,
            unit: 'Paket Kawasan (15%)',
            checklistItems: DEFAULT_UTILITAS_CHECKLIST,
            description: 'Komponen Bantuan Utilitas (Pagar, Taman, Lapangan, Paffing Blok, Jalan, Turab, Sanitasi, Pengeboran Sumur) dengan nilai nominal 15% dari semua ajuan fisik.'
          };
        }
      }
      return item;
    });

    saveStoredCatalog(updated);
    onUpdate(updated);
  }, (err) => {
    console.error('Firestore catalog subscription error:', err);
    if (onError) onError(err);
  });
}

export async function saveCatalogItemToCloud(item: BantuanCatalogItem): Promise<void> {
  const docRef = doc(db, 'catalog', item.id);
  const cleanData = sanitizeForFirestore(item);
  await setDoc(docRef, cleanData, { merge: true });
}

export async function deleteCatalogItemFromCloud(itemId: string): Promise<void> {
  const docRef = doc(db, 'catalog', itemId);
  await deleteDoc(docRef);
}

// -------------------------------------------------------------
// THEME SYNC
// -------------------------------------------------------------
export function subscribeTheme(
  onUpdate: (theme: AppThemeConfig) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, 'settings', 'theme');
  return onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      const current = getStoredTheme() || DEFAULT_THEME;
      saveThemeToCloud(current).catch(console.error);
      onUpdate(current);
      return;
    }
    const themeData = docSnap.data() as AppThemeConfig;
    saveStoredTheme(themeData);
    onUpdate(themeData);
  }, (err) => {
    console.error('Firestore theme subscription error:', err);
    if (onError) onError(err);
  });
}

export async function saveThemeToCloud(theme: AppThemeConfig): Promise<void> {
  const docRef = doc(db, 'settings', 'theme');
  await setDoc(docRef, sanitizeForFirestore(theme), { merge: true });
}

// -------------------------------------------------------------
// INITIAL SEEDING HELPERS (Upload existing data if cloud is empty)
// -------------------------------------------------------------
async function seedProposalsIfEmpty(): Promise<PengajuanRevitalisasi[]> {
  const localProposals = getStoredProposals();
  const source = (localProposals && localProposals.length > 0) ? localProposals : INITIAL_PENGAJUAN;
  
  const batch = writeBatch(db);
  for (const prop of source) {
    const docRef = doc(db, 'proposals', prop.id);
    batch.set(docRef, sanitizeForFirestore(prop));
  }
  await batch.commit();
  return source;
}

async function seedUsersIfEmpty(): Promise<User[]> {
  const localUsers = getStoredUsers();
  const source = (localUsers && localUsers.length > 0) ? localUsers : INITIAL_USERS;
  
  const batch = writeBatch(db);
  for (const u of source) {
    const docRef = doc(db, 'users', u.id);
    batch.set(docRef, sanitizeForFirestore(u));
  }
  await batch.commit();
  return source;
}

async function seedCatalogIfEmpty(): Promise<BantuanCatalogItem[]> {
  const localCatalog = getStoredCatalog();
  const source = (localCatalog && localCatalog.length > 0) ? localCatalog : STANDARD_CATALOG;
  
  const batch = writeBatch(db);
  for (const cat of source) {
    const docRef = doc(db, 'catalog', cat.id);
    batch.set(docRef, sanitizeForFirestore(cat));
  }
  await batch.commit();
  return source;
}

// Full reset in Cloud
export async function resetAllDataInCloud(): Promise<void> {
  // Delete and re-seed proposals
  const proposalsSnap = await getDocs(collection(db, 'proposals'));
  const batch1 = writeBatch(db);
  proposalsSnap.forEach(d => batch1.delete(d.ref));
  for (const prop of INITIAL_PENGAJUAN) {
    batch1.set(doc(db, 'proposals', prop.id), sanitizeForFirestore(prop));
  }
  await batch1.commit();

  // Reset users
  const usersSnap = await getDocs(collection(db, 'users'));
  const batch2 = writeBatch(db);
  usersSnap.forEach(d => batch2.delete(d.ref));
  for (const u of INITIAL_USERS) {
    batch2.set(doc(db, 'users', u.id), sanitizeForFirestore(u));
  }
  await batch2.commit();

  // Reset catalog
  const catSnap = await getDocs(collection(db, 'catalog'));
  const batch3 = writeBatch(db);
  catSnap.forEach(d => batch3.delete(d.ref));
  for (const cat of STANDARD_CATALOG) {
    batch3.set(doc(db, 'catalog', cat.id), sanitizeForFirestore(cat));
  }
  await batch3.commit();

  // Reset theme
  await setDoc(doc(db, 'settings', 'theme'), sanitizeForFirestore(DEFAULT_THEME));
}
