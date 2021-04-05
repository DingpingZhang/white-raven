import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SwitchHost } from 'components/switch-host';
import { GlobalContextRoot } from 'models/context-components';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './styles/normalize.css';
import './styles/index.scss';

// Disable the context menu of browser.
document.addEventListener('contextmenu', e => e.preventDefault());

ReactDOM.render(
  <React.StrictMode>
    <GlobalContextRoot>
      <SwitchHost>
        <App />
      </SwitchHost>
    </GlobalContextRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
