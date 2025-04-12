import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import "bootstrap-icons/font/bootstrap-icons.css";

interface FacebookButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function FacebookButton({ onClick, isLoading, disabled }: FacebookButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
      {isLoading ? (
        <div className="flex items-center">
          <Spinner size="small" className="mr-2" />
          <span>Getting in...</span>
        </div>
      ) : (
        <>
          <i className="bi bi-facebook mr-2 text-sm text-black dark:text-white"></i>
          <span>Facebook</span>
        </>
      )}
    </Button>
  );
}