import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const EmployeeSchema = schemas.EmployeeDto;
export const CreateEmployeeSchema = schemas.CreateEmployeeDto;
export const UpdateEmployeeSchema = schemas.UpdateEmployeeDto;

export type Employee = z.infer<typeof EmployeeSchema>;
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>;

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
}
