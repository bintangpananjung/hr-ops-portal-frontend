import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const AttendanceSchema = schemas.AttendanceDto;
export const CreateAttendanceSchema = schemas.CreateAttendanceDto;

export type Attendance = z.infer<typeof AttendanceSchema>;
export type CreateAttendance = z.infer<typeof CreateAttendanceSchema>;

export const AttendanceType = {
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
} as const;

export type AttendanceType =
  (typeof AttendanceType)[keyof typeof AttendanceType];

export const WorkMode = {
  WFH: "WFH",
  WFO: "WFO",
} as const;

export type WorkMode = (typeof WorkMode)[keyof typeof WorkMode];
