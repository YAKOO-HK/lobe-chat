import GoogleProvider from 'next-auth/providers/google';

import { getServerConfig } from '@/config/server';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = getServerConfig();

const provider = {
  id: 'google',
  provider: GoogleProvider({
    // Specify auth scope, at least include 'openid email'
    // authorization: { params: { scope: 'read:user user:email' } },
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
  }),
};

export default provider;
