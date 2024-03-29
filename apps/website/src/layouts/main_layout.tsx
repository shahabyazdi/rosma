import Head from 'next/head';
import Sidebar from '@/components/sidebar';
import Navbar from '@/components/navbar';
import Main from '@/components/main';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useObserver } from 'rosma';
import { sidebar } from '@/components/sidebar/data';

const Wrapper = styled.div({
  maxWidth: 1300,
  margin: 'auto',
  position: 'relative',
  height: '100vh',
  overflow: 'hidden',
});

const description = 'Simple and easy-to-use state management for React.';
const keywords =
  'react, state, state management, global state, observer, useObserver, withState';

export default function MainLayout({ children, meta }) {
  const router = useRouter();
  const { translate } = useObserver();
  const sidebarItem = sidebar.find((item) => item.path === router.pathname);

  return (
    <Wrapper>
      <Head>
        <title>
          {`${translate('Rosma')} | ${translate(sidebarItem?.name)}`}
        </title>
        <meta name="description" content={meta.description || description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={meta.description || description}
        />
        <meta
          name="keywords"
          content={meta.keywords?.toLowerCase?.() || keywords}
        />
      </Head>
      <Navbar />
      <Sidebar />
      <Main>{children}</Main>
    </Wrapper>
  );
}
