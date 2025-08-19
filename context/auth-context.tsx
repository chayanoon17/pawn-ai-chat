"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import authService from "../services/auth-service";
import { User, AuthContextType } from "../types/auth";
import { showSuccess, showError, showUnauthorized } from "../lib/sweetalert";

/**
 * Auth State Interface
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth Actions สำหรับ useReducer
 */
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "AUTH_CLEAR_ERROR" };

/**
 * Initial State
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // เริ่มต้น loading เพื่อตรวจสอบ auth status
  error: null,
};

/**
 * Auth Reducer - จัดการ state changes
 */
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case "AUTH_CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

/**
 * Create Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Login Function
   */
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        dispatch({ type: "AUTH_START" });

        // เรียก Auth Service เพื่อ login
        await authService.login({ email, password });

        // ดึงข้อมูลผู้ใช้หลัง login สำเร็จ
        const user = await authService.getCurrentUser();

        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        dispatch({ type: "AUTH_FAILURE", payload: errorMessage });

        // Log error ใน development mode
        if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
          console.error("❌ Login failed in context:", error);
        }

        throw error; // Re-throw เพื่อให้ component handle ได้
      }
    },
    []
  );

  /**
   * Logout Function
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // เรียก Auth Service เพื่อ logout
      await authService.logout();

      // 🧹 Clear widget filter session และ localStorage เมื่อ logout
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("widgetFilter_session");
        localStorage.removeItem("widgetFilter_branchId");
        localStorage.removeItem("widgetFilter_date");
        // ลบ access token
        localStorage.removeItem("accessToken");

        // ล้างข้อมูล remember me เมื่อ logout (ยกเว้นถ้าผู้ใช้เลือกให้จดจำ)
        const rememberMeEnabled = localStorage.getItem("rememberMe_enabled");
        if (rememberMeEnabled !== "true") {
          localStorage.removeItem("rememberMe_email");
        }
      }

      dispatch({ type: "AUTH_LOGOUT" });

      // แสดง SweetAlert2 success
      showSuccess("ออกจากระบบสำเร็จ", "ขอบคุณที่ใช้บริการ", 2000);
    } catch (error) {
      // แม้ logout API fail เราก็ควร clear local state

      // 🧹 Clear widget filter session และ localStorage เมื่อ logout (แม้ API fail)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("widgetFilter_session");
        localStorage.removeItem("widgetFilter_branchId");
        localStorage.removeItem("widgetFilter_date");
        // ลบ access token
        localStorage.removeItem("accessToken");

        // ล้างข้อมูล remember me เมื่อ logout (ยกเว้นถ้าผู้ใช้เลือกให้จดจำ)
        const rememberMeEnabled = localStorage.getItem("rememberMe_enabled");
        if (rememberMeEnabled !== "true") {
          localStorage.removeItem("rememberMe_email");
        }
      }

      dispatch({ type: "AUTH_LOGOUT" });

      // Log warning ใน development mode
      if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
        console.warn("⚠️ Logout API failed, but cleared local state:", error);
      }
    }
  }, []);

  /**
   * Refresh User Function
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      // ดึงข้อมูลผู้ใช้ปัจจุบัน
      const user = await authService.getCurrentUser();

      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to refresh user";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });

      // Log error ใน development mode
      if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
        console.error("❌ Failed to refresh user in context:", error);
      }
    }
  }, []);

  /**
   * Clear Remember Me Function
   */
  const clearRememberMe = useCallback((): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rememberMe_email");
      localStorage.removeItem("rememberMe_enabled");
    }
  }, []);

  /**
   * Permission Helper Functions
   */
  const hasPermission = useCallback(
    (action: string): boolean => {
      return authService.hasPermission(state.user, action);
    },
    [state.user]
  );

  const hasMenuAccess = useCallback(
    (menuName: string): boolean => {
      return authService.hasMenuAccess(state.user, menuName);
    },
    [state.user]
  );

  /**
   * Auto-check authentication status เมื่อ app เริ่มต้น
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // พยายามดึงข้อมูลผู้ใช้ปัจจุบัน
        const user = await authService.getCurrentUser();
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } catch (error) {
        // ถ้า fail แสดงว่าไม่ได้ login หรือ token หมดอายุ
        dispatch({ type: "AUTH_LOGOUT" });
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Context Value
   */
  const contextValue: AuthContextType = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,

    // Actions
    login,
    logout,
    refreshUser,
    clearRememberMe,

    // Permission Helpers
    hasPermission,
    hasMenuAccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Custom Hook สำหรับใช้ Auth Context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/**
 * Export สำหรับใช้งาน
 */
export { AuthContext };
export default AuthProvider;
