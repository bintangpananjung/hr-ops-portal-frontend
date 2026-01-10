import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/contexts/user";
import { useAttendance } from "@/hooks/useAttendance";
import { useFileUpload } from "@/hooks/useFileUpload";
import { WorkMode } from "@/types/api/attendance";
import { AttendanceStatus } from "@/components/attendance/AttendanceStatus";
import { PhotoUpload } from "@/components/attendance/PhotoUpload";
import { AttendanceActions } from "@/components/attendance/AttendanceActions";

export default function Attendance() {
  const { user } = useUser();

  const {
    todayAttendance,
    isLoading,
    error: attendanceError,
    setError: setAttendanceError,
    clockIn,
    clockOut,
    hasCheckedIn,
    hasCheckedOut,
  } = useAttendance({ userId: user?.id });

  const {
    selectedFile,
    previewUrl,
    error: fileError,
    handleFileChange,
    clearFile,
    setError: setFileError,
  } = useFileUpload({
    onError: (error) => setAttendanceError(error),
  });

  const error = attendanceError || fileError;

  const handleClockIn = async () => {
    if (!selectedFile) {
      setFileError("Please select a photo");
      return;
    }

    try {
      await clockIn(selectedFile, WorkMode.WFH);
      clearFile();
    } catch (err) {}
  };

  const handleClockOut = async () => {
    if (!selectedFile) {
      setFileError("Please select a photo");
      return;
    }

    try {
      await clockOut(selectedFile, WorkMode.WFH);
      clearFile();
    } catch (err) {}
  };

  const renderCompletionMessage = () => {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>You have completed your attendance for today.</p>
        <p className="text-sm mt-2">See you tomorrow! 👋</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Attendance</CardTitle>
            <CardDescription>Clock in and out with your photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            {todayAttendance && (
              <AttendanceStatus attendance={todayAttendance} />
            )}

            {!hasCheckedOut && (
              <>
                <PhotoUpload
                  previewUrl={previewUrl}
                  onFileChange={handleFileChange}
                />
                <AttendanceActions
                  hasCheckedIn={hasCheckedIn}
                  isLoading={isLoading}
                  isDisabled={!selectedFile}
                  onClockIn={handleClockIn}
                  onClockOut={handleClockOut}
                />
              </>
            )}

            {hasCheckedOut && renderCompletionMessage()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
