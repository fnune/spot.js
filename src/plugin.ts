import Spot, { Position } from "./spot";

export default interface SpotPlugin {
  class: string;
  effect: (spot: Spot, cursor?: Position) => void;
}
