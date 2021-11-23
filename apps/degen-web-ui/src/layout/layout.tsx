import Header from './header';
import GridRow from './grid-row';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="container px-4 mx-auto">
        <GridRow>{children}</GridRow>
      </main>
    </>
  );
}
