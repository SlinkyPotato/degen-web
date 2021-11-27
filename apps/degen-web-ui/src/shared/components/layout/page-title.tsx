import { Box, Text } from '@chakra-ui/react';
import * as React from 'react';
import { BaseProps } from '../../../core/interfaces/app-props.interface';

export interface PageTitleProps extends BaseProps {
  title: string;
  description?: string;
}

export function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <Box className="col-span-12 mb-4">
      <Text fontSize="5xl" className="font-bold mb-2">
        {title}
      </Text>
      {description ? (
        <Text color="gray.500" className="mb-2">
          {description}
        </Text>
      ) : (
        <Box className="mb-2">{children}</Box>
      )}
    </Box>
  );
}
