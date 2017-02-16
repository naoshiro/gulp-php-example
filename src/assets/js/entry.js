import './components/buttons.js';

import jQuery from 'jquery';
import Tether from 'tether';

window.$ = window.jQuery = jQuery;
window.Tether = Tether


require('bootstrap');

$('[data-toggle="tooltip"]').tooltip()
