import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-side',
    template: `
        <mat-card style="padding: 0;" fxLayout="column" fxFill fxLayoutAlign="space-between stretch">
            <div class="header" style="margin: 16px;" fxLayout fxLayoutAlign="start center" fxLayoutGap="4px">
                <mat-icon>person_pin</mat-icon>
                <span style="font-size: 16px;">Amit Portnoy</span>
            </div>
            <mat-grid-list cols="3" rowHeight="44px" style="margin: 4px;">
                <mat-grid-tile>
                    <a href="https://www.linkedin.com/in/amit-portnoy" mat-raised-button color="accent"
                       style="min-width: 0; padding: 0; width: calc(100% - 8px)">
                        <img src="/assets/In-2C-21px-R.png">
                    </a>
                </mat-grid-tile>
                <mat-grid-tile>
                    <a href="https://plus.google.com/+AmitPortnoy" mat-raised-button color="accent"
                       style="min-width: 0; padding: 0; width: calc(100% - 8px)">
                        <img width="27" height="18" style="margin-bottom: 1px; margin-left: 2px;"
                             src="/assets/logo-google-plus-white-1-300x200.png">
                    </a>
                </mat-grid-tile>
                <mat-grid-tile>
                    <a href="https://www.facebook.com/amit.portnoy" mat-raised-button
                       color="accent" style="min-width: 0; padding: 0; width: calc(100% - 8px)">
                        <img width="24" height="24" style="margin-bottom: 2px;" src="/assets/FB-f-Logo__blue_29.png">
                    </a>
                </mat-grid-tile>

                <mat-grid-tile colspan="3">
                    <a href="//stackoverflow.com/users/990421" mat-raised-button color="accent" style="width: calc(100% - 8px); 
                    height: 36px; padding: 0 8px;">
                        <div fxLayout fxLayoutAlign="space-between center" fxFill>
                            <img width="30" height="30" src="//cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.png">
                            <small fxLayout fxLayoutAlign="start center"
                                   style="text-transform: initial; text-align: initial; line-height: initial;">
                                <div [ngSwitch]="profiles.stackOverflow.loading">
                                    <mat-progress-spinner mode="indeterminate" color="warn" [diameter]="22" [strokeWidth]="2"
                                                          *ngSwitchCase="true"></mat-progress-spinner>
                                    <strong *ngSwitchCase="false">{{profiles.stackOverflow.reputation | shortNumber}}</strong>
                                </div>
                                <div style="margin-left: 6px">Reputation</div>
                            </small>
                        </div>
                    </a>
                </mat-grid-tile>
                <mat-grid-tile colspan="3">
                    <a href="https://github.com/amitport" mat-raised-button color="accent"
                       style="width: calc(100% - 8px); height: 36px; padding: 0 8px;">
                        <div fxLayout fxLayoutAlign="space-between center" fxFill>
                            <img style="margin-left: 4px; margin-right:6px" width="20" height="20" src="/assets/GitHub-Mark-32px.png">
                            <small fxLayout="column" 
                                   style="text-transform: initial; text-align: initial; line-height: initial;">
                                <div fxLayout fxLayoutAlign="start center">
                                    <div [ngSwitch]="profiles.github.loading">
                                        <mat-progress-spinner mode="indeterminate" color="warn" [diameter]="22" [strokeWidth]="2"
                                                              *ngSwitchCase="true"></mat-progress-spinner>
                                        <strong *ngSwitchCase="false">{{profiles.github.publicRepos}}</strong>
                                    </div>
                                    <div style="margin-left: 5px">Repositories</div>
                                </div>
                                <div fxLayout fxLayoutAlign="start center">
                                    <div [ngSwitch]="profiles.github.loading">
                                        <mat-progress-spinner mode="indeterminate" color="warn" [diameter]="22" [strokeWidth]="2"
                                                              *ngSwitchCase="true"></mat-progress-spinner>
                                        <strong *ngSwitchCase="false">{{profiles.github.followers}}</strong>
                                    </div>
                                    <div style="margin-left: 5px">Followers</div>
                                </div>
                            </small>
                        </div>
                    </a>
                </mat-grid-tile>
            </mat-grid-list>
        </mat-card>
    `,
    host: {
        '[class.dark-theme]': 'true'
    }
})
export class SideComponent implements OnInit {
    profiles: {
        stackOverflow: { loading: boolean, reputation?: string },
        github: { loading: boolean, publicRepos?: string, followers?: string }
    } = {
        stackOverflow: {loading: true},
        github: {loading: true}
    };

    constructor(private _http: HttpClient) {
    }

    ngOnInit() {
        this._http
            .get('https://api.stackexchange.com/2.2/users/990421?site=stackoverflow')
            .subscribe((data) => {
                const stackOverflowProfile = (data as any).items[0];
                this.profiles.stackOverflow.reputation = stackOverflowProfile.reputation;
            }, null, () => {
                this.profiles.stackOverflow.loading = false;
            });

        this._http
            .get<{public_repos: string, followers: string}>('https://api.github.com/users/amitport')
            .subscribe((githubProfile) => {
                this.profiles.github.publicRepos =
                    githubProfile.public_repos;
                this.profiles.github.followers =
                    githubProfile.followers;
            }, null, () => {
                this.profiles.github.loading = false;
            });
    }

}
