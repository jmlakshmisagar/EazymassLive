import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmailInputProps } from "./types";

export function EmailInput({ email, setEmail, isLoading, error }: EmailInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="name@eazymass.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}