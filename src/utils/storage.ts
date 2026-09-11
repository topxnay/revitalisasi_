import { PengajuanRevitalisasi, User, UserRole, JenjangType, BantuanCatalogItem, AppThemeConfig } from '../types';
import { INITIAL_USERS, INITIAL_PENGAJUAN } from '../data/seedData';
import { STANDARD_CATALOG, DEFAULT_UTILITAS_CHECKLIST } from '../data/defaultCatalog';
import { DEFAULT_THEME, THEME_PRESETS } from '../data/themePresets';

const STORAGE_KEYS = {
  CURRENT_USER: 'simrevit_current_user_v1',
  USERS: 'simrevit_users_v1',
  PROPOSALS: 'simrevit_proposals_v1',
  CATALOG: 'simrevit_catalog_v1',
  THEME: 'simrevit_theme_v1'
};

const DEMO_USER_IDS = ['usr_smk1', 'usr_smk2', 'usr_sma1', 'usr_paud1', 'usr_sd1', 'usr_smp1', 'usr_slb1', 'usr_pkbm1'];

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    // Clean up demo users and update admin password to akhmadtaufik84@
    let needsUpdate = false;
    parsed = parsed
      .filter((u: User) => !DEMO_USER_IDS.includes(u.id))
      .map((u: User) => {
        if (u.role === 'admin' || u.username === 'admin') {
          if (u.password !== 'akhmadtaufik84@') {
            needsUpdate = true;
            return { ...u, password: 'akhmadtaufik84@', email: 'akhmadtaufik1984@gmail.com' };
          }
        }
        return u;
      });

    // If admin is missing after filtering, prepend initial admin
    if (!parsed.some((u: User) => u.role === 'admin')) {
      parsed = [...INITIAL_USERS, ...parsed];
      needsUpdate = true;
    }

    if (needsUpdate || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Failed to get stored users:', e);
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
}

export function saveUserToStorage(user: User): User[] {
  const currentUsers = getStoredUsers();
  const existingIdx = currentUsers.findIndex(u => u.id === user.id);
  let updated: User[];
  if (existingIdx >= 0) {
    updated = [...currentUsers];
    updated[existingIdx] = user;
  } else {
    updated = [...currentUsers, user];
  }
  saveStoredUsers(updated);
  return updated;
}

export function deleteUserFromStorage(userId: string): User[] {
  const currentUsers = getStoredUsers();
  const updated = currentUsers.filter(u => u.id !== userId);
  saveStoredUsers(updated);
  return updated;
}

export function toggleUserStatus(userId: string): User[] {
  const currentUsers = getStoredUsers();
  const updated = currentUsers.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        status: u.status === 'active' ? ('inactive' as const) : ('active' as const),
        updatedAt: new Date().toISOString()
      };
    }
    return u;
  });
  saveStoredUsers(updated);
  return updated;
}

export function getStoredProposals(): PengajuanRevitalisasi[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(INITIAL_PENGAJUAN));
      return INITIAL_PENGAJUAN;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(INITIAL_PENGAJUAN));
      return INITIAL_PENGAJUAN;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to get stored proposals:', e);
    return INITIAL_PENGAJUAN;
  }
}

export function saveStoredProposals(proposals: PengajuanRevitalisasi[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
  } catch (e) {
    console.error('Failed to save proposals:', e);
  }
}

export function saveProposalToStorage(proposal: PengajuanRevitalisasi): PengajuanRevitalisasi[] {
  const currentProposals = getStoredProposals();
  const existingIdx = currentProposals.findIndex(p => p.id === proposal.id);
  let updated: PengajuanRevitalisasi[];
  if (existingIdx >= 0) {
    updated = [...currentProposals];
    updated[existingIdx] = proposal;
  } else {
    updated = [proposal, ...currentProposals];
  }
  saveStoredProposals(updated);
  return updated;
}

export function deleteProposalFromStorage(proposalId: string): PengajuanRevitalisasi[] {
  const currentProposals = getStoredProposals();
  const updated = currentProposals.filter(p => p.id !== proposalId);
  saveStoredProposals(updated);
  return updated;
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user || typeof user !== 'object') return null;
    if (DEMO_USER_IDS.includes(user.id)) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }
    if (user.role === 'admin' || user.username === 'admin') {
      return { ...user, password: 'akhmadtaufik84@', email: 'akhmadtaufik1984@gmail.com' };
    }
    return user;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to set current user:', e);
  }
}

