import styles from './index.module.scss';
import { Hero } from '../src/home/hero';
import { GridContainer } from '../src/layout/grid-container';

export default function Index() {
  return (
    <>
      <GridContainer className="py-6">
        <Hero></Hero>
      </GridContainer>
    </>
  );
}
