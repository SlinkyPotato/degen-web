import { Box, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import * as React from 'react';
import NextLink from 'next/link';

export function PoapView() {
  return (
    <>
      {/* Toolbar Row */}
      <Box className="flex items-center">
        <NextLink href={'/dashboard/poap/configure'} passHref>
          <Button className="mr-2">Configure</Button>
        </NextLink>
        <span className="flex-grow"></span>
        <NextLink href={'/dashboard/poap/new'} passHref>
          <Button className="mr-2 flex items-center">
            <AddIcon className="mr-2" />
            New Event
          </Button>
        </NextLink>
      </Box>
    </>
  );
}
