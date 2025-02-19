import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { authOptions } from './auth/[...nextauth]';

export default async function myApiRoute(req, res) {
  try {
    const token = await getToken({ req });
    const accessToken = token.accessToken;

    res.json({ accessToken });
  } catch (e) {
    res.json({
      error: e.code
    });
  }
  // res.json({ protected: "My Secret", id: accessToken });
}
