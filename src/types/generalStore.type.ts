import { KeyLabel } from "./membershipStatus.type";
import { Profession } from "./profession.type";

export type GeneralStore = {
  memberShipStatuses: KeyLabel[];
  platforms: KeyLabel[];
  professions: Profession[]; 
  fetchMemberShipStatuses: () => Promise<void>;
  fetchPlatforms: () => Promise<void>;
  fetchProfessions: () => Promise<void>;
};
