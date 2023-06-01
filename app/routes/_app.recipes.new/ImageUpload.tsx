import Button from '~/components/ui/Button';
import { PLACEHOLDER_IMAGE_URL } from './constants';
import Form from '~/components/ui/Form';

interface ImageUploadProps {
  imageUrl?: string;
  openFile?: () => void;
}

export default function ImageUpload({ imageUrl, openFile }: ImageUploadProps) {
  return (
    <div
      className="
        card flex flex-col gap-4
        sm:w-full sm:col-start-2 sm:row-span-2
      "
    >
      <img
        src={imageUrl || PLACEHOLDER_IMAGE_URL}
        alt=" "
        className="aspect-video object-cover rounded-md sm:aspect-square"
      />

      <Form.Input
        type="hidden"
        name="imageUrl"
        id="imageUrl"
        value={imageUrl}
      />
      <Button onClick={openFile}>Upload image</Button>
    </div>
  );
}
