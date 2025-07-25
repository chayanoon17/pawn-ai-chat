import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Search } from "lucide-react";
import AddUserDialog from "./add-user-button";
import EditUserDialog from "./edit-user-dialog";
import { getAllUsers, deleteUser } from "@/lib/auth-service";
import type { User } from "@/types";

// 📝 API Response Interface
interface UsersResponse {
  users: User[];
  stats: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * UserTable Component
 *
 * แสดงตารางรายการผู้ใช้พร้อมฟีเจอร์:
 * - ค้นหาผู้ใช้
 * - แก้ไขข้อมูลผู้ใช้
 * - ลบผู้ใช้ (พร้อม confirmation)
 * - Pagination
 * - แสดงสถานะผู้ใช้แบบ Badge
 *
 * @returns JSX.Element - ตารางผู้ใช้พร้อมฟีเจอร์ต่างๆ
 */
export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [totalItems] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const limit = 10;

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = (await getAllUsers({
        page,
        limit,
        search: search || undefined,
      })) as UsersResponse;

      // if (response.success) {
      setUsers(response.users);
      // setTotalPages(response.data.stats.totalPages);
      // setTotalItems(response.data.stats.totalItems);
      // setCurrentPage(response.data.stats.currentPage);
      // } else {
      //   setError("Failed to load users");
      // }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, searchTerm);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    try {
      await deleteUser(userId.toString());
      // Refresh the user list
      fetchUsers(currentPage, searchTerm);
      console.log(`User ${userName} deleted successfully`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUserUpdated = () => {
    // Refresh the user list after update
    fetchUsers(currentPage, searchTerm);
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">กำลังโหลดข้อมูลผู้ใช้...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between w-full mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative w-96">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ค้นหาชื่อ หรือ อีเมล"
            />
          </div>
          <Button onClick={handleSearch} variant="outline" size="sm">
            ค้นหา
          </Button>
        </div>
        <div className="flex">
          <AddUserDialog onUserCreated={handleUserUpdated} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อผู้ใช้</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead>บทบาท</TableHead>
              <TableHead>สาขา</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">ดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  {loading ? "กำลังโหลด..." : "ไม่พบข้อมูลผู้ใช้"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.branch?.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "ACTIVE" ? "default" : "destructive"
                      }
                    >
                      {user.status === "ACTIVE" ? "ใช้งาน" : "ปิดใช้งาน"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              คุณต้องการลบผู้ใช้หรือไม่?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              การกระทำนี้ไม่สามารถย้อนกลับได้ จะลบผู้ใช้{" "}
                              <strong>{user.fullName}</strong> อย่างถาวร
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteUser(user.id, user.fullName)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              ลบ
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-gray-500">
            แสดง {users.length} จาก {totalItems} รายการ
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 2) + i;
                if (pageNumber > totalPages) return null;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit User Dialog */}
      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
