import type { Attendance } from "@/types/api/attendance";
import { AttendanceType } from "@/types/api/attendance";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, LogOut } from "lucide-react";

interface AttendanceStatusProps {
  attendance: Attendance;
}

export function AttendanceStatus({ attendance }: AttendanceStatusProps) {
  const isCheckedOut = attendance.type === AttendanceType.CHECK_OUT;

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="font-semibold mb-3">Today's Status</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium min-w-24">Status:</span>
          <Badge variant={isCheckedOut ? "destructive" : "default"}>
            {isCheckedOut ? (
              <>
                <LogOut className="h-3 w-3" />
                Checked Out
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Checked In
              </>
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium min-w-24">Time:</span>
          <span className="text-sm text-muted-foreground">
            {new Date(attendance.date).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
