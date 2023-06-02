import { PersonIcon } from '@radix-ui/react-icons';

interface AvatarProps {
  src?: string;
  alt: string;
}

export default function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="w-10 h-10 border-2 border-green-400 rounded-full p-[2px]">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div
          className="
            w-full h-full rounded-full bg-stone-400
            flex items-center justify-center
          "
        >
          <PersonIcon width={20} height={20} className="text-stone-50" />
        </div>
      )}
    </div>
  );
}
