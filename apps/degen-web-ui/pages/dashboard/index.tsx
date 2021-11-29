import { Box, Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React from 'react';
import { GuildDTO } from '../../src/core/models/guild.dto';
import { getDiscordService } from '../../src/core/api/discord.service';
import { PoapView } from '../../src/poap/poap-view';
import { PageAuthGuard } from '../../src/shared/components/auth/page-auth-guard';
import { GridContainer } from '../../src/shared/components/layout/grid-container';
import { PageTitle } from '../../src/shared/components/layout/page-title';
import styles from './dashboard.module.scss';
import { ActiveGuildProvider } from '../../src/shared/components/context/guild.context';
import { GuildAuthGuard } from '../../src/shared/components/discord/guild-auth-guard';
import { GuildMenu } from '../../src/shared/components/discord/guild-menu';

export interface DashboardPageProps {
  guilds: GuildDTO[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const discordService = await getDiscordService(context.req);
  return {
    props: {
      guilds: await discordService.getMutualGuilds(),
    },
  };
};

export default function DashboardPage({ guilds }: DashboardPageProps) {
  return (
    <PageAuthGuard>
      <ActiveGuildProvider>
        <GuildAuthGuard guilds={guilds}>
          <GridContainer className="py-6">
            <PageTitle
              title="Admin DashBoard"
              sectionContent={<GuildMenu guilds={guilds}></GuildMenu>}
            ></PageTitle>
            <Box className="col-span-full">
              <Tabs>
                <TabList>
                  <Tab>POAP</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <PoapView></PoapView>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </GridContainer>
        </GuildAuthGuard>
      </ActiveGuildProvider>
    </PageAuthGuard>
  );
}
