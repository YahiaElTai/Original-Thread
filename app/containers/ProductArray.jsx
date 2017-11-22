import React from 'react';
import { Link } from 'react-router';
let { connect } = require('react-redux');
let actions = require('cartActions');
import utils from 'utils';
import Loader from 'Loader';
import CollectionItem from 'CollectionItem';

class ProductArray extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'all'
    };
  }

  openTab(tab) {
    if (tab === 'men') {
      this.setState({ activeTab: 'men' });
    } else if (tab === 'women') {
      this.setState({ activeTab: 'women' });
    } else if (tab === 'all') {
      this.setState({ activeTab: 'all' });
    }
  }

  handleActiveProduct(product) {
    let { dispatch } = this.props;

    if (product) {
      dispatch(actions.setActiveProduct(options));
      console.log("product: ", product);
    } else {
      console.log("loading.......")
    }

  }

  render() {
    let { collections } = this.props;
    let allCollection = utils.searchObjects(18249121825, 'key', collections);
    let menCollection = utils.searchObjects(10074456097, 'key', collections);
    let womenCollection = utils.searchObjects(10074488865, 'key', collections);
    let activeCollection;
    let activeTab = this.state.activeTab;

    if (activeTab === 'all') {
      activeCollection = allCollection;
    } else if (activeTab === 'men') {
      activeCollection = menCollection;
    } else if (activeTab === 'women') {
      activeCollection = womenCollection;
    }

    if (allCollection != undefined && menCollection != undefined && womenCollection != undefined) {
      console.log(womenCollection.products);
      return (
        <div className="product-arr">
          <div className="product-arr-container">
            <div className="tab">
              <button onClick={this.openTab.bind(this, 'all')}>All</button>
              <button onClick={this.openTab.bind(this, 'men')}>Men/Unisex</button>
              <button onClick={this.openTab.bind(this, 'women')}>Women</button>
            </div>
            <div className="product-arr-grid">
              {activeCollection.products.map(product => {
                return (
                  <CollectionItem
                    SelectedProduct= {product.attrs}
                    productClass="product-arr-item"
                    key={product.attrs.product_id}
                    id={product.attrs.product_id}
                    image={product.attrs.images[0].src}
                    title={product.attrs.title}
                    arrColor={product.attrs.options[1]}
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
})(ProductArray);
