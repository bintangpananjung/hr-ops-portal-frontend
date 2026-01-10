import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const LoginSchema = schemas.LoginDto;
export const AuthenticatedUserSchema = schemas.AuthenticatedUserDto;

export type LoginFormData = z.infer<typeof LoginSchema>;
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
