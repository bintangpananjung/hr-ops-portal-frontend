import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const UploadResponseSchema = schemas.UploadResponseDto;

export type UploadResponse = z.infer<typeof UploadResponseSchema>;
