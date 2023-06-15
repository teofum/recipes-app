interface EmailTemplateProps {
  resetCode: string;
}

export const ResetPasswordEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ resetCode }) => (
  <div className="text-center font-sans">
    <h1 className="text-2xl">Your one-time reset code</h1>
    <p>
      Use this code to sign in and reset your password. It will expire in 15
      minutes.
    </p>
    <div className="text-2xl">{resetCode}</div>
    <p>If you didn't request this code, you can ignore this email.</p>
  </div>
);
