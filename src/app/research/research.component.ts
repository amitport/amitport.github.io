import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-research',
  template: `
    <mat-list>
      <mat-list-item>
        <div matLine><a href="https://arxiv.org/abs/2105.08339">DRIVE: One-bit Distributed Mean Estimation</a></div>
        <small matLine>S Vargaftik<sup>*</sup>, R Ben-Basat<sup>*</sup>, A Portnoy<sup>*</sup>, G Mendelson, Y Ben-Itzhak, M Mitzenmacher; arXiv:2105.08339</small>
        <small matLine>* Equal contribution</small>
      </mat-list-item>
      <mat-list-item>
        <div matLine><a href="https://arxiv.org/abs/2004.04986">Towards Federated Learning With Byzantine-Robust Client Weighting</a></div>
        <small matLine>A Portnoy, Y Tirosh, D Hendler; arXiv:2004.04986</small>
      </mat-list-item>
      <mat-list-item>
        <div matLine><a href="https://onlinelibrary.wiley.com/doi/abs/10.1002/spe.2226">A generic decentralized trust management framework</a></div>
        <small matLine>R Friedman, A Portnoy; Software: Practice and Experience 45 (4), 435-454</small>
        <small matLine>Authors are listed alphabetically</small>
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
