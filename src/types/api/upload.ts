import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const UploadResponseSchema = schemas.UploadResponseDto;
export const UploadDtoSchema = schemas.UploadDto;

export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type UploadDto = z.infer<typeof UploadDtoSchema>;
