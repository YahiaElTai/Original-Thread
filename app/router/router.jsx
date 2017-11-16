import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';

import DocumentMeta from 'react-document-meta';
import Main from 'Main';
import Index from 'Index';
import PageItem from 'PageItem';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-6241825-9'); // initialize Google Analytics

function logPageView(location) {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
}

browserHistory.listen(location => {
  logPageView(location);

  // scroll to top when changing page
  window.scrollTo(0, 0);
});

export default (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute path="/" component={Index} />
      <Route path="about" component={PageItem} />
      <Route path="contact" component={PageItem} />
      <Route path="terms-of-service" component={PageItem} />
      <Route path="privacy-policy" component={PageItem} />
      <Route path="customer-care" component={PageItem} />
      <Route path="guidelines" component={PageItem} />
    </Route>
  </Router>
);
