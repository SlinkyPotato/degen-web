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
import { signOut, useSession } from 'next-auth/client';
import NextLink from 'next/link';
import React, { useEffect } from 'react';

function SignIn() {
  const [session, loading] = useSession();

  if (session && !loading) {
    return (
      <Menu>
        <MenuButton pr="3">
          <Flex alignItems="center">
            <Avatar mr="3" src={session.user?.image || ''} />
            <Text fontWeight="bold">{session.user?.name} </Text>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  if (!loading) {
    return (
      <Box>
        <NextLink href="/api/auth/signin" passHref>
          <Button colorScheme="teal">Log In</Button>
        </NextLink>
      </Box>
    );
  }

  return <Box></Box>;
}

export default SignIn;
