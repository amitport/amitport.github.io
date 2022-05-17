import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-research',
  template: `
    <mat-list>
      <mat-list-item>
        <div matLine><a href="https://arxiv.org/abs/2108.08842">EDEN: Communication-Efficient and Robust Distributed Mean Estimation for Federated Learning</a></div>
        <small matLine>S Vargaftik<sup>*</sup>, R Ben-Basat<sup>*</sup>, A Portnoy<sup>*</sup>, G Mendelson, Y Ben-Itzhak, M Mitzenmacher</small>
        <small matLine>ICML '22</small>
        <small matLine>(* Equal contribution)</small>
      </mat-list-item>
      <mat-list-item>
        <div matLine><a href="https://arxiv.org/abs/2110.02065">SDR: Efficient Neural Re-ranking using Succinct Document Representation</a></div>
        <small matLine>N Cohen<sup>*</sup>, A Portnoy<sup>*</sup>, B Fetahu, A Ingber</small>
        <small matLine>ACL '22</small>
        <small matLine>(* Equal contribution)</small>
      </mat-list-item>
      <mat-list-item>
        <div matLine><a href="https://papers.nips.cc/paper/2021/hash/0397758f8990c1b41b81b43ac389ab9f-Abstract.html">DRIVE: One-bit Distributed Mean Estimation</a></div>
        <small matLine>S Vargaftik<sup>*</sup>, R Ben-Basat<sup>*</sup>, A Portnoy<sup>*</sup>, G Mendelson, Y Ben-Itzhak, M Mitzenmacher</small>
        <small matLine>NeurIPS '21</small>
        <small matLine>(* Equal contribution)</small>
      </mat-list-item>
      <mat-list-item>
        <div matLine><a href="https://arxiv.org/abs/2004.04986">Towards Federated Learning With Byzantine-Robust Client Weighting</a></div>
        <small matLine>A Portnoy, Y Tirosh, D Hendler</small>
        <small matLine>Federated learning for user privacy and data confidentiality workshop, ICML '21</small>
      </mat-list-item>
      <mat-list-item>
        <div matLine><a href="https://onlinelibrary.wiley.com/doi/abs/10.1002/spe.2226">A generic decentralized trust management framework</a></div>
        <small matLine>R Friedman, A Portnoy</small>
        <small matLine>Software: Practice and Experience 45 (4), 435-454</small>
        <small matLine>(Authors are listed alphabetically)</small>
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
