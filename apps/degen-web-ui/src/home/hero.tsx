import { Text, Link, Box } from '@chakra-ui/react';
import GridRow from '../layout/grid-row';

export default function Hero() {
  return (
    <>
      <GridRow span="full" className="mt-16">
        {/* Hero Text */}
        <Box className="col-span-full md:col-span-6 text-left">
          <Text fontSize="5xl" className="font-bold leading-tight mb-4">
            Manage your crypto community
          </Text>
          <Text fontSize="xl" color="gray.500">
            Automate <Link href="https://poap.vote/">POAP</Link> distribution,
          </Text>
        </Box>

        {/* Hero Image */}
        <Box className="col-span-full md:col-span-6 flex justify-center items-center">
          image placeholder
        </Box>
      </GridRow>
    </>
  );
}
