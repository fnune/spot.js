interface Position {
  x: number;
  y: number;
}

export default class Spot {
  element: HTMLElement;
  x: number;
  y: number;

  constructor(element: HTMLElement) {
    const bounds = element.getBoundingClientRect();
    this.element = element;
    this.x = bounds.left + this.element.offsetWidth / 2;
    this.y = bounds.top + this.element.offsetWidth / 2;
  }

  radians(cursor: Position): number {
    return Math.atan2(this.x - cursor.y, cursor.x - this.y);
  }

  degrees(cursor: Position): number {
    const angle = -Math.round((this.radians(cursor) * 18000) / Math.PI) / 100;
    return angle < 0 ? angle + 360 : angle;
  }

  distance(cursor: Position): number {
    return Math.round(
      Math.sqrt(Math.pow(cursor.x - this.x, 2) + Math.pow(this.y - cursor.y, 2))
    );
  }
}
