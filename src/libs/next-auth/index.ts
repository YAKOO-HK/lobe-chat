import NextAuth from 'next-auth';

import { getServerConfig } from '@/config/server';

import { ssoProviders } from './sso-providers';

const { NEXTAUTH_SECRET, ENABLE_OAUTH_SSO, SSO_PROVIDERS, GOOGLE_EMAIL_DOMAIN_ALLOWED } =
  getServerConfig();

export const initSSOProviders = () => {
  return ENABLE_OAUTH_SSO
    ? SSO_PROVIDERS.split(/[,，]/).map((provider) => {
        const validProvider = ssoProviders.find((item) => item.id === provider);

        if (validProvider) return validProvider.provider;

        throw new Error(`[NextAuth] provider ${provider} is not supported`);
      })
    : [];
};

const nextAuth = NextAuth({
  callbacks: {
    // Note: Data processing order of callback: authorize --> jwt --> session
    async jwt({ token, account }) {
      // Auth.js will process the `providerAccountId` automatically
      // ref: https://authjs.dev/reference/core/types#provideraccountid
      if (account) {
        token.userId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Pick userid from token
      if (session.user) {
        session.user.id = (token.userId ?? session.user.id) as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return Boolean(
          profile?.email_verified && profile?.email?.endsWith(GOOGLE_EMAIL_DOMAIN_ALLOWED),
        );
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
  providers: initSSOProviders(),
  secret: NEXTAUTH_SECRET,
  trustHost: true,
});

export const {
  handlers: { GET, POST },
  auth,
} = nextAuth;

declare module '@auth/core/jwt' {
  // Returned by the `jwt` callback and `auth`, when using JWT sessions
  interface JWT {
    userId?: string;
  }
}
