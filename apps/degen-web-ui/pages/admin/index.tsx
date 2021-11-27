import React from 'react';
import { GridContainer } from '../../src/layout/grid-container';
import { PageAuthGuard } from '../../src/layout/auth/page-auth-guard';
import styles from './admin.module.scss';

export default function AdminPage() {
  return (
    <PageAuthGuard>
      <GridContainer className="py-6">/admin</GridContainer>
    </PageAuthGuard>
  );
}
