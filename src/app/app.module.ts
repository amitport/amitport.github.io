import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectListComponent } from './project-list/project-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { ResearchComponent } from './research/research.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ProjectListComponent,
    ResearchComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    RouterModule.forRoot([
      {path: 'about', component: AboutComponent, pathMatch: 'full'},
      {path: 'projects', component: ProjectListComponent, pathMatch: 'full'},
      {path: 'research', component: ResearchComponent, pathMatch: 'full'},
      {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
      },
    ], {
      initialNavigation: 'enabledBlocking'
    }),

    BrowserAnimationsModule,

    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
