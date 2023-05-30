type NavbarProps = React.PropsWithChildren<{}>;

export default function Navbar({ children }: NavbarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="font-display text-4xl text-center">
        Cook
        <span className="text-green-700">Book</span>
      </div>

      <div className="mt-auto pt-6 border-t border-black border-opacity-20">
        {children}
      </div>
    </div>
  );
}
