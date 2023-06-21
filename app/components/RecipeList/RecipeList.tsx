import { Link } from '@remix-run/react';
import { DashboardIcon, ListBulletIcon } from '@radix-ui/react-icons';

import RecipeCard from './RecipeCard';
import RecipeListItem from './RecipeListItem';
import ToggleGroup from '../ui/ToggleGroup';
import type { Recipe } from '~/types/recipe.type';
import { useTranslation } from 'react-i18next';

interface RecipeViewProps {
  recipes: Recipe[];
}

function RecipeGridView({ recipes }: RecipeViewProps) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2 border-t pt-4">
      {recipes.map((recipe, i) => (
        <li
          key={recipe.id}
          className="animate-slideInUp"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <Link to={recipe.id}>
            <RecipeCard recipe={recipe} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function RecipeListView({ recipes }: RecipeViewProps) {
  return (
    <ul className="flex flex-col overflow-hidden">
      {recipes.map((recipe, i) => (
        <li
          key={recipe.id}
          className="animate-slideInLeft border-t last:border-b"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <Link to={recipe.id}>
            <RecipeListItem recipe={recipe} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

type RecipeListProps = {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  title?: React.ReactNode;
} & RecipeViewProps;

export default function RecipeList({
  recipes,
  viewMode,
  onViewModeChange,
  title,
}: RecipeListProps) {
  const { t } = useTranslation();

  const ViewComponent = viewMode === 'grid' ? RecipeGridView : RecipeListView;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center">
        {title}

        <ToggleGroup.Root
          type="single"
          variant={{ type: 'icon', size: 'lg', style: 'outlined' }}
          value={viewMode}
          onValueChange={onViewModeChange}
          className="ml-auto"
        >
          <ToggleGroup.Item value="grid">
            <DashboardIcon />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="list">
            <ListBulletIcon />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      {recipes.length > 0 ? (
        <ViewComponent recipes={recipes} />
      ) : (
        <p>{t('recipe:list.empty')}</p>
      )}
    </div>
  );
}
