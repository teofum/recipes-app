interface AvatarProps {
  src: string;
  alt: string;
}

export default function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="w-10 h-10 border-2 border-green-500 rounded-full p-[2px]">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}
