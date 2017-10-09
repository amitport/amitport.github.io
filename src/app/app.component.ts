import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <app-layout>
          <app-side class="layout-side"></app-side>
          <router-outlet class="layout-main"></router-outlet>
      </app-layout>
  `
})
export class AppComponent {
  title = 'app';
}
