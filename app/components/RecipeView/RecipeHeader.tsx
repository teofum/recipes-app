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
        bg-stone-900 overflow-hidden
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
            className="
            w-max bg-transparent text-white hover:text-white
            hover:bg-white hover:bg-opacity-20
            focus-visible:bg-white focus-visible:bg-opacity-20 focus-visible:text-white
          "
          >
            <ArrowLeftIcon /> Back to recipes
          </LinkButton>
        </div>
      ) : null}
    </div>
  );
}
