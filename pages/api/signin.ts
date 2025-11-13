export default async function handler(req, res) {
  const callbackUrl = (req.query.callbackUrl as string) || '';

  try {
    // In v4, we redirect the user rather than returning a response
    res.redirect(
      `/api/auth/signin/cognito?callbackUrl=${encodeURIComponent(callbackUrl)}`
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign in' });
  }
}
