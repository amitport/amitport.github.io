import module from './module';
import mainTemplate from './main.html!ng-template';
import './main.css!';

import katex from 'katex';

module
.component('main', {
    templateUrl: mainTemplate.templateUrl,
    controller: ['$http', '$sce', function($http, $sce) {
        this.katexTest = $sce.trustAsHtml(katex.renderToString('x^2'));
        this.profiles = {
            stackOverflow: {
                loading: true
            },
            github: {
                loading: true
            }
        };

        $http
            .get('https://api.stackexchange.com/2.2/users/990421?site=stackoverflow')
            .then(({data}) => {
                const stackOverflowProfile = data.items[0];
                this.profiles.stackOverflow.reputation = 
                            stackOverflowProfile.reputation;
                this.profiles.stackOverflow.link = 
                            stackOverflowProfile.link;
            })
            .finally(() => {
                this.profiles.stackOverflow.loading = false;
            });

        $http
            .get('https://api.github.com/users/amitport')
            .then(({data}) => {
                const githubProfile = data;
                this.profiles.github.publicRepos = 
                            githubProfile.public_repos;
                this.profiles.github.followers = 
                            githubProfile.followers;
                this.profiles.github.link = 
                            githubProfile.html_url;
            })
            .finally(() => {
                this.profiles.github.loading = false;
            });

            
    }]
});