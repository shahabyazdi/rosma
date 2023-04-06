import { useCallback, useEffect, useRef } from 'react';
import Link from '@/components/link';
import { observer, useObserver } from 'rosma';
import { sidebar } from './data';
import { useRouter } from 'next/router';
import { SideBarItem, SideBarList, StyledSidebar } from './styled';
import useClickOutside from '../../hooks/use_click_outside';

export type SidebarItem = {
  name: string;
  path?: string;
  items?: Array<SidebarItem>;
};

type ItemsProps = {
  translate: (string: string) => string;
  items?: Array<SidebarItem>;
};

export default function Sidebar() {
  const ref = useRef<HTMLDivElement>();
  const { translate, isSidebarActive, setIsSidebarActive } = useObserver();

  const closeSidebar = useCallback(() => {
    if (observer.get('isSidebarActive')) setIsSidebarActive(false);
  }, []);

  useClickOutside(ref, closeSidebar);

  useEffect(() => {
    window.addEventListener('resize', closeSidebar);

    return () => window.removeEventListener('resize', closeSidebar);
  }, []);

  return (
    <StyledSidebar ref={ref} active={String(!!isSidebarActive)}>
      <Items translate={translate} items={sidebar} />
    </StyledSidebar>
  );
}

function Items({ translate, items = [] }: ItemsProps) {
  const { pathname } = useRouter();

  return (
    <SideBarList>
      {items.map((item, index) => {
        const name = translate(item.name);

        return (
          <SideBarItem key={index} active={String(pathname === item.path)}>
            {Array.isArray(item.items) ? (
              <>
                <span style={{ cursor: 'default' }}>{name}</span>
                <Items translate={translate} items={item.items} />
              </>
            ) : (
              <Link href={item.path}>{name}</Link>
            )}
          </SideBarItem>
        );
      })}
    </SideBarList>
  );
}
