import HeaderMenu from './Menu';
import HeaderUserbox from './Userbox';

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

// Minimal flat header: no shadow, single hairline border, 52px tall.
// Active nav state lives on a sliding underline rendered by Menu.
const Header = (_props: HeaderProps) => {
  return (
    <header className="sticky top-0 z-[1] shrink-0 h-[52px] bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between px-4 md:px-6 font-poppins">
      <HeaderMenu />
      <HeaderUserbox />
    </header>
  );
};

export default Header;
