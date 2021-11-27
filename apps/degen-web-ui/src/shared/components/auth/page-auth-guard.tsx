import { useSession } from 'next-auth/react';
import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Spinner,
} from '@chakra-ui/react';
import { GridContainer } from '../layout/grid-container';
import { SessionStatus } from '../../../core/enums/auth.enums';

export function PageAuthGuard({ children }) {
  const { data: session, status } = useSession();

  switch (status) {
    case SessionStatus.Loading:
      return (
        <GridContainer className="py-6">
          <div className="col-span-full flex justify-center items-center py-6">
            <Spinner size="xl" />
          </div>
        </GridContainer>
      );
    case SessionStatus.Authenticated:
      return <>{children}</>;
    case SessionStatus.Unauthenticated:
    default:
      return (
        <GridContainer className="py-6">
          <div className="col-span-full">
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Access Denied:</AlertTitle>
              <AlertDescription>You must login to view this page.</AlertDescription>
            </Alert>
          </div>
        </GridContainer>
      );
  }
}
