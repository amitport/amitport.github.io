import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
      <div fxLayout fxFill>
          <ng-content select=".layout-side" style="overflow-y: scroll;"></ng-content>
          <div style="overflow-y: scroll; padding: 8px; max-height: 100%;" fxFlex>
              <ng-content select=".layout-main"></ng-content>
          </div>
      </div>
  `,
  styles: []
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
