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
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);


  const roleMap: Record<number, string> = {
    1: "Admin",
    2: "Manager",
    3: "Officer",
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((user) => {
      const roleLabel = roleMap[Number(user.roleId)] ?? "-";
      const branch = user.branchId ?? "-";

      return (
        user.fullName.toLowerCase().includes(term) ||
        roleLabel.toLowerCase().includes(term) ||
        branch.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    });

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((user) => {
      const roleLabel = roleMap[Number(user.roleId)] ?? "-";
      const branch = user.branchId ?? "-";

      const matchesSearch =
        user.fullName.toLowerCase().includes(term) ||
        roleLabel.toLowerCase().includes(term) ||
        branch.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);

      const matchesRole = roleFilter ? roleLabel === roleFilter : true;
      const matchesBranch = branchFilter ? branch === branchFilter : true;

      return matchesSearch && matchesRole && matchesBranch;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อ filter เปลี่ยน
  }, [searchTerm, users, roleFilter, branchFilter]);


  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <div className="px-6 py-5 space-y-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            type="search"
            placeholder="ค้นหาชื่อ บทบาท สาขา หรืออีเมล"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            <option value="">บทบาททั้งหมด</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Officer">Officer</option>
          </select>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            <option value="">สาขาทั้งหมด</option>
            {[...new Set(users.map((u) => u.branchId))].map((branchId) => (
              <option key={branchId} value={branchId}>
                {branchId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <EditProfileDialog />
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>บทบาท</TableHead>
              <TableHead>สาขา</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">ดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{roleMap[Number(user.roleId)] ?? user.roleId}</TableCell>
                <TableCell>{user.branchId ?? "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                    {user.status === "ACTIVE" ? "ใช้งาน" : "ปิดใช้งาน"}
                  </Badge>
                </TableCell>
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
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </div>
    </div>
  );
}
