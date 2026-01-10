import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const AttendanceSchema = schemas.AttendanceDto;
export const CreateAttendanceSchema = schemas.CreateAttendanceDto;

export type Attendance = z.infer<typeof AttendanceSchema>;
export type CreateAttendance = z.infer<typeof CreateAttendanceSchema>;

export enum WorkMode {
  WFH = "WFH",
  WFO = "WFO",
}
