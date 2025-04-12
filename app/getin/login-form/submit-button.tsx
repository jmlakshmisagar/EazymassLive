import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner size="small" className="mr-2" />
          <span>Logging in...</span>
        </div>
      ) : (
        "Get In"
      )}
    </Button>
  );
}