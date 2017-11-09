import React from 'react';
let {connect} = require('react-redux');
import {Link} from 'react-router';
import utils from 'utils';

class CollectionItem extends React.Component {
  constructor() {
    super();
  }

  render() {

    let {title, image, price, description} = this.props;

    return (
      <div className="product-item clearfix">
        <Link to='#'><img className="product-item-image" src={image} /></Link>
        <div className="product-item-content">
          <h3 className="product-item-title">{title}</h3>
          <p className="product-item-description">{description}</p>
        </div>
        <div className="product-item-price">{price}</div>

      </div>
    )
  }
}


module.exports = CollectionItem;
