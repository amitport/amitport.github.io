import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
      <div fxLayout fxFill>
          <ng-content select=".layout-side" style="overflow-y: scroll;"></ng-content>
          <div >
              <ng-content select=".layout-main" fxFlex style="overflow-y: scroll;"></ng-content>
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
