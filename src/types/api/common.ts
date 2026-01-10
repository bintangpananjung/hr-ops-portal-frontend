import { schemas } from "@/lib/generated/api-schema";
import { z } from "zod";

export const BaseResponseSchema = schemas.BaseResponseDto;

export type BaseResponse<T = unknown> = z.infer<typeof BaseResponseSchema> & {
  data: T;
};
