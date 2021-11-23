import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import SignIn from './signin';

export default function Header() {
  return (
    <div className="container px-3 py-4 mx-auto flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-500 mr-3"></div>

      <NextLink href={'/'} passHref>
        <Button variant="ghost">Home</Button>
      </NextLink>

      <NextLink href={'/commands'} passHref>
        <Button variant="ghost">Commands</Button>
      </NextLink>

      <span className="flex-grow"></span>

      <SignIn></SignIn>
    </div>
  );
}
