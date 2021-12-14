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
  Button,
  TableCaption,
  Badge,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { BaseProps } from '../../core/interfaces/app-props.interface';
import { GridContainer } from '../../shared/components/layout/grid-container';
import { AddIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { PoapSettingsDTO } from '../../core/interfaces/poap-settings.dto';

export interface PoapTableCardProps extends BaseProps {
  title: string;
  description?: string;
  events: PoapSettingsDTO[];
  onStartEvent?: () => any;
  onEndEvent?: (discordServerId: string, voiceChannelId: string) => any;
}

export default function PoapTableCard({
  title,
  description,
  events,
  onStartEvent,
  onEndEvent,
  className,
}: PoapTableCardProps) {
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
            {title}
          </Heading>
          <Text fontSize="md" color="gray.500" as={Box}>
            {description}
          </Text>
        </Box>
        {onStartEvent ? (
          <Box className="px-2 py-6 col-span-12 md:col-span-2 lg:col-span-4 flex items-start justify-end">
            <Button onClick={onStartEvent}>
              <AddIcon className="mr-2" />
              Start Event
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </GridContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Event Name</Th>
            <Th>State</Th>
            <Th>Channel</Th>
            <Th>Start Time</Th>
            <Th>Schedule End Time</Th>
            <Th># Participants </Th>
            {onEndEvent ? <Th></Th> : <></>}
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event, i) => (
            <Tr key={i}>
              <Td className="font-bold">{event?.event}</Td>
              <Td>
                {event?.isActive ? (
                  <Badge className="ml-2" colorScheme="green">
                    Active
                  </Badge>
                ) : (
                  <Badge className="ml-2">Ended</Badge>
                )}
              </Td>
              <Td>{event.voiceChannelName}</Td>
              <Td>{event?.startTime}</Td>
              <Td>{event?.endTime}</Td>
              <Td>
                {event?.participants?.length > 0 ? (
                  event?.participants.length
                ) : (
                  <Box>No Participants</Box>
                )}
              </Td>
              {onEndEvent && event.isActive ? (
                <Td className="text-right">
                  <Button
                    onClick={() =>
                      onEndEvent(event?.discordServerId, event?.voiceChannelId)
                    }
                  >
                    <TriangleDownIcon className="mr-2" /> End
                  </Button>
                </Td>
              ) : (
                <></>
              )}
            </Tr>
          ))}
        </Tbody>
        {events?.length > 0 ? (
          <></>
        ) : (
          <TableCaption>
            <Text color="gray.500" className="mt-3 mb-6">
              No Events Created
            </Text>
          </TableCaption>
        )}
      </Table>
    </Box>
  );
}
