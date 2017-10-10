import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page1',
  template: `
      <h4>Selected Projects</h4>
      <mat-nav-list>
          <a mat-list-item [href]="link.url" *ngFor="let link of links">
              <h3 matLine> {{ link.title }} </h3>
              <p matLine>
                  <span> {{ link.description}} </span>
              </p>
          </a>
      </mat-nav-list>
  `,
  styles: []
})
export class Page1Component implements OnInit {
  links = [{
      title: 'CardForest.com',
      description: 'Online environment for coding card games',
      url: 'http://www.cardforest.com'
  }, {
      title: 'version-nagger',
      description: 'an electron app that pulls node and npm package updates',
      url: 'https://github.com/amitport/version-nagger'
  }, {
      title: 'amitport.github.io',
      description: 'the source for this page',
      url: 'https://github.com/amitport/amitport.github.io/tree/source'
  }, {
      title: 'GraphPack',
      description: 'a decentralized graph database',
      url: 'https://code.google.com/archive/p/graphpack/'
  }, {
      title: 'trustpack',
      description: 'a decentralized trust management framework',
      url: 'http://onlinelibrary.wiley.com/doi/10.1002/spe.2226/abstract'
  }, {
      title: 'turned-based',
      description: 'a collection of multi-player games— Four-in-a-line, Israeli Whist, and Tic-tac-toe',
      url: 'https://turn-based.herokuapp.com/'
  }, {
      title: 'gulp-group-aggregate',
      description: 'group and aggregate gulp\'s file streams (e.g., concat files by folder)',
      url: 'https://github.com/amitport/gulp-group-aggregate'
  }, {
      title: 'gulp-wrap-docco',
      description: 'gulp-wrap-docco',
      url: 'https://github.com/amitport/gulp-wrap-docco'
  }, {
      title: 'Space Invaders 3D',
      description: 'Space Invaders written in C++ using OpenGL',
      url: 'https://github.com/amitport/SpaceInvaders3D'
  }, {
      title: 'Klondike',
      description: 'a simple Klondike (Windows Solitaire) game, written in Java',
      url: 'https://github.com/amitport/Klondike'
  }, {
      title: 'master-class',
      description: 'javascript classes with typing, change logging, optional immutability, reference preserving serialization, and state pattern support',
      url: 'https://amitport.gitbooks.io/master-class/content/'
  }, {
      title: 'inherit-array',
      description: 'JavaScript (<6) array inheritance done right',
      url: 'https://github.com/amitport/inherit-array'
  }, {
      title: 'darbak',
      description: 'Compiles literate-iced-coffee-script and appends it with its source and formatted documentation.',
      url: 'https://github.com/amitport/darbak'
  }, {
      title: 'IsraDoc.com',
      description: 'Israel doctor index—WIP',
      url: 'http://wwww.isradoc.com'
  }
  ];


  constructor() { }

  ngOnInit() {
  }

}
