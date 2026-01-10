import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceActionsProps {
  hasCheckedIn: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
}

export function AttendanceActions({
  hasCheckedIn,
  isLoading,
  isDisabled,
  onClockIn,
  onClockOut,
}: AttendanceActionsProps) {
  return (
    <div className="flex gap-4">
      {!hasCheckedIn && (
        <Button
          onClick={onClockIn}
          disabled={isLoading || isDisabled}
          className="flex-1"
        >
          <Camera className="mr-2 h-4 w-4" />
          {isLoading ? "Processing..." : "Clock In"}
        </Button>
      )}
      {hasCheckedIn && (
        <Button
          onClick={onClockOut}
          disabled={isLoading || isDisabled}
          variant="destructive"
          className="flex-1"
        >
          <Camera className="mr-2 h-4 w-4" />
          {isLoading ? "Processing..." : "Clock Out"}
        </Button>
      )}
    </div>
  );
}
