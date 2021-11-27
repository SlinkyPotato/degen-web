import * as React from 'react';
import classnames from 'classnames';
import { Box } from '@chakra-ui/react';
import { BaseProps } from '../../../core/interfaces/app-props.interface';

export type GridRowSpan =
  | 'full'
  | 'auto'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

export interface GridRowProps extends BaseProps {
  span?: GridRowSpan;
}

/**
 * Reusable css grid nestable "row" component that creates a new grid/sub-grid
 * while also spanning a set amount within its parent grid (if it exists)
 */
export function GridRow({ className, children, span }: GridRowProps) {
  const getSpan = (span) => {
    switch (span) {
      case null:
      case undefined:
        return null;
      case 'auto':
        return 'col-auto';
      default:
        return `col-span-${span}`;
    }
  };

  return (
    <Box className={classnames(`grid grid-cols-12 gap-3`, className, getSpan(span))}>
      {children}
    </Box>
  );
}
