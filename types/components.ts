/**
 * Shared Component Types
 * รวม interfaces ที่ใช้ร่วมกันในหลาย components
 */

// ===== USER & ROLE MANAGEMENT =====
export interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleCreated: () => void;
  canManagePermissions: boolean;
  canManageMenuPermissions: boolean;
}

export interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: import("./role-management").Role;
  onRoleUpdated: () => void;
  canManagePermissions: boolean;
  canManageMenuPermissions: boolean;
}

export interface RoleTableProps {
  data: import("./role-management").Role[];
  onEdit: (role: import("./role-management").Role) => void;
  onDelete: (roleId: number) => void;
  canManagePermissions: boolean;
  canManageMenuPermissions: boolean;
}

export interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

export interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: import("./auth").User;
  onUserUpdated: () => void;
}

export interface CreateUserFormData {
  name: string;
  email: string;
  roleId: number;
  branchId: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface EditUserFormData {
  name: string;
  email: string;
  roleId: number;
  branchId: number;
  status: "ACTIVE" | "INACTIVE";
}

// ===== LOGS & ACTIVITY =====
export interface LoginRow {
  name: string;
  email: string;
  datetime: string;
  action: string;
  ip: string;
  agent: string;
  session: string;
  location: string;
}

export interface ExportRow {
  name: string;
  email: string;
  type: string;
  format: string;
  records: number;
  size: string;
  status: string;
  datetime: string;
}

export type Tab = "login" | "export" | "view" | "chat";

export interface LogTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export interface LoginTableProps {
  data: LoginRow[];
}

export interface ExportTableProps {
  data: ExportRow[];
}

// ===== FILTERS & WIDGETS =====
export interface WidgetFilterData {
  branchId?: number;
  period: import("./common").FilterPeriod;
  startDate?: string;
  endDate?: string;
}

export interface WidgetFilterProps {
  onFilterChange: (data: WidgetFilterData) => void;
  selectedBranch?: number;
  selectedPeriod?: import("./common").FilterPeriod;
}

// ===== COOKIES & CONSENT =====
export interface CookieConsentProps {
  onAccept: () => void;
  onDecline?: () => void;
}

// ===== UI STATES =====
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}
