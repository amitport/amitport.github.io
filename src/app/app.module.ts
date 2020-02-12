import { BrowserModule } from '@angular/platform-browser';
import { NgModule }       from '@angular/core';
import { AppComponent }         from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectListComponent } from './project-list/project-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'amitport' }),
    RouterModule.forRoot([
      { path: 'about', component: AboutComponent, pathMatch: 'full'},
      { path: 'projects', component: ProjectListComponent, pathMatch: 'full'},
      { path: '',
        redirectTo: 'about',
        pathMatch: 'full'
      },
    ]),

    BrowserAnimationsModule,

    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
