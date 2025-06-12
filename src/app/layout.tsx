import Header from '@/components/partials/header';
import Navbar from '@/components/partials/navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<Readonly<LayoutProps>> = ({ children }) => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <Header />
      <Navbar />
      <section className="flex w-full flex-1 justify-center p-5">
        <div className="w-full max-w-7xl flex-1">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
