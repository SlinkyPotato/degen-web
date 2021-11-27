import styles from './commands.module.scss';
import React from 'react';
import { Box, Code } from '@chakra-ui/react';
import CommandCard, { CommandSection } from '../../src/shared/components/command-card';
import { GridContainer } from '../../src/shared/components/layout/grid-container';
import { PageTitle } from '../../src/shared/components/layout/page-title';

export default function CommandsPage() {
  const sections: CommandSection[] = [
    {
      name: 'POAP DistributionInformation',
      description: (
        <Box>
          Before commands can be used, authorized users and roles must first be set with
          the <Code>/poap config</Code> command by an admin. Users can then use the{' '}
          <Code>/poap schedule</Code> command to mint PNG images into POAPs.
        </Box>
      ),
      commands: [
        {
          name: '/poap config',
          description:
            'Authorize users and roles who can use the following poap commands. A malicious user and role can also be removed.',
        },
        {
          name: ' /poap schedule',
          description:
            'Schedule a POAP event, upload the PNG image to be minted, and get the links.txt file over email.',
        },
      ],
    },
  ];

  return (
    <GridContainer className="py-6">
      <PageTitle title="Bot Commands"></PageTitle>
      <Box className="col-span-full">
        {sections.map((section, i) => (
          <CommandCard section={section} key={i}></CommandCard>
        ))}
      </Box>
    </GridContainer>
  );
}
