import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoginPage from './loginexport';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<LoginPage />, document.getElementById('login'));
registerServiceWorker();
