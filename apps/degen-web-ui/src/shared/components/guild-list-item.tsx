import { Box } from '@chakra-ui/layout';
import { Avatar, Flex, Text, Badge } from '@chakra-ui/react';
import React from 'react';
import { BaseProps } from '../../core/interfaces/app-props.interface';
import { Guild } from '../../core/models/guild';

export interface GuildListItemProps extends BaseProps {
  guild: Guild;
}

export function GuildListItem({ guild }: GuildListItemProps) {
  const iconUrl =
    'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png';
  return (
    <Box className="flex items-center">
      <Avatar src={iconUrl} size="md" />
      <Box ml="3">
        <Text fontWeight="bold">{guild.name}</Text>
        {guild.owner && (
          <Badge ml="1" colorScheme="blue">
            Owner
          </Badge>
        )}
      </Box>
    </Box>
  );
}
