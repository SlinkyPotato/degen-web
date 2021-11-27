import React from 'react';
import { PageAuthGuard } from '../../../src/layout/auth/page-auth-guard';
import { GridContainer } from '../../../src/layout/grid-container';

export default function PoapNewPage() {
  return (
    <PageAuthGuard>
      <GridContainer className="py-6">/admin/poap/new</GridContainer>;
    </PageAuthGuard>
  );
}
