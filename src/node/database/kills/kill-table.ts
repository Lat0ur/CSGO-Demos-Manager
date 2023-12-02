import type { Generated, Selectable } from 'kysely';
import type { TeamNumber, WeaponName, WeaponType } from 'csdm/common/types/counter-strike';
import type { ColumnID } from 'csdm/common/types/column-id';

export type KillTable = {
  id: Generated<ColumnID>;
  match_checksum: string;
  tick: number;
  frame: number;
  round_number: number;
  killer_steam_id: string;
  killer_name: string;
  killer_side: TeamNumber;
  killer_team_name: string | null;
  is_killer_controlling_bot: boolean;
  is_victim_controlling_bot: boolean;
  is_assister_controlling_bot: boolean;
  penetrated_objects: number;
  victim_steam_id: string;
  victim_name: string;
  victim_side: TeamNumber;
  victim_team_name: string | null;
  assister_steam_id: string;
  assister_name: string | null;
  assister_side: TeamNumber;
  assister_team_name: string | null;
  is_headshot: boolean;
  is_assisted_flash: boolean;
  killer_x: number;
  killer_y: number;
  killer_z: number;
  is_killer_airborne: boolean;
  is_killer_blinded: boolean;
  victim_x: number;
  victim_y: number;
  victim_z: number;
  is_victim_airborne: boolean;
  is_victim_blinded: boolean;
  is_victim_inspecting_weapon: boolean;
  assister_x: number;
  assister_y: number;
  assister_z: number;
  weapon_name: WeaponName;
  weapon_type: WeaponType;
  is_trade_kill: boolean;
  is_trade_death: boolean;
  is_through_smoke: boolean;
  is_no_scope: boolean;
  distance: number;
};

export type KillRow = Selectable<KillTable>;
