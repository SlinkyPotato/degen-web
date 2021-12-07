import { Avatar, Box, Button, Divider, Heading, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { BaseProps } from '../../../core/interfaces/app-props.interface';
import { GuildDTO } from '../../../core/interfaces/guild.dto';
import { GuildContext } from '../context/guild.context';
import { GridContainer } from '../layout/grid-container';

export interface GuildAuthGuardProps extends BaseProps {
  guilds: GuildDTO[];
}

/**
 * Guard that will not display children until a guild has been set as the ActiveGuild
 */
export function GuildAuthGuard({ children, guilds }) {
  const { activeGuild, setActiveGuild } = useContext(GuildContext);

  // When guild is set render children
  if (activeGuild) {
    return <>{children}</>;
  }
  // If no guilds are available to select
  else if (!guilds || guilds.length === 0) {
    return (
      <Box className="flex items-center justify-center py-24">
        <Text color="gray.500">
          Sorry it looks like you do not have access to manage this bot for any servers.
        </Text>
      </Box>
    );
  }
  // Otherwise prompt the user to select an activeGuild
  else {
    return (
      <GridContainer className="py-6">
        <Box className="col-span-12 flex justify-center flex-wrap">
          <Heading>Select a server to begin</Heading>
          <Divider className="my-6"></Divider>
          {guilds.map((guild, i) => (
            <Button
              onClick={() => setActiveGuild(guild)}
              borderRadius="2xl"
              className="flex flex-col items-center justify-center h-auto py-3 m-4"
              key={i}
            >
              <Avatar size="xl" src={guild.iconUrl}></Avatar>
              <Text className="mt-2">{guild.name}</Text>
            </Button>
          ))}
        </Box>
      </GridContainer>
    );
  }
}
