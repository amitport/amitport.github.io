import module from './module';
import mainTemplate from './main.html!ng-template';
import './main.css!';

module
.component('main', {
    templateUrl: mainTemplate.templateUrl
});