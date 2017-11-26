var activeProduct = {

  fetched : true,
  options :
  {
    body_html : "By Raymond",
    images :  [

        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Clay.png?v=1509004973"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Charcoal_Black.png?v=1509004974"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Grey.png?v=1509004975"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_White_Fleck.png?v=1509004976"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Aqua.png?v=1509004977"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Berry.png?v=1509004978"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Blue.png?v=1509004980"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Oatmean.png?v=1509004981"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Green.png?v=1509004982"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Navy.png?v=1509004983"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Orange.png?v=1509004984"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Purple.png?v=1509004985"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Red.png?v=1509004986"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Solid_Dark_Grey.png?v=1509004987"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_True_Royal.png?v=1509004988"}

              ],
    options : [
        {
          values: ["S", "M", "L", "XL", "XXL"]
        },
        {
          values: ["Brown", "Black", "Grey", "White", "Aqua", "MediumVioletred", "Blue", "LightGray", "Green", "Navy", "Orange", "Purple", "Red", "DarkGrey", "DarkBlue"]
        }
              ],
      title : "Triblend Short Sleeve T-shirt"
  }
}




export var productsReducer = (state = { all: [], active: activeProduct }, action) => {
  switch (action.type) {
    case 'ADD_PRODUCTS':
      return {
        ...state,
        all: action.products
      };
    case 'SET_ACTIVE_PRODUCT':
      return {
        ...state,
        active: {
          ...state.active,
          fetched: true,
          options: action.options
        }
      };
    case 'CLEAR_ACTIVE_PRODUCT':
      return {
        ...state,
        active: null
      };
    case 'UPDATE_ACTIVE_PRODUCT_OPTIONS':
      return {
        ...state,
        active: {
          ...state.active,
          options: action.options
        }
      };
    default:
      return state;
  }
};

export var collectionsReducer = (state = { all: [], active: null, charity: null, productIsSelected: false }, action) => {
  switch (action.type) {
    case 'ADD_COLLECTIONS':
      return {
        ...state,
        all: action.collections
      };
    case 'SET_ACTIVE_COLLECTION':
      return {
        ...state,
        active: action.collection
      };
    case 'CHANGE_ACTIVE_PRODUCT':
      return {
        ...state,
        active: {
          ...state.active,
          activeProduct: action.updatedActiveProduct
        }
      };
    case 'PRODUCT_IS_SELECTED':
      return {
        ...state,
        productIsSelected: action.isSelected
      };
    case 'SET_CHARITY':
      return {
        ...state,
        charity: action.charity
      };
    case 'CLEAR_ACTIVE_COLLECTION':
      return {
        ...state,
        active: null
      };
    default:
      return state;
  }
};

export var cartReducer = (state = { isOpen: false, lineItems: [] }, action) => {
  switch (action.type) {
    // case 'RESTORE_PREVIOUS_CART':
    //   return action.remoteCart;
    case 'SET_INITIAL_CART_STATE':
      return {
        ...action.localCart
      };
    case 'UPDATE_CART_ITEMS':
      return {
        ...state,
        lineItems: action.updatedCartItems
      };
    case 'UPDATE_CART_ITEMS_COUNT':
      return {
        ...state,
        lineItemsCount: action.updatedCartItemsCount
      };
    case 'UPDATE_CART_SUBTOTAL':
      return {
        ...state,
        subtotal: action.newSubtotal
      };
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };
    case 'CLEAR_CART_ITEMS':
      return {
        ...state,
        lineItems: []
      };
    default:
      return state;
  }
};

export var navReducer = (state = { showClose: false, showNav: false }, action) => {
  switch (action.type) {
    case 'TOGGLE_NAV_ICON':
      return {
        ...state,
        showClose: !state.showClose,
        showNav: state.showNav
      };
    case 'TOGGLE_NAV':
      return {
        ...state,
        showClose: !state.showClose,
        showNav: !state.showNav
      };
    case 'CLOSE_NAV':
      return {
        ...state,
        showClose: false,
        showNav: false
      };
    default:
      return state;
  }
};
