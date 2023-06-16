import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

import { LinkButton } from '../ui/Button';

interface RecipeHeaderProps {
  imageUrl?: string;
  hideBackButton?: boolean;
}

export default function RecipeHeader({
  imageUrl,
  hideBackButton = false,
}: RecipeHeaderProps) {
  const { t } = useTranslation();

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
        className="bg-blur opacity-30 saturate-[1.25] brightness-150"
      />

      {!hideBackButton ? (
        <div className="relative responsive">
          <LinkButton
            to="/recipes"
            className="w-max"
            variant={{ color: 'neutral' }}
          >
            <ArrowLeftIcon /> {t('recipe:view.back')}
          </LinkButton>
        </div>
      ) : null}
    </div>
  );
}
