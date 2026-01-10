import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const LoginDto = z
  .object({ email: z.string(), password: z.string() })
  .passthrough();
const BaseResponseDto = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({}).partial().passthrough(),
  })
  .passthrough();
const AuthenticatedUserDto = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    accessToken: z.string(),
    roles: z.array(z.string()),
  })
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
const EmployeeDto = z
  .object({
    id: z.string(),
    employeeId: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    joinDate: z.string().datetime({ offset: true }).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
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
const AttendanceDto = z
  .object({
    id: z.string(),
    employeeId: z.string(),
    date: z.string().datetime({ offset: true }),
    type: z.enum(["CHECK_IN", "CHECK_OUT"]),
    workMode: z.enum(["WFH", "WFO"]),
    photoUrl: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const UpdateAttendanceDto = z.object({}).partial().passthrough();
const UploadResponseDto = z.object({ url: z.string() }).passthrough();

export const schemas = {
  LoginDto,
  BaseResponseDto,
  AuthenticatedUserDto,
  CreateEmployeeDto,
  EmployeeDto,
  UpdateEmployeeDto,
  CreateAttendanceDto,
  AttendanceDto,
  UpdateAttendanceDto,
  UploadResponseDto,
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
    response: AttendanceDto,
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
    response: AttendanceDto,
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
    response: z.array(AttendanceDto),
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
    response: z.array(AttendanceDto),
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
    response: AttendanceDto,
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
    response: z.array(AttendanceDto),
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
    response: AuthenticatedUserDto,
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
    response: BaseResponseDto,
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
    response: EmployeeDto,
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
    response: z.array(EmployeeDto),
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
    response: EmployeeDto,
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
    response: EmployeeDto,
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
    response: z.object({ url: z.string() }).passthrough(),
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
