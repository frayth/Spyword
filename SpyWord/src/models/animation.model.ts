import type { Game } from "./game.model";
import type { AnimationName } from "./ws.model";

export type Animation= {
  duration: number;
  name:AnimationName,
  gameSnapshot?:Game
}
