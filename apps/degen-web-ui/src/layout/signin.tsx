import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/client';
import NextLink from 'next/link';
import React, { useEffect } from 'react';

export function SignIn() {
  const [session, loading] = useSession();

  if (session && !loading) {
    return (
      <Menu>
        <MenuButton pr="3">
          <Button variant="outline" className="flex items-center">
            <Avatar size="xs" src={session.user?.image || ''} />
            <Text fontWeight="bold" className="mx-2">
              {session.user?.name}{' '}
            </Text>
            <ChevronDownIcon></ChevronDownIcon>
          </Button>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
        </MenuList>
      </Menu>
    );
  }

  if (!loading) {
    return (
      <Box>
        <Button onClick={() => signIn('discord')}>Log In</Button>
      </Box>
    );
  }

  return <Box></Box>;
}
