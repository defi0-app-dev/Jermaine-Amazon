export const AMAZON_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID!,
  clientSecret: process.env.AMAZON_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/amazon`,
  authEndpoint: 'https://www.amazon.com/ap/oa',
  tokenEndpoint: 'https://api.amazon.com/auth/o2/token',
  userInfoEndpoint: 'https://api.amazon.com/user/profile',
  scope: 'profile',
} as const;

export const OAUTH_STATE_COOKIE = 'oauth_state';
export const AUTH_TOKEN_COOKIE = 'auth_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}; 