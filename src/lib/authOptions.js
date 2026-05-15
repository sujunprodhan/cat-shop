import { loginUser } from '@/actions/server/auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { Collection, dbConnect } from './dbConnect';
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        // email: { label: 'Email', type: 'email' },
        // password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        const user = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log({ user, account, profile, email, credentials });
      const isExist = await dbConnect(Collection.USERS).findOne({
        email: user.email,
        provider: account?.provider,
      });
      if (isExist) {
        return true;
      }
      const newUser = {
        provider: account?.provider,
        name: user.name,
        email: user.email,
        image: user.image,
        role: 'user',
      };
      const result = await dbConnect(Collection.USERS).insertOne(newUser);
      return result.acknowledged;
      // return true;
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session, token, user }) {
      if (token) {
        session.role = token?.role;
        session.email = token?.email;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('account data in token', account);

      if (user) {
        if (account.provider == 'google') {
          const dbUser = await dbConnect(Collection.USERS).findOne({
            email: user.email,
          });
          token.role = dbUser?.role || 'user';
          token.email = dbUser?.email;
        } else {
          token.role = user?.role;
          token.email = user?.email;
        }
      }
      return token;
    },
  },
};
