import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import fonts from './fonts/fonts.css';
import 'applicationStyles';

import router from './router/router.jsx';

ReactDOM.render(
  <Provider>
    {router}
  </Provider>,
  document.getElementById('app')
);
