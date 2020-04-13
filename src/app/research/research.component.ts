import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-research',
  template: `
    <mat-list>
      <mat-list-item>
        <div matLine><a href="https://arxiv.org/abs/2004.04986">Towards Realistic Byzantine-Robust Federated Learning</a></div>
        <small matLine>A Portnoy, D Hendler; arXiv:2004.04986</small>
      </mat-list-item>
      <mat-list-item>
        <div matLine><a href="https://onlinelibrary.wiley.com/doi/abs/10.1002/spe.2226">A generic decentralized trust management framework</a></div>
        <small matLine>R Friedman, A Portnoy; Software: Practice and Experience 45 (4), 435-454</small>
      </mat-list-item>
    </mat-list>
  `,
  styles: []
})
export class ResearchComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
