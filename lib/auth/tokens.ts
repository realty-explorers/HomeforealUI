import axios from 'axios';

async function refreshAccessToken(token) {
  try {
    console.log('Refreshing access token');
    const url = `${process.env.COGNITO_DOMAIN}/oauth2/token`;

    const params = new URLSearchParams({
      client_id: process.env.COGNITO_CLIENT_ID,
      client_secret: process.env.COGNITO_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken
    });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: params
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      // Cognito doesn't always return a new refresh token
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

async function updateRefreshToken(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/refresh-token`;
    const response = await axios.put(
      url,
      {
        refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    console.log('Refresh token updated');

    return response.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 404) {
      console.log('User not found');
    } else {
      console.error('Error calling get user API:', error);
    }
    return null;
  }
}

export { refreshAccessToken, updateRefreshToken };
