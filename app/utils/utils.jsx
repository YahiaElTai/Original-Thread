// format amount as currency
function formatAsMoney(amount, currency, thousandSeparator, decimalSeparator, localeDecimalSeparator) {
  currency = currency || '$';
  thousandSeparator = thousandSeparator || ',';
  decimalSeparator = decimalSeparator || '.';
  localeDecimalSeparator = localeDecimalSeparator || '.';
  var regex = new RegExp('(\\d)(?=(\\d{3})+\\.)', 'g');

  return currency + parseFloat(amount, 10).toFixed(2)
    .replace(localeDecimalSeparator, decimalSeparator)
    .replace(regex, '$1' + thousandSeparator)
    .toString();
}
module.exports.formatAsMoney = formatAsMoney;


function searchObjects(nameKey, prop, arr){
  for (var i=0; i < arr.length; i++) {
    if (arr[i][prop] === nameKey) {
      return arr[i];
    }
  }
}
module.exports.searchObjects = searchObjects;
