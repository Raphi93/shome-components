import type { ElementType } from 'react';

let _linkComponent: ElementType = 'a';

export function configureLinkComponent(component: ElementType): void {
  _linkComponent = component;
}

export function getConfiguredLinkComponent(): ElementType {
  return _linkComponent;
}
