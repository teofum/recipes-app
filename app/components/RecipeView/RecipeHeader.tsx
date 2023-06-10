import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { LinkButton } from '../ui/Button';

interface RecipeHeaderProps {
  imageUrl?: string;
  hideBackButton?: boolean;
}

export default function RecipeHeader({
  imageUrl,
  hideBackButton = false,
}: RecipeHeaderProps) {
  return (
    <div
      className="
        relative w-full h-64 -mb-40 py-6 sm:px-6
        bg-surface overflow-hidden border-b
      "
    >
      <img
        src={imageUrl}
        alt="background"
        className="bg-blur opacity-50 mix-blend-hard-light"
      />

      {!hideBackButton ? (
        <div className="relative responsive">
          <LinkButton
            to="/recipes"
            className="w-max"
            variant={{ color: 'neutral' }}
          >
            <ArrowLeftIcon /> Back to recipes
          </LinkButton>
        </div>
      ) : null}
    </div>
  );
}
