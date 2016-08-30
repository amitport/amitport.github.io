import {module} from 'angular';
import 'angular-material';
import shortNumber from 'short-number';

export default module('amitport', ['ngMaterial'])
.filter('shortNumber', () => shortNumber);
