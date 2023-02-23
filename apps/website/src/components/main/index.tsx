import Link from 'next/link';
import { useRouter } from 'next/router';
import { sidebar } from '../sidebar/data';
import { useObserver } from 'rosma';
import { DocsPage, DocsPagination, StyledMain, StyledDoc } from './styled';

export default function Mian({ children }) {
  return (
    <StyledMain>
      <StyledDoc>{children}</StyledDoc>
      <Pagination />
    </StyledMain>
  );
}

function Pagination() {
  const { pathname } = useRouter();
  const { translate } = useObserver();
  const index = sidebar.findIndex(({ path }) => pathname == path);
  const next = sidebar[index + 1];
  const previous = sidebar[index - 1];

  return index >= 0 ? (
    <DocsPagination>
      <DocsPage>
        {previous && (
          <>
            {translate('Previous')}:{' '}
            <Link href={previous.path}>{translate(previous.name)}</Link>
          </>
        )}
      </DocsPage>
      <DocsPage>
        {next && (
          <>
            {translate('Next')}:{' '}
            <Link href={next.path}>{translate(next.name)}</Link>
          </>
        )}
      </DocsPage>
    </DocsPagination>
  ) : null;
}
