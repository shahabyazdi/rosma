import { ReactNode, useState } from 'react';
import locales from '../../locales/locales.json';
import Link, { LinkProps } from 'next/link';
import Github from '../../assets/github';
import NPM from '../../assets/npm';
import { Menu2 } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { StyledNavbar } from './styled';
import { useObserver } from 'rosma';
import { StyledDropdown, StyledDropdownItem } from '../sidebar/styled';

export default function Navbar() {
  const { translate, setIsSidebarActive } = useObserver();

  return (
    <StyledNavbar>
      <Menu2
        className="menu"
        style={{ cursor: 'pointer' }}
        onClick={toggleSidebar}
      />
      <NavbarItem>{translate('Rosma')}</NavbarItem>
      <div style={{ flex: 1 }} />
      <Languages translate={translate} />
      <NavbarItem href="https://github.com/shahabyazdi/rosma" newtab>
        <Github width="30px" height="30px" style={{ marginTop: '8px' }} />
      </NavbarItem>
      <NavbarItem href="https://www.npmjs.com/package/rosma" newtab>
        <NPM width="40px" height="30px" style={{ marginTop: '11px' }} />
      </NavbarItem>
    </StyledNavbar>
  );

  function toggleSidebar(e) {
    e.stopPropagation();
    setIsSidebarActive((prev) => !prev);
  }
}

function NavbarItem({
  href = '/',
  children,
  newtab,
  ...props
}: Omit<LinkProps, 'href'> & {
  children: ReactNode;
  href?: string;
  newtab?: boolean;
}) {
  return newtab ? (
    <a target="_blank" href={href} rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

function Languages({ translate }) {
  const { locale, pathname } = useRouter();
  const [isActive, setIsActive] = useState(false);

  return (
    <div onMouseOver={() => setIsActive(true)} style={{ cursor: 'default' }}>
      {translate(locale)}

      <StyledDropdown
        onMouseLeave={() => setIsActive(false)}
        style={{ visibility: isActive ? 'visible' : 'hidden' }}
      >
        {locales.map((locale, index) => (
          <Link key={index} href={pathname} locale={locale}>
            <StyledDropdownItem>{translate(locale)}</StyledDropdownItem>
          </Link>
        ))}
      </StyledDropdown>
    </div>
  );
}
