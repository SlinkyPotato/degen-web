import { GetServerSideProps } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import { GuildDTO } from '../../src/core/interfaces/guild.dto';
import { getDiscordService } from '../../src/core/api/discord.service';
import { PageAuthGuard } from '../../src/shared/components/auth/page-auth-guard';
import { GuildContext } from '../../src/shared/components/context/guild.context';
import { GuildAuthGuard } from '../../src/shared/components/discord/guild-auth-guard';
import { Box } from '@chakra-ui/layout';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { DiscordAdminView } from '../../src/dashboard/discord-admin/discord-admin-view';
import { PoapView } from '../../src/dashboard/poap/poap-view';
import { GuildMenu } from '../../src/shared/components/discord/guild-menu';
import { GridContainer } from '../../src/shared/components/layout/grid-container';
import { PageTitle } from '../../src/shared/components/layout/page-title';
import { VerifyPoapDTO } from '../../src/core/interfaces/verify-poap.dto';
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
  const { activeGuild } = useContext(GuildContext);
  const [state, setState] = useState({ poapAdmin: false });

  useEffect(() => {
    if (activeGuild?.id) {
      fetch(`/api/poap/verify/${activeGuild.id}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
        .then((res) => res.json())
        .then((result: VerifyPoapDTO) => {
          setState({
            ...state,
            poapAdmin: result.isPoapAdmin,
          });
        });
    }
  }, [activeGuild, setState]);

  return (
    <PageAuthGuard>
      <GuildAuthGuard guilds={guilds}>
        <GridContainer className="py-6">
          <PageTitle
            title="Admin DashBoard"
            sectionContent={<GuildMenu guilds={guilds}></GuildMenu>}
          ></PageTitle>
          <Box className="col-span-full">
            <Tabs>
              <TabList>
                {activeGuild?.guildAdmin ? <Tab>Discord Admin</Tab> : <></>}
                {state.poapAdmin ? <Tab>POAP</Tab> : <></>}
              </TabList>
              <TabPanels>
                {/* Discord Admin Tab View */}
                {activeGuild?.guildAdmin ? (
                  <TabPanel>
                    <DiscordAdminView activeGuild={activeGuild}></DiscordAdminView>
                  </TabPanel>
                ) : (
                  <></>
                )}

                {/* Poap Tab View */}
                {state.poapAdmin ? (
                  <TabPanel>
                    <PoapView activeGuild={activeGuild}></PoapView>
                  </TabPanel>
                ) : (
                  <></>
                )}
              </TabPanels>
            </Tabs>
          </Box>
        </GridContainer>
      </GuildAuthGuard>
    </PageAuthGuard>
  );
}
