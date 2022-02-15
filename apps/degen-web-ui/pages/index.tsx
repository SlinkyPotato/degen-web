import { Hero } from '../src/home/hero';
import React, { useEffect, useRef, useState } from 'react';
import { GridContainer } from '../src/shared/components/layout/grid-container';
import { Box, useColorMode } from '@chakra-ui/react';
import * as THREE from 'three';
import EFFECT from 'vanta/dist/vanta.waves.min';

export default function Index() {
  const { colorMode } = useColorMode();
  const [vantaEffect, setVantaEffect] = useState(0);
  const [vantaColor, setVantaColor] = useState(null);
  const vantaRef = useRef(null);

  const vantaContainerStyles = {
    width: '100vw',
    height: '500px',
    position: 'relative' as any,
    top: '-72px',
    paddingTop: '72px',
    zIndex: '-1',
  };

  useEffect(() => {
    if (!vantaEffect || colorMode !== vantaColor) {
      if (vantaEffect) (vantaEffect as any).destroy();
      setVantaColor(colorMode);
      setVantaEffect(
        EFFECT({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: false,
          gyroControls: false,
          color: colorMode === 'dark' ? 0x1a202c : 0xa0aec0,
          shininess: 10,
          waveHeight: 15,
          waveSpeed: 0.2,
          zoom: 2,
        })
      );
    }
    return () => {
      if (vantaEffect) (vantaEffect as any).destroy();
    };
  }, [vantaEffect, colorMode]);

  return (
    <>
      <Box ref={vantaRef} style={vantaContainerStyles}>
        <GridContainer className="py-6">
          <Hero></Hero>
        </GridContainer>
      </Box>
    </>
  );
}
