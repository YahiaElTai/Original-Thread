import 'whatwg-fetch';
import shopifyAPI from 'shopifyAPI';

export var setActiveCollection = (collection) => {
  return {
    type: 'SET_ACTIVE_COLLECTION',
    collection
  };
};

// Add collections to store
export var startAddCollections = () => {
  return (dispatch) => {
    return new Promise(function(resolve, reject){
      shopifyAPI.buyClient.fetchAllCollections().then((data) => {
        var collections = data || {};
        var parsedCollections = [];

        let parseCollectionsPromises = collections.map((collection) => {
          let collectionId = collection.attrs.collection_id;
          return new Promise(function(resolve, reject){
            let products = [];
            shopifyAPI.buyClient.fetchQueryProducts({collection_id: collectionId, sort_by: 'collection-default'}).then(data => {
              products = data || [];

              parsedCollections.push({
                key: collectionId,
                products: products,
                ...collection
              });

              resolve();
            });
          });
        });


        Promise.all(parseCollectionsPromises).then(() => {

          // sort the collections alphabetically
          parsedCollections.sort(function(a, b){
            var keyA = a.attrs.title,
                keyB = b.attrs.title;
            // Compare the 2
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
          });

          dispatch(addCollections(parsedCollections));
          resolve();
        });
      });
    });
  };
};

export var addCollections = (collections) => {
  return {
    type: 'ADD_COLLECTIONS',
    collections
  };
};

export var changeActiveProduct = (updatedActiveProduct) => {
  return {
    type: 'CHANGE_ACTIVE_PRODUCT',
    updatedActiveProduct
  };
};

export var productIsSelected = (isSelected) => {
  return {
    type: 'PRODUCT_IS_SELECTED',
    isSelected
  };
};

export var setCharity = (charity) => {
  return {
    type: 'SET_CHARITY',
    charity
  };
};

export var clearActiveCollection = () => {
  return {
    type: 'CLEAR_ACTIVE_COLLECTION'
  };
};
