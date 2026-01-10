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
import MainLayout from "@/components/layout/MainLayout";
import { User } from "lucide-react";

export default function Attendance() {
  const { user, isLoading: isLoadingUser } = useUser();

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
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Attendance</CardTitle>
              <CardDescription>
                Clock in and out with your photo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingUser && (
                <div className="p-3 text-sm text-muted-foreground bg-muted/50 rounded-lg">
                  Loading user information...
                </div>
              )}

              {user && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
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
                    hasCheckedIn={!!hasCheckedIn}
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
    </MainLayout>
  );
}
