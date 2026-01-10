import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const LoginDto = z
  .object({ email: z.string(), password: z.string() })
  .passthrough();
const CreateEmployeeDto = z
  .object({
    employeeId: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    department: z.string(),
    position: z.string(),
    joinDate: z.string(),
    status: z.string(),
  })
  .passthrough();
const UpdateEmployeeDto = z.object({}).partial().passthrough();
const CreateAttendanceDto = z
  .object({
    employeeId: z.string(),
    date: z.string(),
    type: z.string(),
    photoUrl: z.string(),
  })
  .passthrough();
const UpdateAttendanceDto = z.object({}).partial().passthrough();

export const schemas = {
  LoginDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  CreateAttendanceDto,
  UpdateAttendanceDto,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/attendances",
    alias: "AttendancesController_attendance",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateAttendanceDto,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Already checked in for today`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/attendances/:id",
    alias: "AttendancesController_update",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden - Admin role required`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Attendance not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/attendances/:id",
    alias: "AttendancesController_remove",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden - Admin role required`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Attendance not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/attendances/all",
    alias: "AttendancesController_getAllAttendances",
    requestFormat: "json",
    parameters: [
      {
        name: "startDate",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "endDate",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "employeeId",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden - Admin role required`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/attendances/current",
    alias: "AttendancesController_getCurrentEmployeeAttendances",
    requestFormat: "json",
    parameters: [
      {
        name: "startDate",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "endDate",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/attendances/current/today",
    alias: "AttendancesController_getCurrentEmployeeTodayAttendance",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/attendances/employee/:employeeId",
    alias: "AttendancesController_getEmployeeAttendances",
    requestFormat: "json",
    parameters: [
      {
        name: "employeeId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "startDate",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "endDate",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden - Admin role required`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/auth/current",
    alias: "AuthController_getCurrentEmployee",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/login",
    alias: "AuthController_login",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: LoginDto,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Invalid credentials`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/employees",
    alias: "EmployeesController_create",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateEmployeeDto,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/employees",
    alias: "EmployeesController_findAll",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/employees/:id",
    alias: "EmployeesController_findOne",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/employees/:id",
    alias: "EmployeesController_update",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/employees/:id",
    alias: "EmployeesController_remove",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/upload/photo",
    alias: "UploadController_uploadPhoto",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ file: z.instanceof(File) })
          .partial()
          .passthrough(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Invalid file type or size`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios("http://localhost:8000", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
