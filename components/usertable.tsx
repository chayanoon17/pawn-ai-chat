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
import { Edit, Trash2 } from "lucide-react";
import EditProfileDialog from "./buttonadduser";
import { getAllUsers } from "@/lib/auth-service";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
  roleId: string;
  branchId: string;
}


export function UserTable() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getAllUsers();
        setUsers(response.data); // ตามโครงสร้าง response ของ backend
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="px-4 py-3">
      <div>
        <h1 className="text-2xl font-bold">จัดการข้อมูลผู้ใช้</h1>
      </div>
      
      <div className="flex justify-between w-full">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative w-96 ">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
        </div>
        <div className="flex ">
          <EditProfileDialog />
        </div>
      </div>
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead>ชื่อ</TableHead>
      <TableHead>บทบาท</TableHead>
      <TableHead>สาขา</TableHead>
      <TableHead>อีเมล</TableHead>
      <TableHead>สถานะ</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell className="font-medium">{user.fullName}</TableCell>
        <TableCell>{user.roleId}</TableCell>
        <TableCell>{user.branchId}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.status === "ACTIVE" ? "ใช้งาน" : "ปิดใช้งาน"}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
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
                    คุณต้องการที่จะลบผู้ใช้หรือไม่ ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    การกระทำนี้ไม่สามารถย้อนกลับได้ จะลบผู้ใช้{" "}
                    <strong>{user.fullName}</strong> อย่างถาวร
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                  <AlertDialogAction>ลบ</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


      {/* Pagination */}

      <div className="flex items-center justify-between px-6 py-4 border-t">
        <Pagination>
          <PaginationContent></PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
