import { signIn } from 'next-auth/react';

export default function CustomSignIn() {
  return (
    <div className="custom-auth-form">
      <h1>Welcome to My App</h1>

      {/* Custom Email/Password Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn('cognito', {}); // Triggers Cognito flow without hosted UI
        }}
      >
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>

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
