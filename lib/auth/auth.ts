import axios from 'axios';

const singinUser = async (email: string, password: string) => {
  const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/signin`;
  const response = await axios.post(url, {
    username: email,
    password
  });
  return response.data;
};

const signupUser = async (email: string, password: string) => {
  const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/signup`;
  const response = await axios.post(url, {
    email,
    password
  });
  return response.data;
};

const confirmUser = async (username: string, code: string) => {
  const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/confirm`;
  const response = await axios.post(url, {
    username,
    code
  });
  return response.data;
};

const forgotPassword = async (email: string) => {
  const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/forgot-password`;
  const response = await axios.post(url, {
    email
  });
  return response.data;
};

const confirmForgotPassword = async (
  username: string,
  code: string,
  newPassword: string
) => {
  const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/confirm-forgot-password`;
  const response = await axios.post(url, {
    username,
    code,
    newPassword
  });
  return response.data;
};

const authenticateProjoUser = async (email: string, token: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/cognito-authenticate`;
    const response = await axios.post(
      url,
      {
        email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  singinUser,
  signupUser,
  confirmUser,
  forgotPassword,
  confirmForgotPassword,
  authenticateProjoUser
};
