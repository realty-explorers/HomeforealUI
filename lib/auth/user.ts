import axios from 'axios';

const getUser = async (userId: string, token: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/user/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

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
};

const getUserByEmail = async (email: string, token: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user/email/${email}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

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
};

const createUser = async (
  userId: string,
  userEmail: string,
  source: string,
  token: string
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/v1/user`;
    const response = await axios.post(
      url,
      {
        userId,
        email: userEmail,
        source
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

export { getUser, createUser, getUserByEmail };
