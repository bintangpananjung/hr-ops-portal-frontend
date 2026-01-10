import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type LoginResponse = {
  success: boolean;
  message: string;
  data: AuthenticatedUserDto;
};
type AuthenticatedUserDto = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  roles: Array<string>;
};
type CurrentUserResponse = {
  success: boolean;
  message: string;
  data: AuthenticatedUserDto;
};
type EmployeeDtoResponse = {
  success: boolean;
  message: string;
  data: EmployeeDto;
};
type EmployeeDto = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string | undefined;
  department?: string | undefined;
  position?: string | undefined;
  joinDate?: string | undefined;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt: string;
  updatedAt: string;
};
type EmployeeDtoListResponse = {
  success: boolean;
  message: string;
  data: Array<EmployeeDto>;
};
type AttendanceResponse = {
  success: boolean;
  message: string;
  data: AttendanceDto;
};
type AttendanceDto = {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workMode: "WFH" | "WFO";
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
};
type AttendanceListResponse = {
  success: boolean;
  message: string;
  data: Array<AttendanceDto>;
};
type UploadResponseDto = {
  success: boolean;
  message: string;
  data: UploadDto;
};
type UploadDto = {
  url: string;
};

const LoginDto = z
  .object({ email: z.string(), password: z.string() })
  .passthrough();
const AuthenticatedUserDto: z.ZodType<AuthenticatedUserDto> = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    accessToken: z.string(),
    roles: z.array(z.string()),
  })
  .passthrough();
const LoginResponse: z.ZodType<LoginResponse> = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: AuthenticatedUserDto,
  })
  .passthrough();
const CurrentUserResponse: z.ZodType<CurrentUserResponse> = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: AuthenticatedUserDto,
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
const EmployeeDto: z.ZodType<EmployeeDto> = z
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
const EmployeeDtoResponse: z.ZodType<EmployeeDtoResponse> = z
  .object({ success: z.boolean(), message: z.string(), data: EmployeeDto })
  .passthrough();
const EmployeeDtoListResponse: z.ZodType<EmployeeDtoListResponse> = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(EmployeeDto),
  })
  .passthrough();
const UpdateEmployeeDto = z.object({}).partial().passthrough();
const BaseResponseDto = z
  .object({ success: z.boolean(), message: z.string() })
  .passthrough();
const CreateAttendanceDto = z
  .object({
    employeeId: z.string(),
    date: z.string(),
    type: z.string(),
    photoUrl: z.string(),
  })
  .passthrough();
const AttendanceDto: z.ZodType<AttendanceDto> = z
  .object({
    id: z.string(),
    employeeId: z.string(),
    date: z.string().datetime({ offset: true }),
    checkIn: z.string().datetime({ offset: true }),
    checkOut: z.string().datetime({ offset: true }),
    workMode: z.enum(["WFH", "WFO"]),
    photoUrl: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const AttendanceResponse: z.ZodType<AttendanceResponse> = z
  .object({ success: z.boolean(), message: z.string(), data: AttendanceDto })
  .passthrough();
const AttendanceListResponse: z.ZodType<AttendanceListResponse> = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(AttendanceDto),
  })
  .passthrough();
const UpdateAttendanceDto = z.object({}).partial().passthrough();
const UploadDto: z.ZodType<UploadDto> = z
  .object({ url: z.string() })
  .passthrough();
const UploadResponseDto: z.ZodType<UploadResponseDto> = z
  .object({ success: z.boolean(), message: z.string(), data: UploadDto })
  .passthrough();

export const schemas = {
  LoginDto,
  AuthenticatedUserDto,
  LoginResponse,
  CurrentUserResponse,
  CreateEmployeeDto,
  EmployeeDto,
  EmployeeDtoResponse,
  EmployeeDtoListResponse,
  UpdateEmployeeDto,
  BaseResponseDto,
  CreateAttendanceDto,
  AttendanceDto,
  AttendanceResponse,
  AttendanceListResponse,
  UpdateAttendanceDto,
  UploadDto,
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
    response: AttendanceResponse,
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
    response: AttendanceResponse,
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
    response: BaseResponseDto,
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
    response: AttendanceListResponse,
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
    response: AttendanceListResponse,
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
    response: AttendanceResponse,
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
    response: AttendanceListResponse,
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
    response: CurrentUserResponse,
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
    response: LoginResponse,
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
    response: EmployeeDtoResponse,
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
    response: EmployeeDtoListResponse,
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
    response: EmployeeDtoResponse,
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
    response: EmployeeDtoResponse,
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
    response: BaseResponseDto,
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
    response: UploadResponseDto,
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
