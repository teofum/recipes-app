import { useTranslation } from 'react-i18next';

import Form from '~/components/ui/Form';
import Button from '../ui/Button';

import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';

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
  const { t } = useTranslation();

  const onUploadImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files ? ev.target.files[0] : null;
    if (file) setImageUrl(URL.createObjectURL(file));
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
        className="hidden"
        onChange={onUploadImage}
      />
      <Form.Error name="image" id="image" />
    </>
  );
}
