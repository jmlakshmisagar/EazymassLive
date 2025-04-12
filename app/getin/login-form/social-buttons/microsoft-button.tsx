import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import "bootstrap-icons/font/bootstrap-icons.css";

interface MicrosoftButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function MicrosoftButton({ onClick, isLoading, disabled }: MicrosoftButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
      {isLoading ? (
        <div className="flex items-center">
          <Spinner size="small" className="mr-2" />
          <span>Getting in...</span>
        </div>
      ) : (
        <>
          <i className="bi bi-microsoft mr-2 text-sm text-black dark:text-white"></i>
          <span>Microsoft</span>
        </>
      )}
    </Button>
  );
}