import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Button, Box, useColorMode, Tooltip, Avatar } from '@chakra-ui/react';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { SessionStatus } from '../../../core/enums/auth.enums';
import { AuthButton } from '../auth/auth-button';

export function Header() {
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      className={classNames([
        'min-w-full',
        ...(colorMode === 'dark'
          ? ['bg-opacity-20', 'bg-black']
          : ['bg-opacity-75', 'bg-gray-50']),
      ])}
    >
      <Box className="container px-3 py-4 mx-auto flex items-center">
        {/* <Box className="w-8 h-8 rounded-full bg-gray-500 mr-3"></Box> */}
        <Avatar size="sm" src="/bankless-dao.jpg" className="mx-3" />

        <NextLink href={'/'} passHref>
          <Button variant="ghost" className="mx-1">
            DEGEN
          </Button>
        </NextLink>

        <NextLink href={'/commands'} passHref>
          <Button variant="ghost" className="mx-1">
            Commands
          </Button>
        </NextLink>

        {status === SessionStatus.Authenticated ? (
          <NextLink href={'/dashboard'} passHref>
            <Button variant="ghost" className="mx-1">
              Dashboard
            </Button>
          </NextLink>
        ) : null}

        <span className="flex-grow"></span>

        <Tooltip label="Toggle Dark Mode">
          <Button onClick={toggleColorMode} className="mx-1">
            {colorMode === 'light' ? <MoonIcon></MoonIcon> : <SunIcon></SunIcon>}
          </Button>
        </Tooltip>

        <AuthButton></AuthButton>
      </Box>
    </Box>
  );
}
