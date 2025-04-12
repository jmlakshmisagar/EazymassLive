'use client';

import { ErrorBoundary } from "@/components/error-boundary";
import { LoginPageLayout } from "./components/LoginPageLayout";
import { useLoginHandlers } from "./hooks/useLoginHandlers";

export default function LoginPage() {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    loadingProvider,
    handleGoogleLogin,
    handleFacebookLogin,
    handleGithubLogin,
    handleMicrosoftLogin,
    handleEmailPasswordLogin,
    showNewUserDialog,
    showRegistrationDrawer,
    setShowRegistrationDrawer,
    handleNewUserConfirmation,
    handleRegistration
  } = useLoginHandlers();

  const handleFormSubmit = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();
    await handleEmailPasswordLogin(e, email, password);
  };

  return (
    <ErrorBoundary>
      <LoginPageLayout
        isLoading={isLoading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleFormSubmit}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        onGithubLogin={handleGithubLogin}
        onMicrosoftLogin={handleMicrosoftLogin}
        loadingProvider={loadingProvider}
        showNewUserDialog={showNewUserDialog}
        showRegistrationDrawer={showRegistrationDrawer}
        onNewUserConfirmation={handleNewUserConfirmation}
        onRegistrationDrawerClose={() => setShowRegistrationDrawer(false)}
        onRegistration={handleRegistration}
      />
    </ErrorBoundary>
  );
}
