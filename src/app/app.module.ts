import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutComponent } from './layout/layout.component';
import { SideComponent } from './side/side.component';
import { Page1Component } from './page1/page1.component';
import { MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ShortNumberPipe } from './short-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SideComponent,
    Page1Component,
    ShortNumberPipe
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,

    HttpClientModule,

    AppRoutingModule,

    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
