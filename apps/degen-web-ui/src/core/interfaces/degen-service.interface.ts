import { PoapAdminDTO } from './poap-admin.dto';
import { PoapSettingsDTO } from './poap-settings.dto';

export interface PoapService {
  getPoapAdmins(guildId: string | string[]);
  addPoapAdmins(admin: PoapAdminDTO);
  removePoapAdmins(admin: PoapAdminDTO);

  getPoapEvents(settings: PoapSettingsDTO);
  startPoapEvent(settings: PoapSettingsDTO);
  endPoapEvent(settings: PoapSettingsDTO);
}
