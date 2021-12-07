import { Hero } from '../src/home/hero';
import React from 'react';
import { GridContainer } from '../src/shared/components/layout/grid-container';

export default function Index() {
  return (
    <>
      <GridContainer className="py-6">
        <Hero></Hero>
      </GridContainer>
    </>
  );
}
