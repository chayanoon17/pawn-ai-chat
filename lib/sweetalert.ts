import Swal from "sweetalert2";

// 🎨 Custom SweetAlert2 configurations for consistent styling
const swalConfig = {
  confirmButtonColor: "#3b82f6", // blue-500
  cancelButtonColor: "#ef4444", // red-500
  showClass: {
    popup: "animate__animated animate__fadeInDown",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutUp",
  },
};

// 🎯 Success Alert
export const showSuccess = (title: string, text?: string, timer = 3000) => {
  return Swal.fire({
    ...swalConfig,
    icon: "success",
    title,
    text,
    timer,
    showConfirmButton: false,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
  });
};

// ❌ Error Alert
export const showError = (
  title: string,
  text?: string,
  showConfirmButton = true
) => {
  return Swal.fire({
    ...swalConfig,
    icon: "error",
    title,
    text,
    showConfirmButton,
    timer: showConfirmButton ? undefined : 5000,
    timerProgressBar: !showConfirmButton,
    toast: !showConfirmButton,
    position: showConfirmButton ? "center" : "top-end",
  });
};

// ⚠️ Warning Alert
export const showWarning = (title: string, text?: string, timer = 4000) => {
  return Swal.fire({
    ...swalConfig,
    icon: "warning",
    title,
    text,
    timer,
    showConfirmButton: false,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
  });
};

// ℹ️ Info Alert
export const showInfo = (title: string, text?: string, timer = 3000) => {
  return Swal.fire({
    ...swalConfig,
    icon: "info",
    title,
    text,
    timer,
    showConfirmButton: false,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
  });
};

// ❓ Confirmation Alert
export const showConfirmation = (
  title: string,
  text?: string,
  confirmButtonText = "ยืนยัน",
  cancelButtonText = "ยกเลิก"
) => {
  return Swal.fire({
    ...swalConfig,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
};

// 🗑️ Delete Confirmation
export const showDeleteConfirmation = (
  title = "คุณแน่ใจหรือไม่?",
  text = "การกระทำนี้ไม่สามารถยกเลิกได้!",
  confirmButtonText = "ใช่, ลบเลย!",
  cancelButtonText = "ยกเลิก"
) => {
  return Swal.fire({
    ...swalConfig,
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#ef4444", // red-500
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
};

// 📥 Loading Alert
export const showLoading = (
  title = "กำลังประมวลผล...",
  text = "กรุณารอสักครู่"
) => {
  return Swal.fire({
    ...swalConfig,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// 🔐 Login Error
export const showLoginError = (
  message = "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  details?: string
) => {
  return Swal.fire({
    ...swalConfig,
    icon: "error",
    title: "เข้าสู่ระบบไม่สำเร็จ",
    text: message,
    footer: details
      ? `<small class="text-gray-500">${details}</small>`
      : undefined,
    confirmButtonText: "ลองใหม่",
  });
};

// 🚫 Unauthorized Access
export const showUnauthorized = (message = "คุณไม่มีสิทธิ์เข้าถึงหน้านี้") => {
  return Swal.fire({
    ...swalConfig,
    icon: "error",
    title: "ไม่มีสิทธิ์เข้าถึง",
    text: message,
    confirmButtonText: "ตกลง",
  });
};

// 📱 Network Error
export const showNetworkError = (
  message = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
) => {
  return Swal.fire({
    ...swalConfig,
    icon: "error",
    title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
    text: message,
    footer:
      '<small class="text-gray-500">กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</small>',
    confirmButtonText: "ลองใหม่",
  });
};

// 🎉 Custom Alert with HTML content
export const showCustomAlert = (config: Record<string, unknown>) => {
  return Swal.fire({
    ...swalConfig,
    ...config,
  });
};

// 💾 Save Confirmation
export const showSaveConfirmation = (
  title = "บันทึกข้อมูล?",
  text = "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?"
) => {
  return Swal.fire({
    ...swalConfig,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "บันทึก",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#10b981", // green-500
    reverseButtons: true,
  });
};

// 🔄 Update Success
export const showUpdateSuccess = (
  title = "อัปเดตสำเร็จ!",
  text = "ข้อมูลถูกอัปเดตเรียบร้อยแล้ว"
) => {
  return showSuccess(title, text);
};

// ➕ Create Success
export const showCreateSuccess = (
  title = "สร้างสำเร็จ!",
  text = "ข้อมูลถูกสร้างเรียบร้อยแล้ว"
) => {
  return showSuccess(title, text);
};

// 🗑️ Delete Success
export const showDeleteSuccess = (
  title = "ลบสำเร็จ!",
  text = "ข้อมูลถูกลบเรียบร้อยแล้ว"
) => {
  return showSuccess(title, text);
};

export default Swal;
