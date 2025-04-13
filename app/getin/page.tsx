'use client';

import { useState, useEffect } from 'react';
import { ErrorBoundary } from "@/components/error-boundary";
import { LoginPageLayout } from "./components/LoginPageLayout";
import { useLoginHandlers } from "./hooks/useLoginHandlers";

export default function LoginPage() {
    const [isMounted, setIsMounted] = useState(false);
    const handlers = useLoginHandlers();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <ErrorBoundary>
            <LoginPageLayout
                isLoading={handlers.isLoading}
                email={handlers.email}
                setEmail={handlers.setEmail}
                password={handlers.password}
                setPassword={handlers.setPassword}
                onSubmit={(e, email, password) => handlers.handleEmailPasswordLogin(e, email, password)}
                onGoogleLogin={handlers.handleGoogleLogin}
                onFacebookLogin={handlers.handleFacebookLogin}
                onGithubLogin={handlers.handleGithubLogin}
                onMicrosoftLogin={handlers.handleMicrosoftLogin}
                loadingProvider={handlers.loadingProvider}
                showNewUserDialog={handlers.showNewUserDialog}
                showRegistrationDrawer={handlers.showRegistrationDrawer}
                onNewUserConfirmation={handlers.handleNewUserDialogConfirm}
                onRegistrationDrawerClose={handlers.handleRegistrationDrawerClose}
                onRegistration={handlers.handleRegistration}
            />
        </ErrorBoundary>
    );
}
