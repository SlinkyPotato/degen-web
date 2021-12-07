import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GuildDTO } from '../../../core/interfaces/guild.dto';
import { GuildContext } from '../context/guild.context';

export interface GuildMenuProps {
  guilds: GuildDTO[];
}

/**
 * Simple menu that renders a list of guilds and updates the
 * ActiveGuild context whenever a new one is selected.
 */
export function GuildMenu({ guilds }: GuildMenuProps) {
  const { activeGuild, setActiveGuild } = useContext(GuildContext);
  return (
    <Menu>
      <MenuButton pr="3">
        <Button as={Box} variant="outline" className="flex items-center">
          <Avatar size="2xs" src={activeGuild?.iconUrl ?? ''} />
          <Text fontWeight="bold" className="mx-2">
            {activeGuild?.name}
          </Text>
          <ChevronDownIcon></ChevronDownIcon>
        </Button>
      </MenuButton>
      <MenuList>
        {guilds.map((guild, i) => (
          <MenuItem value={guild.id} onClick={() => setActiveGuild(guild)} key={i}>
            {guild.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
