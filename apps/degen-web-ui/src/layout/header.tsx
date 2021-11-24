import { Button, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { SignIn } from './signin';

export function Header() {
  return (
    <Box className="container px-3 py-4 mx-auto flex items-center">
      <Box className="w-8 h-8 rounded-full bg-gray-500 mr-3"></Box>

      <NextLink href={'/'} passHref>
        <Button variant="ghost">Home</Button>
      </NextLink>

      <NextLink href={'/commands'} passHref>
        <Button variant="ghost">Commands</Button>
      </NextLink>

      <span className="flex-grow"></span>

      <SignIn></SignIn>
    </Box>
  );
}
