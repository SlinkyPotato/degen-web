export interface DegenService {
  getPoapAdmins(guildId: string | string[]);
  addPoapAdmins(admin: PoapAdmin);
  removePoapAdmins(admin: PoapAdmin);
}

export interface PoapAdmin {
  objectType: string;
  discordObjectId: string;
  discordObjectName: string;
  discordServerId: string;
  discordServerName: string;
}
