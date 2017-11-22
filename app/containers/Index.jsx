import React from 'react';

import ProductCreator from 'ProductCreator';
import LiveFeed from 'LiveFeed';

class Index extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <ProductCreator />
        <LiveFeed />
      </div>
    );
  }
}

module.exports = Index;