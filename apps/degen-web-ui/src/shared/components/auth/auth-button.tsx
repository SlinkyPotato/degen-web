import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import NextLink from 'next/link';
import { SessionStatus } from '../../../core/enums/auth.enums';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (session && status === SessionStatus.Authenticated) {
    return (
      <Menu>
        <MenuButton pr="3">
          <Button as={Box} variant="outline" className="flex items-center">
            <Avatar size="2xs" src={session.user?.image || ''} />
            <Text fontWeight="bold" className="mx-2">
              {session.user?.name}
            </Text>
            <ChevronDownIcon></ChevronDownIcon>
          </Button>
        </MenuButton>
        <MenuList zIndex="dropdown">
          <NextLink href={'/dashboard'} passHref>
            <MenuItem>Dashboard</MenuItem>
          </NextLink>
          <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>Log Out</MenuItem>
        </MenuList>
      </Menu>
    );
  }

  if (status !== SessionStatus.Authenticated) {
    return (
      <Box>
        <Button onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}>
          Log In
        </Button>
      </Box>
    );
  }

  return <Box></Box>;
}
