import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, AuthUser, StudentProfileRecord, RegistrationFields, OtpResponse } from '../utils/authApi';
import { StudentDashboardData } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  profile: StudentProfileRecord | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (identifier: string, password: string, remember?: boolean) => Promise<AuthUser>;
  register: (payload: { name: string; email: string; phone?: string; password: string }) => Promise<AuthUser>;
  sendRegisterOtp: (payload: RegistrationFields) => Promise<OtpResponse>;
  verifyRegister: (payload: RegistrationFields & { otp: string }) => Promise<{ user: AuthUser; studentId: string }>;
  forgotPassword: (identifier: string) => Promise<OtpResponse>;
  resetPassword: (payload: { identifier: string; otp: string; newPassword: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<StudentProfileRecord | null>;
  updateProfile: (fields: Partial<StudentProfileRecord>) => Promise<StudentProfileRecord>;
  // The authenticated student's own dashboard record (per-student data separation
  // keyed by this unique Account ID). Null while still loading or not a student.
  dashboard: StudentDashboardData | null;
  refreshDashboard: () => Promise<StudentDashboardData | null>;
  updateDashboard: (patch: Partial<StudentDashboardData>) => Promise<StudentDashboardData | null>;
  hasActiveCourse: boolean;
  // All future student features must key their records by this unique Account ID:
  accountId: string | null;
  studentId: string | null;
  role: AuthUser['role'] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<StudentProfileRecord | null>(null);
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshProfile = useCallback(async (): Promise<StudentProfileRecord | null> => {
    try {
      const { profile: serverProfile } = await authApi.getStudentProfile();
      setProfile(serverProfile);
      // The per-account dashboard data lives on the same server record.
      setDashboard(serverProfile.dashboard || null);
      return serverProfile;
    } catch (e) {
      console.error('Failed to load student profile', e);
      return null;
    }
  }, []);

  const refreshDashboard = useCallback(async (): Promise<StudentDashboardData | null> => {
    try {
      const { profile: serverProfile } = await authApi.getStudentDashboard();
      setProfile(serverProfile);
      setDashboard(serverProfile.dashboard || null);
      return serverProfile.dashboard || null;
    } catch (e) {
      console.error('Failed to load student dashboard', e);
      return null;
    }
  }, []);

  const updateDashboard = useCallback(async (patch: Partial<StudentDashboardData>): Promise<StudentDashboardData | null> => {
    // Optimistic update so the UI responds instantly; the server is authoritative.
    setDashboard((prev) => (prev ? { ...prev, ...patch } : (patch as StudentDashboardData)));
    try {
      const { dashboard: serverDashboard } = await authApi.updateStudentDashboard(patch);
      setDashboard(serverDashboard);
      return serverDashboard;
    } catch (e) {
      console.error('Failed to sync student dashboard', e);
      return null;
    }
  }, []);

  // Restore session from HttpOnly cookie on first load
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { user: restored } = await authApi.me();
        if (!mounted) return;
        setUser(restored);
        if (restored.role === 'student') {
          await refreshProfile();
        }
      } catch (e) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshProfile]);

  const login = useCallback(async (identifier: string, password: string, remember?: boolean) => {
    const { user: loggedIn } = await authApi.login({ identifier, password, remember });
    setUser(loggedIn);
    if (loggedIn.role === 'student') {
      await refreshProfile();
    }
    return loggedIn;
  }, [refreshProfile]);

  const register = useCallback(async (payload: { name: string; email: string; phone?: string; password: string }) => {
    const { user: created } = await authApi.register(payload);
    setUser(created);
    if (created.role === 'student') {
      await refreshProfile();
    }
    return created;
  }, [refreshProfile]);

  const sendRegisterOtp = useCallback((payload: RegistrationFields) => authApi.sendRegisterOtp(payload), []);

  const verifyRegister = useCallback(async (payload: RegistrationFields & { otp: string }) => {
    const result = await authApi.verifyRegister(payload);
    setUser(result.user);
    if (result.user.role === 'student') {
      await refreshProfile();
    }
    return result;
  }, [refreshProfile]);

  const forgotPassword = useCallback((identifier: string) => authApi.forgotPassword(identifier), []);

  const resetPassword = useCallback(async (payload: { identifier: string; otp: string; newPassword: string }) => {
    await authApi.resetPassword(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setProfile(null);
      setDashboard(null);
    }
  }, []);

  const updateProfile = useCallback(async (fields: Partial<StudentProfileRecord>) => {
    const { profile: updated } = await authApi.updateStudentProfile(fields);
    setProfile(updated);
    setDashboard(updated.dashboard || null);
    return updated;
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isReady,
    login,
    register,
    sendRegisterOtp,
    verifyRegister,
    forgotPassword,
    resetPassword,
    logout,
    refreshProfile,
    updateProfile,
    dashboard,
    refreshDashboard,
    updateDashboard,
    hasActiveCourse: Array.isArray(dashboard?.enrolledCourseIds) && dashboard!.enrolledCourseIds.length > 0,
    accountId: user?.accountId || null,
    studentId: user?.studentId || null,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};