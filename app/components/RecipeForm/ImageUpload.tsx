import { useTranslation } from 'react-i18next';

import Form from '~/components/ui/Form';
import Button from '../ui/Button';

import {
  PLACEHOLDER_IMAGE_URL,
  MAX_UPLOAD_SIZE,
  UPLOAD_WARN_SIZE,
} from '~/utils/constants';
import { useState } from 'react';

function formatSize(bytes: number) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];

  let exp = 0;
  while (bytes >= 1024 && exp < units.length) {
    bytes /= 1024;
    exp++;
  }

  return `${bytes.toFixed(bytes < 100 ? 1 : 0)}${units[exp]}`;
}

interface ImageUploadProps {
  imageUrl: string | null;
  defaultImageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;

  imageClassName?: string;
}

export default function ImageUpload({
  imageUrl,
  defaultImageUrl,
  setImageUrl,
  imageClassName,
}: ImageUploadProps) {
  const [sizeError, setSizeError] = useState<number | null>(null);
  const [sizeWarning, setSizeWarning] = useState<number | null>(null);

  const { t } = useTranslation();

  const onUploadImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files ? ev.target.files[0] : null;
    if (file) {
      if (file.size > MAX_UPLOAD_SIZE) {
        setSizeError(file.size);
        ev.target.value = ''; // Delete file
        setImageUrl(null); // Remove URL
      } else {
        setSizeError(null);
        setSizeWarning(file.size > UPLOAD_WARN_SIZE ? file.size : null);
        setImageUrl(URL.createObjectURL(file));
      }
    }
  };

  return (
    <>
      <img
        src={imageUrl ?? defaultImageUrl ?? PLACEHOLDER_IMAGE_URL}
        alt=" "
        className={
          imageClassName ??
          'aspect-video w-full object-cover rounded-md sm:aspect-square'
        }
      />

      <Button
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const target = ev.target as HTMLButtonElement;
          (target.nextSibling as HTMLInputElement).click();
        }}
      >
        {t('recipe:form.fields.image.upload')}
      </Button>

      <Form.Input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        className="hidden"
        onChange={onUploadImage}
      />
      {sizeError !== null ? (
        <p className="text-xs text-danger-high">
          {t('recipe:form.validation.image.size-error', {
            size: formatSize(sizeError),
            max: formatSize(MAX_UPLOAD_SIZE),
          })}
        </p>
      ) : null}

      {sizeWarning !== null ? (
        <p className="text-xs text-warn-high">
          {t('recipe:form.validation.image.size-warning', {
            size: formatSize(sizeWarning),
            max: formatSize(UPLOAD_WARN_SIZE),
          })}
        </p>
      ) : null}
      <Form.Error name="image" id="image" />
    </>
  );
}
