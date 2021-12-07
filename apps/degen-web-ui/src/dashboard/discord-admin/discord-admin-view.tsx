import React, { useCallback, useEffect, useState } from 'react';
import {
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
} from '@chakra-ui/react';
import { GuildDTO } from '../../core/interfaces/guild.dto';
import AdminTableCard from './admin-table-card';
import { useForm } from 'react-hook-form';

export interface DiscordAdminView {
  activeGuild: GuildDTO;
}

export function DiscordAdminView({ activeGuild }: DiscordAdminView) {
  const addAdminForm = useForm();
  const initialAddRef = React.useRef();

  const [state, setState] = useState({
    poapAdmins: [],
  });

  const [modalState, setModalState] = useState({
    activeModal: null,
    onClose: null,
  });

  const loadAdmins = useCallback(() => {
    fetch(`/api/poap/admin/${activeGuild?.id}`)
      .then((res) => res.json())
      .then(({ poapAdmins }) => {
        setState({
          ...state,
          poapAdmins: poapAdmins.map((poapAdmin) => ({
            name: poapAdmin.discordObjectName,
            userId: poapAdmin.discordObjectId,
            _id: poapAdmin._id,
          })),
        });
      });
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [activeGuild.id, loadAdmins]);

  const openAddAdminModal = () => {
    setModalState({
      activeModal: 'ADD_ADMIN',
      onClose: (action: 'CANCEL' | 'SUBMIT') => {
        if (action === 'SUBMIT') {
          const formResult = addAdminForm.getValues();
          fetch(`/api/poap/admin`, {
            method: 'POST',
            body: JSON.stringify({
              guildId: activeGuild.id,
              userId: formResult.userId,
            }),
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
          })
            .then((res) => res.json())
            .then((result) => loadAdmins());
        }
        addAdminForm.reset();
        setModalState({ activeModal: null, onClose: null });
      },
    });
  };

  const openRemoveConfirmation = (_id: string) => {
    setModalState({
      activeModal: 'CONFIRM_REMOVE_ADMIN',
      onClose: (action: 'CANCEL' | 'SUBMIT') => {
        if (action === 'SUBMIT') {
          fetch(`/api/poap/admin`, {
            method: 'DELETE',
            body: JSON.stringify({
              id: _id,
            }),
            headers: new Headers({
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }),
          })
            .then((res) => res.json())
            .then((result) => loadAdmins());
        }
        setModalState({ activeModal: null, onClose: null });
      },
    });
  };

  return (
    <>
      <br />
      <AdminTableCard
        title="POAP Admins"
        description="Users in this server who can manage POAP events."
        users={state.poapAdmins}
        onAddUser={openAddAdminModal}
        onRemoveUser={openRemoveConfirmation}
      ></AdminTableCard>

      {/* POAP Admin Add Modal */}
      <Modal
        isCentered
        initialFocusRef={initialAddRef}
        isOpen={modalState.activeModal === 'ADD_ADMIN'}
        onClose={() => modalState.onClose('CACNCEL')}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add POAP Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Discord User ID</FormLabel>
              <Input
                ref={initialAddRef}
                type="input"
                placeholder="Enter new admins discord id..."
                {...addAdminForm.register('userId')}
              />
              <FormHelperText>
                Discord ID of the user to be added as an DEGEN admin for this feature
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => modalState.onClose('CACNCEL')}
            >
              Cancel
            </Button>
            <Button onClick={() => modalState.onClose('SUBMIT')}>Add User</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* POAP Admin Remove Modal */}
      <Modal
        isCentered
        isOpen={modalState.activeModal === 'CONFIRM_REMOVE_ADMIN'}
        onClose={() => modalState.onClose('CACNCEL')}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Remove POAP Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to remove this user?</ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => modalState.onClose('CACNCEL')}
            >
              Cancel
            </Button>
            <Button colorScheme="red" onClick={() => modalState.onClose('SUBMIT')}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
