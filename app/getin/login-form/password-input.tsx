import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PasswordInputProps } from "./types";

export function PasswordInput({ password, setPassword, isLoading, error }: PasswordInputProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        <a
          href="#"
          className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
        >
          Forgot your password?
        </a>
      </div>
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}