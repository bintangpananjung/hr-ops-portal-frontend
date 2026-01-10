import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmployees } from "@/hooks/useEmployees";
import { useEmployeeAttendance } from "@/hooks/useEmployeeAttendance";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Employee } from "@/types/api/employee";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee } = useEmployees();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { attendances, isLoading: isLoadingAttendance } = useEmployeeAttendance(
    {
      employeeId: id,
      startDate,
      endDate,
    }
  );

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id) {
        const data = await getEmployee(id);
        setEmployee(data);
        setIsLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      ACTIVE: "default",
      INACTIVE: "destructive",
      ON_LEAVE: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getAttendanceTypeBadge = (
    isCheckIn?: boolean,
    isCheckOut?: boolean
  ) => {
    if (isCheckOut) {
      return <Badge variant="destructive">Check Out</Badge>;
    }
    if (isCheckIn) {
      return <Badge variant="default">Check In</Badge>;
    }
    return <Badge variant="secondary">No Record</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-7xl mx-auto pt-8">
          <div className="text-center py-8 text-muted-foreground">
            Loading employee details...
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-7xl mx-auto pt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                Employee not found
              </div>
              <div className="text-center">
                <Button onClick={() => navigate("/employees")}>
                  Back to Employees
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto pt-8 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Employee Details</CardTitle>
            <CardDescription>
              View employee information and attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-muted-foreground">Employee ID</Label>
                <p className="text-lg font-medium">{employee.employeeId}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="text-lg font-medium">{employee.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-lg font-medium">{employee.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="text-lg font-medium">{employee.phone || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Department</Label>
                <p className="text-lg font-medium">
                  {employee.department || "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Position</Label>
                <p className="text-lg font-medium">
                  {employee.position || "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Join Date</Label>
                <p className="text-lg font-medium">
                  {employee.joinDate
                    ? new Date(employee.joinDate).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">{getStatusBadge(employee.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance Records
            </CardTitle>
            <CardDescription>
              View attendance history for this employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {isLoadingAttendance ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading attendance records...
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Work Mode</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Photo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendances.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendances.map((attendance) => (
                        <TableRow key={attendance.id}>
                          <TableCell className="font-medium">
                            {new Date(attendance.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getAttendanceTypeBadge(
                              !!attendance.checkIn,
                              !!attendance.checkOut
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {attendance.workMode}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              attendance.createdAt
                            ).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            {attendance.photoUrl && (
                              <a
                                href={attendance.photoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View Photo
                              </a>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
