var activeProduct = {

  fetched : true,
  options :
  {
    body_html : "By Raymond",
    images :  [

        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_White.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Black.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Carribean_Blue.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Charity_Pink.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Coral.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Green_Apple.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Hot_Pink.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Lemon_Zest.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Raspberry.png?v=1509010433"},
        { src: "https://cdn.shopify.com/s/files/1/2485/3042/products/Anvil_391_Sheer_Scoopneck_T-shirt_-_Silver.png?v=1509010433"}
              ],
    options : [
        {
          values: ["S", "M", "L", "XL", "XXL"]
        },
        {
          values: ["White", "Black", "darkTurquoise", "Pink", "Salmon", "ForestGreen", "HotPink", "Yellow", "Purple", "Silver"]
        }
              ],
      title : "Sheer Scoopneck T-Shirt"
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
