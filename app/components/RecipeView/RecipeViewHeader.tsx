import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link } from '@remix-run/react';

interface RecipeViewHeaderProps {
  imageUrl?: string;

}

export default function RecipeViewHeader({ imageUrl }: RecipeViewHeaderProps) {
  return (
    <div
      className="
        relative w-full aspect-video
        bg-stone-900 overflow-hidden
        border-b border-black border-opacity-20
        max-h-64 -mb-40 p-6
      "
    >
      <img
        src={imageUrl}
        alt="background"
        className="bg-blur opacity-50 mix-blend-hard-light"
      />

      <Link to="/recipes" className="relative text-white flex items-center gap-1">
        <ArrowLeftIcon /> Back to recipes
      </Link>
    </div>
  );
}
