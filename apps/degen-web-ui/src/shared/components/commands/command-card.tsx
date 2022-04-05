import * as React from 'react';
import {
  Table,
  Tr,
  Thead,
  Th,
  Tbody,
  Td,
  Box,
  Text,
  Heading,
  Code,
} from '@chakra-ui/react';
import { GridContainer } from '../layout/grid-container';
import { BaseProps } from '../../../core/interfaces/app-props.interface';
import classNames from 'classnames';

export interface Command {
  name: string;
  description: any;
}

export interface CommandSection {
  name: string;
  description: any;
  commands: Command[];
}

export interface CommandCardProps extends BaseProps {
  section: CommandSection;
}

export const CommandCard: React.FC<CommandCardProps> = ({ section, className }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      className={classNames(className, 'mb-12')}
    >
      <GridContainer>
        <Box className="px-2 py-6 col-span-12 md:col-span-10 lg:col-span-8">
          <Heading fontSize="xl" className="font-bold mb-2" as={Box}>
            {section?.name}
          </Heading>
          <Text fontSize="md" color="gray.500" as={Box}>
            {section?.description}
          </Text>
        </Box>
      </GridContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Command</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {section?.commands.map((command, i) => (
            <Tr key={i}>
              <Td className="font-bold">
                <Code className="whitespace-nowrap">{command?.name}</Code>
              </Td>
              <Td>{command?.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
