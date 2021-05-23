import SpotPlugin from "./plugin";
import Spot from "./spot";
import { isHtmlElement, isMouseEvent } from "./util";

interface InitiatedSpotPlugin extends SpotPlugin {
  spots?: Spot[];
}

export default class SpotArea {
  container: HTMLElement;
  plugins: InitiatedSpotPlugin[];
  spots: Spot[] = [];

  constructor(container: HTMLElement, plugins: SpotPlugin[]) {
    this.container = container;
    this.plugins = plugins;

    for (const plugin of this.plugins) {
      const elements = document.getElementsByClassName(plugin.class);
      plugin.spots = Array.from(elements)
        .filter(isHtmlElement)
        .map((element) => new Spot(element));
    }
  }

  enable(): void {
    this.container.addEventListener("load", this.update);
    this.container.addEventListener("mousemove", this.update);
    this.container.addEventListener("resize", this.update);
    this.container.addEventListener("scroll", this.update);
  }

  disable(): void {
    this.container.removeEventListener("load", this.update);
    this.container.removeEventListener("mousemove", this.update);
    this.container.removeEventListener("resize", this.update);
    this.container.removeEventListener("scroll", this.update);
  }

  update(event: Event): void {
    const cursor = isMouseEvent(event)
      ? { x: event.clientX, y: event.clientY }
      : undefined;

    for (const plugin of this.plugins) {
      for (const spot of plugin.spots ?? []) {
        plugin.effect(spot, cursor);
      }
    }
  }
}
