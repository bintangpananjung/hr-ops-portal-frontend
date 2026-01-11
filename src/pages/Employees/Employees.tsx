import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { usePagination } from "@/hooks/usePagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { EmployeeDialog } from "@/components/employees/EmployeeDialog";
import { DeleteConfirmDialog } from "@/components/employees/DeleteConfirmDialog";
import type {
  CreateEmployee,
  Employee,
  UpdateEmployee,
} from "@/types/api/employee";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { Pagination } from "@/components/ui/pagination";

export default function Employees() {
  const { page, limit, goToPage, setPageSize } = usePagination({
    initialPage: 1,
    initialLimit: 10,
  });

  const {
    employees,
    meta,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees(page, limit);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null
  );
  const navigate = useNavigate();

  const handleCreate = async (data: CreateEmployee) => {
    await createEmployee(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (data: UpdateEmployee) => {
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, data);
      setEditingEmployee(null);
    }
  };

  const handleDelete = async () => {
    if (deletingEmployee) {
      await deleteEmployee(deletingEmployee.id);
      setDeletingEmployee(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      ACTIVE: "default",
      INACTIVE: "destructive",
      ON_LEAVE: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Employee Management</CardTitle>
                <CardDescription>
                  Manage employee records and view attendance
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading employees...
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No employees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.employeeId}
                          </TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>
                            {getStatusBadge(employee.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(`/employees/${employee.id}`)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingEmployee(employee)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingEmployee(employee)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            {meta && (
              <Pagination
                meta={meta}
                onPageChange={goToPage}
                onLimitChange={setPageSize}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <EmployeeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        title="Add New Employee"
      />

      <EmployeeDialog
        open={!!editingEmployee}
        onOpenChange={(open) => !open && setEditingEmployee(null)}
        onSubmit={handleUpdate}
        employee={editingEmployee}
        title="Edit Employee"
      />

      <DeleteConfirmDialog
        open={!!deletingEmployee}
        onOpenChange={(open) => !open && setDeletingEmployee(null)}
        onConfirm={handleDelete}
        employeeName={deletingEmployee?.name || ""}
      />
    </MainLayout>
  );
}
