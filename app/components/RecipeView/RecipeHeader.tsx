import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { LinkButton } from '../ui/Button';

interface RecipeViewHeaderProps {
  imageUrl?: string;
}

export default function RecipeViewHeader({ imageUrl }: RecipeViewHeaderProps) {
  return (
    <div
      className="
        relative w-full aspect-video
        bg-stone-900 overflow-hidden
        max-h-64 -mb-40 p-6
      "
    >
      <img
        src={imageUrl}
        alt="background"
        className="bg-blur opacity-50 mix-blend-hard-light"
      />

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
    </div>
  );
}
