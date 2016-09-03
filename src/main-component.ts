import module from './module';
import mainTemplate from './main.html!ng-template';
import './main.css!';

import katex from 'katex';
import hljs from 'highlightjs';
import 'highlightjs/styles/darcula.css!';

module
.directive('katex', function() {
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element) {
            katex.render(element.text(), element[0]);
        }
    };
})
.directive('highlight', function() {
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, element) {
            hljs.highlightBlock(element[0]);
        }
    };
})
.component('main', {
    templateUrl: mainTemplate.templateUrl,
    controller: ['$http', '$sce', function($http, $sce) {
        // console.log(hljs.highlightBlock('var x;'));
        // this.katexTest = $sce.trustAsHtml(katex.renderToString('x^2'));
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