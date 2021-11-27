import { Box } from '@chakra-ui/react';
import React from 'react';
import { PageAuthGuard } from '../../src/shared/components/auth/page-auth-guard';
import { GridContainer } from '../../src/shared/components/layout/grid-container';
import { PageTitle } from '../../src/shared/components/layout/page-title';
import styles from './admin.module.scss';

export default function AdminPage() {
  return (
    <PageAuthGuard>
      <GridContainer className="py-6">
        <PageTitle title="Admin DashBoard"></PageTitle>
        <Box className="col-span-full"></Box>
      </GridContainer>
    </PageAuthGuard>
  );
}
