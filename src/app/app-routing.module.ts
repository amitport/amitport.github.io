import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectShowcaseComponent } from './project-showcase/project-showcase.component';

const routes: Routes = [{
  path: '',
  component: ProjectShowcaseComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
