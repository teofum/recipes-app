type NavbarProps = React.PropsWithChildren<{}>;

export default function Navbar({ children }: NavbarProps) {
  return (
    <div className="flex flex-col h-full">
      <h1 className="font-display text-4xl text-center">
        Cook
        <span className="text-green-700">Book</span>
      </h1>

      <div className="mt-auto pt-6 border-t border-black border-opacity-20">
        {children}
      </div>
    </div>
  );
}
