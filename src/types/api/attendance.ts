import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const AttendanceSchema = schemas.AttendanceDto;
export const CreateAttendanceSchema = schemas.CreateAttendanceDto;

export type Attendance = z.infer<typeof AttendanceSchema>;
export type CreateAttendance = z.infer<typeof CreateAttendanceSchema>;

export const WorkMode = {
  WFH: "WFH",
  WFO: "WFO",
} as const;

export type WorkMode = (typeof WorkMode)[keyof typeof WorkMode];
