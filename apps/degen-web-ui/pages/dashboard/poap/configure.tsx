import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import { PageAuthGuard } from '../../../src/shared/components/auth/page-auth-guard';
import { GridContainer } from '../../../src/shared/components/layout/grid-container';
import { getDegenService } from '../../../src/core/api/mongo/degen.service';
import {
  DegenService,
  PoapAdmin,
} from '../../../src/core/interfaces/degen-service.interface';
import { PoapConfigTable } from '../../../src/poap/poap-config-table';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const degenService: DegenService = await getDegenService(context.req);

  return {
    props: {
      admins: JSON.parse(
        // Todo : get active guild id
        JSON.stringify(await degenService.getPoapAdmins('612014162994003978'))
      ),
    },
  };
};

export interface ConfigurePageProps {
  admins: PoapAdmin[];
}

export default function PoapConfigurePage({ admins }: ConfigurePageProps) {
  return (
    <PageAuthGuard>
      <GridContainer className="py-6">
        <PoapConfigTable admins={admins}></PoapConfigTable>
      </GridContainer>
    </PageAuthGuard>
  );
}
