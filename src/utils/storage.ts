import { PengajuanRevitalisasi, User, UserRole, JenjangType } from '../types';
import { INITIAL_USERS, INITIAL_PENGAJUAN } from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'simrevit_current_user_v1',
  USERS: 'simrevit_users_v1',
  PROPOSALS: 'simrevit_proposals_v1'
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
  return {
    users: INITIAL_USERS,
    proposals: INITIAL_PENGAJUAN
  };
}

export const resetAllDataToDefault = resetToInitialData;
