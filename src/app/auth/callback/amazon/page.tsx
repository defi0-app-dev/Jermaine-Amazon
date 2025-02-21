'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OAuthService } from '@/services/auth/OAuthService';
import { apiClient } from '@/services/api/client';
import { amazonOAuthSchema } from '@/services/api/validation';
import { AMAZON_OAUTH_CONFIG } from '@/config/oauth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useRetry } from '@/hooks/useRetry';

const AmazonCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const oauthService = new OAuthService(
    AMAZON_OAUTH_CONFIG.clientId,
    AMAZON_OAUTH_CONFIG.clientSecret,
    AMAZON_OAUTH_CONFIG.redirectUri,
    AMAZON_OAUTH_CONFIG.tokenEndpoint,
    AMAZON_OAUTH_CONFIG.userInfoEndpoint
  );

  const { execute: handleCallback, isLoading } = useRetry(async () => {
    try {
      const params = Object.fromEntries(searchParams.entries());
      const validatedParams = amazonOAuthSchema.parse(params);

      if (validatedParams.error) {
        throw new Error(validatedParams.error_description || validatedParams.error);
      }

      if (!validatedParams.code) {
        throw new Error('Authorization code is missing');
      }

      const tokenResponse = await oauthService.getAccessToken(validatedParams.code);
      const userProfile = await oauthService.getUserProfile(tokenResponse.access_token);

      // Store the tokens securely
      apiClient.setAuthToken(tokenResponse.access_token);

      // Redirect to the dashboard or intended destination
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      throw err;
    }
  });

  useEffect(() => {
    handleCallback().catch(() => {
      // Error is already handled in the try-catch block
    });
  }, [handleCallback]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => router.push('/auth/login')}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </ErrorBoundary>
  );
};

export default AmazonCallback; 