import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';
import '@angular/common/locales/global/pt';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

export default bootstrap;