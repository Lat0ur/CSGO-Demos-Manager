import { Perspective } from 'csdm/common/types/perspective';
import type { PlaybackMatch } from 'csdm/node/database/watch/get-match-playback';
import { VDMGenerator } from './generator';

type Options = {
  match: PlaybackMatch;
  steamId: string;
  perspective: Perspective;
  beforeDelaySeconds: number;
  nextDelaySeconds: number;
};

export async function generatePlayerDeathsVdmFile({
  match,
  perspective,
  steamId,
  beforeDelaySeconds,
  nextDelaySeconds,
}: Options) {
  const vdm = new VDMGenerator(match.demoPath);
  if (nextDelaySeconds < 1) {
    nextDelaySeconds = 1;
  }
  if (beforeDelaySeconds < 1) {
    beforeDelaySeconds = 1;
  }

  const tickrate = match.tickrate;
  const tickBeforeDelayCount = Math.round(tickrate * beforeDelaySeconds);
  const tickNextDelayCount = Math.round(tickrate * nextDelaySeconds);
  const maxNextDeathDelayInSeconds = 15;
  const maxNextDeathDelayTickCount = Math.max(Math.round(tickrate * maxNextDeathDelayInSeconds), tickNextDelayCount);
  const isPlayerPerspective = perspective === Perspective.Player;
  const deaths = match.kills;

  for (const [index, death] of deaths.entries()) {
    const isFirstDeath = index === 0;
    if (isFirstDeath) {
      // It's the first death so just skip ahead and focus the camera on the player
      const toTick = Math.max(0, death.tick - tickBeforeDelayCount);
      const steamIdToFocus = isPlayerPerspective ? steamId : death.killerSteamId ?? steamId;
      vdm.addSkipAhead(0, toTick);
      vdm.addSpecPlayer(toTick, steamIdToFocus);
    }

    const nextDeath = index === deaths.length - 1 ? undefined : deaths[index + 1];

    if (nextDeath === undefined) {
      const stopTick = Math.min(match.tickCount, death.tick + tickNextDelayCount);
      vdm.addStopPlayback(stopTick);
    } else {
      const isNextDeathTooFarAway = nextDeath.tick - death.tick > maxNextDeathDelayTickCount;
      if (isNextDeathTooFarAway) {
        const skipAheadTick = death.tick + tickNextDelayCount;
        const toTick = nextDeath.tick - tickBeforeDelayCount;
        vdm.addSkipAhead(skipAheadTick, toTick);
        const steamIdToFocus = isPlayerPerspective ? steamId : nextDeath.killerSteamId ?? steamId;
        vdm.addSpecPlayer(toTick, steamIdToFocus);

        if (nextDeath.roundNumber > death.roundNumber) {
          const nextRoundMessageDelayInSeconds = 1;
          const fadeTick = skipAheadTick - Math.round(tickrate * nextRoundMessageDelayInSeconds);
          vdm.addTextMessage(fadeTick, `Skipping to the next death in round ${nextDeath.roundNumber}`);
          vdm.addScreenFade(fadeTick);
        }
      } else {
        // The next death is too close, only move the camera on the victim
        const tick = Math.round(death.tick + (nextDeath.tick - death.tick) / 2);
        const steamIdToFocus = isPlayerPerspective ? steamId : nextDeath.killerSteamId ?? steamId;
        vdm.addSpecPlayer(tick, steamIdToFocus);
      }
    }
  }

  await vdm.write();

  return vdm;
}
