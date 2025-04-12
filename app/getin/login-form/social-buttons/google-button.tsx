import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import "bootstrap-icons/font/bootstrap-icons.css";

interface GoogleButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function GoogleButton({ onClick, isLoading, disabled }: GoogleButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
      {isLoading ? (
        <div className="flex items-center">
          <Spinner size="small" className="mr-2" />
          <span>Getting in...</span>
        </div>
      ) : (
        <>
          <i className="bi bi-google mr-2 text-sm text-foreground"></i>
          <span>Google</span>
        </>
      )}
    </Button>
  );
}