import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function CustomSignIn() {
  return (
    <div className="custom-auth-form">
      <h1>Welcome to My App new user!</h1>

      {/* Custom Email/Password Form */}

      {/* Social Login Buttons */}
      <button
        onClick={() =>
          signIn('cognito', {
            identity_provider: 'Google'
          })
        }
      >
        Continue with Google
      </button>
    </div>
  );
}
