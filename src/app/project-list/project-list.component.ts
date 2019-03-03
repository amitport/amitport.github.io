import { Component, OnInit } from '@angular/core';
import { PROJECTS } from './projects';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  PROJECTS = PROJECTS;

  constructor() { }

  ngOnInit() {
  }

}
