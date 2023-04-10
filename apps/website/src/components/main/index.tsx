import Link from '@/components/link';
import { useRouter } from 'next/router';
import { sidebar } from '../sidebar/data';
import { useObserver } from 'rosma';
import { SidebarItem } from '../sidebar';
import {
  DocsPage,
  DocsPagination,
  StyledMain,
  StyledDoc,
  DocsPageTitle,
} from './styled';

export default function Mian({ children }) {
  return (
    <StyledMain>
      <StyledDoc className="markdown">{children}</StyledDoc>
      <Pagination />
    </StyledMain>
  );
}

function Pagination() {
  const { pathname } = useRouter();
  const { translate } = useObserver();
  const array = flatSidebar(sidebar);
  const index = array.findIndex(({ path }) => pathname == path);
  const next = array[index + 1];
  const previous = array[index - 1];

  return index >= 0 ? (
    <DocsPagination>
      <DocsPage>
        {previous && (
          <>
            <DocsPageTitle>{translate('Previous')}: </DocsPageTitle>
            <Link href={previous.path}>{translate(previous.name)}</Link>
          </>
        )}
      </DocsPage>
      <DocsPage>
        {next && (
          <>
            <DocsPageTitle>{translate('Next')}: </DocsPageTitle>
            <Link href={next.path}>{translate(next.name)}</Link>
          </>
        )}
      </DocsPage>
    </DocsPagination>
  ) : null;
}

function flatSidebar(items: Array<SidebarItem>) {
  let array = [];

  items.forEach((item) => {
    if (Array.isArray(item.items)) {
      array = array.concat(flatSidebar(item.items));
    } else {
      array.push(item);
    }
  });

  return array;
}
