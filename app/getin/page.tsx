'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from "@/components/error-boundary";
import { LoginPageLayout } from "./components/LoginPageLayout";
import { useLoginHandlers } from "./hooks/useLoginHandlers";

export default function LoginPage() {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const handlers = useLoginHandlers();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent, email: string, password: string) => {
        const userId = await handlers.handleEmailPasswordLogin(e, email, password);
        if (userId) {
            router.push(`/board`);
        }
    };

    const handleRegistration = async (data: { name: string; photoURL?: string; dateOfBirth: string; }) => {
        const userId = await handlers.handleRegistration(data);
        if (userId) {
            router.push(`/board`);
        }
    };

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
                onSubmit={handleLogin}
                onGoogleLogin={handlers.handleGoogleLogin}
                onFacebookLogin={handlers.handleFacebookLogin}
                onGithubLogin={handlers.handleGithubLogin}
                onMicrosoftLogin={handlers.handleMicrosoftLogin}
                loadingProvider={handlers.loadingProvider}
                showNewUserDialog={handlers.showNewUserDialog}
                showRegistrationDrawer={handlers.showRegistrationDrawer}
                onNewUserConfirmation={handlers.handleNewUserDialogConfirm}
                onRegistrationDrawerClose={handlers.handleRegistrationDrawerClose}
                onRegistration={handleRegistration}
            />
        </ErrorBoundary>
    );
}
