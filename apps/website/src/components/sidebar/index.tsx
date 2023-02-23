import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { observer, useObserver } from 'rosma';
import { sidebar } from './data';
import { useRouter } from 'next/router';
import { SideBarItem, SideBarList, StyledSidebar } from './styled';

export default function Sidebar() {
  const ref = useRef<HTMLDivElement>();
  const { pathname } = useRouter();
  const { translate, isSidebarActive, setIsSidebarActive } = useObserver();

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleresize);

    function handleClickOutside(event) {
      if (!ref.current?.contains?.(event.target)) {
        setIsSidebarActive(false);
      }
    }

    function handleresize() {
      if (observer.get('isSidebarActive')) setIsSidebarActive(false);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleresize);
    };
  }, []);

  return (
    <StyledSidebar ref={ref} active={String(!!isSidebarActive)}>
      <SideBarList>
        {sidebar.map((item, index) => (
          <SideBarItem key={index} active={String(item.path === pathname)}>
            <Link href={item.path}>{translate(item.name)}</Link>
          </SideBarItem>
        ))}
      </SideBarList>
    </StyledSidebar>
  );
}
