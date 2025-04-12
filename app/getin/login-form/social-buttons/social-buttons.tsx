import { GoogleButton } from './google-button';
import { MicrosoftButton } from './microsoft-button';
import { FacebookButton } from './facebook-button';
import { GithubButton } from './github-button';

interface SocialButtonsProps {
  onGoogleLogin: () => void;
  onMicrosoftLogin: () => void;
  onFacebookLogin: () => void;
  onGithubLogin: () => void;
  loadingProvider: string | null;
}

export function SocialButtons({
  onGoogleLogin,
  onMicrosoftLogin,
  onFacebookLogin,
  onGithubLogin,
  loadingProvider
}: SocialButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <GoogleButton 
        onClick={onGoogleLogin}
        isLoading={loadingProvider === 'google'}
        disabled={loadingProvider !== null}
      />
      <MicrosoftButton
        onClick={onMicrosoftLogin}
        isLoading={loadingProvider === 'microsoft'}
        disabled={loadingProvider !== null}
      />
      <FacebookButton
        onClick={onFacebookLogin}
        isLoading={loadingProvider === 'facebook'}
        disabled={loadingProvider !== null}
      />
      <GithubButton
        onClick={onGithubLogin}
        isLoading={loadingProvider === 'github'}
        disabled={loadingProvider !== null}
      />
    </div>
  );
}