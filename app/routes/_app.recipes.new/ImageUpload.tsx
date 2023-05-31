import { PLACEHOLDER_IMAGE_URL } from "./constants";

interface ImageUploadProps {
  imageUrl?: string;
  openFile?: () => void;
}

export default function ImageUpload({ imageUrl, openFile }: ImageUploadProps) {
  return (
    <img
      src={imageUrl || PLACEHOLDER_IMAGE_URL}
      alt="recipe"
      className="
        aspect-video object-cover
        rounded-xl
        outline outline-4 outline-stone-100
        sm:w-full sm:col-start-2 sm:row-span-2 sm:aspect-square
        md:rounded-3xl
      "
      onClick={openFile}
    />
  );
}
