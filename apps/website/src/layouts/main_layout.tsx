import Sidebar from '@/components/sidebar';
import Navbar from '@/components/navbar';
import Main from '@/components/main';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Main>{children}</Main>
    </>
  );
}
