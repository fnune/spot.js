export function isHtmlElement(element: Element): element is HTMLElement {
  return element instanceof HTMLElement;
}

export function isMouseEvent(event: Event): event is MouseEvent {
  return "clientX" in event && "clientY" in event;
}
