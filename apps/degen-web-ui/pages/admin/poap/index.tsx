import React from 'react';
import { PageAuthGuard } from '../../../src/layout/auth/page-auth-guard';
import { GridContainer } from '../../../src/layout/grid-container';
import styles from './poap.module.scss';

export default function PoapPage() {
  return (
    <PageAuthGuard>
      <GridContainer className="py-6">/admin/poap</GridContainer>;
    </PageAuthGuard>
  );
}
