import React, { useState } from 'react';
import {
  Box,
  Code,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import CommandCard from '../../src/shared/components/commands/command-card';
import { GridContainer } from '../../src/shared/components/layout/grid-container';
import { PageTitle } from '../../src/shared/components/layout/page-title';
import { CloseIcon, SearchIcon, WarningIcon } from '@chakra-ui/icons';

export default function CommandsPage() {
  const [query, setQuery] = useState('');
  const handleSearch = (event) => setQuery(event.target.value);
  const clearSearch = (event) => setQuery('');

  const sections = [
    {
      name: 'POAP Distribution Information',
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
        {
          name: '/poap distribute',
          description:
            'Distribute POAP links to a given list of attendees. The attendees .csv file is generated from /poap end command. The POAP links.txt file is generated from the POAP setup via email.',
        },
        {
          name: '/poap start',
          description:
            'Start tracking attendees as they enter and exit the specified voice channel. Once the event is started it must be stopped by the same user or configured user/role.',
        },
        {
          name: '/poap end',
          description:
            'Stop tracking attendees that enter the voice channel. The event has ended and a list of attendees is generated. Optionally send out POAP links to those who attended by providing a .txt file with the POAP links per line.',
        },
      ],
    },
  ]
    // Filter out sections that do not include the query value
    .map((section) => {
      const queryLower = query.toLowerCase();
      if (queryLower) {
        section.commands = section.commands.filter(
          (command) =>
            command?.description?.toString()?.toLowerCase().includes(queryLower) ||
            command?.name?.toString()?.toLowerCase().includes(queryLower)
        );
      }
      return section;
    })
    // Filter out sections with no commands left
    .filter((section) => section.commands.length > 0);

  /** Command search input to be rendered in the section content area */
  const sectionContent = (
    <InputGroup className="w-72">
      <InputLeftElement>
        <SearchIcon />
      </InputLeftElement>
      <Input value={query} placeholder="Search Commands..." onChange={handleSearch} />
      <InputRightElement>
        <IconButton
          variant="ghost"
          aria-label="Clear Search"
          icon={<CloseIcon />}
          onClick={clearSearch}
        ></IconButton>
      </InputRightElement>
    </InputGroup>
  );

  return (
    <GridContainer className="py-6">
      <PageTitle title="Bot Commands" sectionContent={sectionContent}></PageTitle>
      <Box className="col-span-full">
        {sections.length > 0 ? (
          sections.map((section, i) => (
            <CommandCard section={section} key={i}></CommandCard>
          ))
        ) : (
          <Box className="flex flex-row justify-center items-center mt-12">
            <WarningIcon color="gray.500" className="mr-2" />
            <Text color="gray.500">No commands found for query: {`"${query}""`}</Text>
          </Box>
        )}
      </Box>
    </GridContainer>
  );
}
