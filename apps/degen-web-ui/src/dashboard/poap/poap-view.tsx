import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import * as React from 'react';
import NextLink from 'next/link';
import { GuildDTO } from '../../core/interfaces/guild.dto';
import PoapTableCard from './poap-table-card';
import { useCallback, useEffect, useState } from 'react';
import { PoapSettingsDTO } from '../../core/interfaces/poap-settings.dto';
import { useForm } from 'react-hook-form';
import { ChannelDTO } from '../../core/interfaces/channel.dto';

export interface PoapView {
  activeGuild: GuildDTO;
}

export function PoapView({ activeGuild }: PoapView) {
  const initialAddRef = React.useRef();
  const startEventForm = useForm();

  const [state, setState] = useState({
    poapEvents: [],
  });

  const [channelState, setChannelState] = useState({
    guildChannels: [],
  });

  const [modalState, setModalState] = useState({
    activeModal: null,
    onClose: null,
  });

  const loadEvents = useCallback(() => {
    fetch(`/api/poap/event/${activeGuild?.id}`)
      .then((res) => res.json())
      .then(({ poapEvents }) => {
        setState({
          ...state,
          poapEvents: poapEvents.map((poapEvent: PoapSettingsDTO) => ({
            event: poapEvent.event,
            isActive: poapEvent.isActive,
            startTime: poapEvent.startTime,
            endTime: poapEvent.endTime,
            discordUserId: poapEvent.discordUserId,
            voiceChannelId: poapEvent.voiceChannelId,
            voiceChannelName: poapEvent.voiceChannelName,
            discordServerId: poapEvent.discordServerId,
            participants: poapEvent.participants,
            _id: poapEvent._id,
          })),
        });
      });
  }, []);

  const loadChannels = useCallback(() => {
    fetch(`/api/discord/channels/${activeGuild.id}`)
      .then((res) => res.json())
      .then(({ guildChannels }) => {
        console.log(guildChannels);
        setChannelState({
          ...state,
          guildChannels: guildChannels.map((guildChannel: ChannelDTO) => ({
            id: guildChannel.id,
            name: guildChannel.name,
            type: guildChannel.type,
          })),
        });
      });
  }, []);

  const openStartEventConfirmation = () => {
    setModalState({
      activeModal: 'START_EVENT',
      onClose: (action: 'CANCEL' | 'SUBMIT') => {
        if (action === 'SUBMIT') {
          const formResult = startEventForm.getValues();
          fetch(`/api/poap/event/start`, {
            method: 'POST',
            body: JSON.stringify({
              eventName: formResult.event,
              duration: formResult.duration,
              guildId: activeGuild?.id,
              voiceChannelId: formResult.voiceChannelId,
            }),
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
          })
            .then((res) => res.json())
            .then((result) => loadEvents());
        }
        setModalState({ activeModal: null, onClose: null });
      },
    });
  };

  const openEndEventConfirmation = (guildId: string, voiceChannelId: string) => {
    setModalState({
      activeModal: 'CONFIRM_END_EVENT',
      onClose: (action: 'CANCEL' | 'SUBMIT') => {
        if (action === 'SUBMIT') {
          fetch(`/api/poap/event/end`, {
            method: 'POST',
            body: JSON.stringify({
              guildId: guildId,
              voiceChannelId: voiceChannelId,
            }),
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
          })
            .then((res) => res.json())
            .then((result) => loadEvents());
        }
        setModalState({ activeModal: null, onClose: null });
      },
    });
  };

  useEffect(() => {
    loadEvents();
  }, [activeGuild.id, loadEvents]);

  useEffect(() => {
    loadChannels();
  }, [activeGuild.id, loadChannels]);

  return (
    <>
      {/* Toolbar Row */}
      <PoapTableCard
        title="POAP Events"
        description="Start, End and View Poap Events for this server"
        events={state.poapEvents}
        onStartEvent={openStartEventConfirmation}
        onEndEvent={openEndEventConfirmation}
      ></PoapTableCard>

      {/* POAP Start Event Modal */}
      <Modal
        isCentered
        initialFocusRef={initialAddRef}
        isOpen={modalState.activeModal === 'START_EVENT'}
        onClose={() => modalState.onClose('CANCEL')}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Poap Event Name</FormLabel>
              <Input
                ref={initialAddRef}
                type="input"
                placeholder="Enter event name"
                {...startEventForm.register('event')}
              />
              <FormHelperText>Name of Poap Event</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Poap Event Duration</FormLabel>
              <Input
                ref={initialAddRef}
                type="input"
                placeholder="Enter event duration"
                {...startEventForm.register('duration')}
              />
              <FormHelperText>In Minutes</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Voice Channel</FormLabel>
              <Select
                ref={initialAddRef}
                placeholder="Select voice channel"
                {...startEventForm.register('voiceChannelId')}
              >
                {channelState.guildChannels.map((channel, i) => (
                  <option key={i} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => modalState.onClose('CANCEL')}
            >
              Cancel
            </Button>
            <Button onClick={() => modalState.onClose('SUBMIT')}>Start Event</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* POAP End Event Modal */}
      <Modal
        isCentered
        isOpen={modalState.activeModal === 'CONFIRM_END_EVENT'}
        onClose={() => modalState.onClose('CANCEL')}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm End POAP Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to end this event?</ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => modalState.onClose('CANCEL')}
            >
              Cancel
            </Button>
            <Button onClick={() => modalState.onClose('SUBMIT')}>End</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
function setState(arg0: any) {
  throw new Error('Function not implemented.');
}
