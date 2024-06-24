import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

if (window['require']) {
  const electron = window['require']('electron');
  if (electron) {
    const baseHref = document.createElement('base');
    baseHref.href = './';
    document.head.appendChild(baseHref);
  }
}
