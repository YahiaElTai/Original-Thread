import React from 'react';
import { Link } from 'react-router';
let { connect } = require('react-redux');
let actions = require('cartActions');
import utils from 'utils';
import Loader from 'Loader';
import CollectionItem from 'CollectionItem';

class LiveFeed extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { collections } = this.props;
    let liveFeedCollection = utils.searchObjects(10178953249, 'key', collections);
    if (liveFeedCollection) {
      console.log(liveFeedCollection);
    }


    if (liveFeedCollection != undefined) {
      return (
        <div className="live-feed">
          <div className="live-feed-container">
            <div className="live-feed-grid">
              {liveFeedCollection.products.map(product => {
                return (
                  <CollectionItem
                    productClass="live-feed-item"
                    key={product.attrs.product_id}
                    id={product.attrs.product_id}
                    image={product.attrs.images[0].src}
                    title={product.attrs.title}
                    description={product.attrs.body_html}
                    price={utils.formatAsMoney(product.selectedVariant.price)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}

export default connect(state => {
  return {
    collections: state.collections.all
  };
})(LiveFeed);