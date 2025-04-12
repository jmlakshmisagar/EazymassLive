"use client";

import { cn } from "@/lib/utils";
import { FormHeader } from "./form-header";
import { EmailInput } from "./email-input";
import { PasswordInput } from "./password-input";
import { SubmitButton } from "./submit-button";
import { Divider } from "./divider";
import { SocialButtons } from "./social-buttons";
import type { LoginFormProps } from "./types";
import { useState } from "react";

export function LoginForm({
  className,
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onGoogleLogin,
  onFacebookLogin,
  onGithubLogin,
  onMicrosoftLogin,
  loadingProvider,
  ...props
}: LoginFormProps) {
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(e, email, password);
    } catch (error) {
      setErrors({
        password: "Invalid email or password"
      });
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FormHeader />
        <div className="grid gap-6">
          <EmailInput 
            email={email} 
            setEmail={setEmail} 
            isLoading={isLoading}
            error={errors.email}
          />
          <PasswordInput 
            password={password} 
            setPassword={setPassword} 
            isLoading={isLoading}
            error={errors.password}
          />
          <SubmitButton isLoading={isLoading} />
          <Divider />
          <SocialButtons
            onGoogleLogin={onGoogleLogin}
            onFacebookLogin={onFacebookLogin}
            onGithubLogin={onGithubLogin}
            onMicrosoftLogin={onMicrosoftLogin}
            loadingProvider={loadingProvider}
          />
        </div>
      </form>
    </div>
  );
}