export const getStoredCurrentUser = getCurrentUser;
export const setStoredCurrentUser = setCurrentUser;

export function getStoredCatalog(): BantuanCatalogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATALOG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(STANDARD_CATALOG));
      return STANDARD_CATALOG;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(STANDARD_CATALOG));
      return STANDARD_CATALOG;
    }

    // Auto-update utilitas to ensure 8 checklist items & 15% rate are present
    let needsUpdate = false;
    const updated = parsed.map((item: BantuanCatalogItem) => {
      if (item.id === 'utilitas') {
        if (!item.checklistItems || item.checklistItems.length < 8 || !item.isPercentage || item.percentageRate !== 15) {
          needsUpdate = true;
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

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(updated));
      return updated;
    }

    return parsed;
  } catch (e) {
    console.error('Failed to get stored catalog:', e);
    return STANDARD_CATALOG;
  }
}

export function saveStoredCatalog(catalog: BantuanCatalogItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalog));
  } catch (e) {
    console.error('Failed to save catalog:', e);
  }
}

export function saveCatalogItemToStorage(item: BantuanCatalogItem): BantuanCatalogItem[] {
  const currentCatalog = getStoredCatalog();
  const existingIdx = currentCatalog.findIndex(c => c.id === item.id);
  let updated: BantuanCatalogItem[];
  if (existingIdx >= 0) {
    updated = [...currentCatalog];
    updated[existingIdx] = item;
  } else {
    updated = [...currentCatalog, item];
  }
  saveStoredCatalog(updated);
  return updated;
}

export function deleteCatalogItemFromStorage(itemId: string): BantuanCatalogItem[] {
  const currentCatalog = getStoredCatalog();
  const updated = currentCatalog.filter(c => c.id !== itemId);
  saveStoredCatalog(updated);
  return updated;
}

export function resetCatalogToDefault(): BantuanCatalogItem[] {
  localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(STANDARD_CATALOG));
  return STANDARD_CATALOG;
}

export function generateRegistrationNumber(jenjang: JenjangType, existingCount: number): string {
  const code = jenjang.includes('PAUD') || jenjang.includes('TK')
    ? 'PAUD'
    : jenjang.replace(/[^A-Z]/g, '');
  const seq = String(existingCount + 1).padStart(3, '0');
  return `RVT-2027-${code || 'SCH'}-${seq}`;
}

export function resetToInitialData() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(INITIAL_PENGAJUAN));
  localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(STANDARD_CATALOG));
  localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(DEFAULT_THEME));
  return {
    users: INITIAL_USERS,
    proposals: INITIAL_PENGAJUAN,
    catalog: STANDARD_CATALOG,
    theme: DEFAULT_THEME
  };
}

export const resetAllDataToDefault = resetToInitialData;

// THEME STORAGE
export function getStoredTheme(): AppThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(DEFAULT_THEME));
      return DEFAULT_THEME;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.bgColor) {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(DEFAULT_THEME));
      return DEFAULT_THEME;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to get stored theme:', e);
    return DEFAULT_THEME;
  }
}

export function saveStoredTheme(theme: AppThemeConfig): AppThemeConfig {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
  return theme;
}

export function resetThemeToDefault(): AppThemeConfig {
  localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(DEFAULT_THEME));
  return DEFAULT_THEME;
}

// BULK USER STATUS HELPERS
export function bulkSetUserStatus(userIds: string[], status: 'active' | 'inactive'): User[] {
  const currentUsers = getStoredUsers();
  const updated = currentUsers.map(u => {
    if (userIds.includes(u.id)) {
      return { ...u, status, updatedAt: new Date().toISOString() };
    }
    return u;
  });
  saveStoredUsers(updated);
  return updated;
}

export function setAllSchoolsUserStatus(status: 'active' | 'inactive'): User[] {
  const currentUsers = getStoredUsers();
  const updated = currentUsers.map(u => {
    // Keep admin always active
    if (u.role !== 'admin') {
      return { ...u, status, updatedAt: new Date().toISOString() };
    }
    return u;
  });
  saveStoredUsers(updated);
  return updated;
}
