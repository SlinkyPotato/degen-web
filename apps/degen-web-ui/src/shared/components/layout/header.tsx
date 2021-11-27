import { Button, Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { SessionStatus } from '../../../core/enums/auth.enums';
import { AuthButton } from '../auth/auth-button';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <Box className="container px-3 py-4 mx-auto flex items-center">
      <Box className="w-8 h-8 rounded-full bg-gray-500 mr-3"></Box>

      <NextLink href={'/'} passHref>
        <Button variant="ghost">Home</Button>
      </NextLink>

      <NextLink href={'/commands'} passHref>
        <Button variant="ghost">Commands</Button>
      </NextLink>

      {status === SessionStatus.Authenticated ? (
        <NextLink href={'/admin'} passHref>
          <Button variant="ghost">Dashboard</Button>
        </NextLink>
      ) : null}

      <span className="flex-grow"></span>

      <AuthButton></AuthButton>
    </Box>
  );
}
