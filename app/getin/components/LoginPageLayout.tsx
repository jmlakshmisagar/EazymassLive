import { LoginForm } from "../login-form";
import GetInDialog from "./GetInDialog";  
import { RegistrationDrawer } from "./RegistrationDrawer";
import type { LoginPageLayoutProps } from "../types";
import { type FormEvent } from "react";

export function LoginPageLayout({
  isLoading = false,
  email = "",
  setEmail,
  password = "",
  setPassword,
  onSubmit,
  onGoogleLogin,
  onFacebookLogin,
  onGithubLogin,
  onMicrosoftLogin,
  loadingProvider = null,
  showNewUserDialog = false,
  showRegistrationDrawer = false,
  onNewUserConfirmation,
  onRegistrationDrawerClose,
  onRegistration,
}: LoginPageLayoutProps) {
  const handleFormSubmit = async (e: FormEvent) => {
    try {
      await onSubmit(e, email, password);
    } catch (error) {
      console.error("Login error:", error);
      // You can add toast notification here if needed
    }
  };

  const handleRegistration = async (data: unknown) => {
    try {
      await onRegistration(data);
    } catch (error) {
      console.error("Registration error:", error);
      // You can add toast notification here if needed
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-1">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              isLoading={isLoading}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={handleFormSubmit}
              onGoogleLogin={onGoogleLogin}
              onFacebookLogin={onFacebookLogin}
              onGithubLogin={onGithubLogin}
              onMicrosoftLogin={onMicrosoftLogin}
              loadingProvider={loadingProvider}
            />
          </div>
        </div>
      </div>

      <GetInDialog
        isOpen={showNewUserDialog}
        onClose={() => onNewUserConfirmation(false)}
        onConfirm={() => onNewUserConfirmation(true)}
      />

      <RegistrationDrawer
        isOpen={showRegistrationDrawer}
        onClose={onRegistrationDrawerClose}
        onSubmit={handleRegistration}
      />
    </div>
  );
}