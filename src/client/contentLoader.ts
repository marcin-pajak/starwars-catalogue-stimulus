import { Controller } from 'stimulus';

import { makeLoadingState } from './helpers/makeLoadingState';

export const LOADING_STATE = makeLoadingState();
export const FAST_CONNECTIONS = ['4g'];
export const CONNECTION_MOCK = {
  effectiveType: FAST_CONNECTIONS[0],
  saveData: false,
};

export default class extends Controller {
  connect() {
    if (this.data.has('isDone')) {
      return;
    }

    // @ts-ignore
    const { effectiveType } = navigator.connection ?? CONNECTION_MOCK;

    if (
      !this.data.has('saveBandwidth') ||
      FAST_CONNECTIONS.includes(effectiveType)
    ) {
      this.load();
    }
  }

  async load() {
    const url = this.data.get('url');

    if (!url) {
      return;
    }

    this.element.innerHTML = LOADING_STATE;
    const response = await fetch(url);
    const html = await response.text();
    this.element.innerHTML = html;
    this.data.set('isDone', 'true');
  }
}
