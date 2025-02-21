import { z } from 'zod';

export const amazonOAuthSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const amazonTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
});

export const amazonUserSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  email_verified: z.boolean(),
  profile_image: z.string().url().optional(),
});

export const amazonErrorSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
  error_uri: z.string().url().optional(),
});

export type AmazonOAuthParams = z.infer<typeof amazonOAuthSchema>;
export type AmazonTokenResponse = z.infer<typeof amazonTokenSchema>;
export type AmazonUserProfile = z.infer<typeof amazonUserSchema>;
export type AmazonError = z.infer<typeof amazonErrorSchema>; 