import { Component,  h} from '@stencil/core';

@Component({
  tag: 'wp-broadsheet',
  styleUrl: 'wp-broadsheet.scss',
})
export class WebpressBroadsheet {
  render() {
    return <div class="page"><slot /></div>
  }
}
