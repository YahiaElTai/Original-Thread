import React from 'react';
let { connect } = require('react-redux');
import { Link } from 'react-router';
import utils from 'utils';
let actions = require('productActions');

class CollectionItem extends React.Component {
  constructor() {
    super();
  }

  colorList() {
    let { arrColor, productClass } = this.props;
    if (productClass === 'product-arr-item') {
      if (arrColor !== undefined) {
        return arrColor.values.map(color => {
          return <div className="product-color-item" style={{ backgroundColor: `${color}` }} />;
        });
      }
    }
  }

  getProductPrice() {
    let { price } = this.props;
    if (price !== undefined) {
      return price;
    }
  }

  handleActiveProduct(product) {
    let { dispatch } = this.props;

    if (product) {
      dispatch(actions.setActiveProduct(product));
      console.log('product: ', product);
    } else {
      console.log('loading.......');
    }
  }

  render() {
    let { title, image, productClass, SelectedProduct, price, description } = this.props;

    return (
      <div className={`${productClass}  clearfix`}>
        <Link to="/" onClick={this.handleActiveProduct.bind(this, SelectedProduct)}>
          <img className="product-item-image" src={image} />
        </Link>
        <div className="product-item-content">
          <h3 className="product-item-title">{title}</h3>
          <div className="product-color-group">{this.colorList()}</div>
          <p className="product-item-description">{description}</p>
        </div>
        <div className="product-item-price">{this.getProductPrice()}</div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    collections: state.collections.all
  };
})(CollectionItem);