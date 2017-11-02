import React from 'react';
let { connect } = require('react-redux');
import shopifyAPI from 'shopifyAPI';
import axios from 'axios';

class PageItem extends React.Component {
  constructor() {
    super();

    this.state = {
      data: null
    }
  }

  setPageContent(props) {
    let path = props.location.pathname.slice(1);
    console.log('props: ', props);
    console.log('path: ', path);
    console.log('setting page content: ', shopifyAPI.getPage(path));
    this.setState({
      data: shopifyAPI.getPage(props.location.pathname.slice(1))
    });
  }

  componentWillReceiveProps(newProps) {
    this.setPageContent(newProps);
  }

  componentWillMount() {
    // fetch pages from shopify
    shopifyAPI.fetchPageContent().then(() => {
      // set content
      this.setPageContent(this.props);
    });
  }

  render() {
    let { data } = this.state;

    if (data) {
      function createMarkup() {
        return { __html: data.body_html };
      }

      return (
        <div className="container page">
          <h1>{data.title}</h1>
          <div className="body" dangerouslySetInnerHTML={createMarkup()}></div>
        </div>
      )
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
}


module.exports = PageItem;
