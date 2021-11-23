import Header from './header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-3">{children}</main>
    </>
  );
}
