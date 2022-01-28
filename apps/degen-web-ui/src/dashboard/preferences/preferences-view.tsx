import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { BaseProps } from '../../core/interfaces/app-props.interface';
import { PreferencesIntegrationRow } from './preferences-integration-row';
import { PreferenceCard } from './preferences-integrations-card';

export interface PreferencesView extends BaseProps {
  temp?: any;
}

export const PreferencesView: React.FC<PreferencesView> = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <br />
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>NOTE:</AlertTitle>
        <AlertDescription>
          This page has not been fully implemented yet
        </AlertDescription>
      </Alert>
      <br />
      <PreferenceCard
        title="Integrations"
        description="Link your DEGEN account with other systems to enable new features"
      >
        <PreferencesIntegrationRow
          title="Discord"
          description="Default DEGEN login account"
          isLinked={true}
        >
          <Avatar size="2xs" src={session.user?.image || ''} />
          <Text fontWeight="bold" className="mx-2">
            {session.user?.name}
          </Text>
        </PreferencesIntegrationRow>
        <PreferencesIntegrationRow
          title="Twitter"
          description="Link your Twitter account to interact with DEGEN outside of discord"
          isLinked={false}
          linkText="Link"
        ></PreferencesIntegrationRow>
        <PreferencesIntegrationRow
          title="Twitch"
          description="Link your Twitch account"
          isLinked={false}
          linkText="Link"
        ></PreferencesIntegrationRow>
        <PreferencesIntegrationRow
          title="Metamask"
          description="Connect a wallet (required for certain features)"
          isLinked={false}
          linkText="Link"
        ></PreferencesIntegrationRow>
      </PreferenceCard>
    </>
  );
};
