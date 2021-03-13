import { Component, h } from '@stencil/core';

@Component({
  styleUrl: 'starter-layout.scss',
  tag: 'starter-layout',
})
export class StarterLayout {
  render() {
    return [
      <slot name="sidebar" />,
      <slot name="page" />
    ]
  }
}
