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
    username: email
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
    confirmationCode: code,
    newPassword
  });
  return response.data;
};

const authenticateReferredUser = async (referral: string, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/authenticate-referred-user`;
  const response = await axios.post(url, {
    referral,
    token
  });
  return response.data;
};

export {
  singinUser,
  signupUser,
  confirmUser,
  forgotPassword,
  confirmForgotPassword,
  authenticateReferredUser
};
