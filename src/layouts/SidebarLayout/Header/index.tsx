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
    <header className="sticky top-0 z-[1] shrink-0 h-[52px] bg-white/95 backdrop-blur-sm shadow-[0_1px_3px_-1px_rgba(15,23,42,0.06),_0_4px_16px_-4px_rgba(15,23,42,0.08)] flex items-center justify-between px-4 md:px-6 font-poppins">
      <HeaderMenu />
      <HeaderUserbox />
    </header>
  );
};

export default Header;
