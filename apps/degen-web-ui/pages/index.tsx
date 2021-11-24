import styles from './index.module.scss';
import { Hero } from '../src/home/hero';
import { Container } from '../src/layout/container';

export default function Index() {
  return (
    <>
      <Container className="py-6">
        <Hero></Hero>
      </Container>
    </>
  );
}
