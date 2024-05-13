import GoogleProvider from 'next-auth/providers/google';

import { authEnv } from '@/config/auth';

const provider = {
  id: 'google',
  provider: GoogleProvider({
    // Specify auth scope, at least include 'openid email'
    // authorization: { params: { scope: 'read:user user:email' } },
    clientId: authEnv.GOOGLE_CLIENT_ID,
    clientSecret: authEnv.GOOGLE_CLIENT_SECRET,
  }),
};

export default provider;
