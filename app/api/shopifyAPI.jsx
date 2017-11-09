let React = require('react');
let ShopifyBuy = require('shopify-buy');
let store = require('configureStore').configure();
import axios from 'axios';

class shopifyAPI {
  constructor() {
    this.buyClient = ShopifyBuy.buildClient({
      apiKey: ENV_CONFIG.SHOPIFY_BUY_API_KEY,
      domain: ENV_CONFIG.SHOPIFY_SHOP + '.myshopify.com',
      appId: 6
    });

    this.cart = {};
    this.collection = {};
    this.products = [];
    this.pages = [];
  }

  fetchPageContent(){
    return axios.get('/shopify/get-pages').then((response) => {
      this.pages = response.data;
    })
    .catch(error => console.log('Error: ', error));
  }

  getPage(pageName){
    let matchedPage = [];
    console.log('pages: ', this.pages);
    this.pages.map((page) => {
      let handle = page.handle;
      if (handle === pageName){
        matchedPage.push(page);
      }
    });
    return matchedPage[0];
  }

  activateCollection(collectionId, activeProductIndex){
    let fetchCollectionPromise = new Promise((resolve, reject) => {
      this.buyClient.fetchCollection(collectionId).then((data) => {
        let collection = data.attrs || {};
        let parsedCollection = {
          ...collection,
          activeProduct: {
            index: activeProductIndex
          }
        };
        this.collection = parsedCollection;
        resolve(parsedCollection);
      });
    });

    let fetchProductsPromise = new Promise((resolve, reject) => {
      this.buyClient.fetchQueryProducts({collection_id: collectionId, sort_by: 'collection-default'}).then(data => {
        let products = data || [];
        this.products = products;
        resolve(products);
      });
    });

    return Promise.all([fetchCollectionPromise, fetchProductsPromise]).then(values => {
      return values;
    }, reason => {
      return reason;
    });
  }

  changeProduct(value){
    this.products.map((product) => {
      product.options.filter((option) => {
        return option.name === 'Emblem';
      })[0].selected = value;
    });
  }

  getCurrentCollection(collectionId){
    return [this.collection, this.products];
  }

  getCharities(){
    return new Promise((resolve, reject) => {
      this.buyClient.fetchQueryProducts({tag: ['Charity']}).then(data => {
        let charities = data[0].variants || [];
        console.log('got charities data: ', data);
        resolve(charities);
      });
    });
  }

  createCart() {
    return new Promise((resolve, reject) => {
      this.buyClient.createCart().then((newCart) => {
        localStorage.setItem('lastCartId', newCart.id);
        // console.log('created new cart', newCart);
        // set singleton cart object to reference shopify cart
        this.cart = newCart;

        // set localCart (redux connected) to keep track of state changes
        let localCart = {
          isOpen: false,
          lineItemsCount: 0,
          lineItems: [],
          subtotal: 0
        }
        resolve(localCart);
      });
    });
  }

  restoreCart() {
    return new Promise((resolve, reject) => {
      this.buyClient.fetchCart(localStorage.getItem('lastCartId')).then((remoteCart) => {
        // set singleton cart object to reference shopify cart
        this.cart = remoteCart;

        // set localCart (redux connected) to keep track of state changes
        let localCart = {
          isOpen: false,
          lineItemsCount: remoteCart.lineItemCount,
          lineItems: remoteCart.lineItems,
          subtotal: remoteCart.subtotal
        }
        resolve(localCart);
      });
    });
  }
}

export default (new shopifyAPI);
