import Backbone from 'backbone';

exports.product = class Product extends Backbone.Model {

  get defaults() {
    return {
      name: '',
      price: 0,
      sale_price: 0,
      percentage_change: 0,
      history: []
    };
  }

};

export default class Products extends Backbone.Collection {

  model: Product;

  get defaults() {
    return {
      counter: 0
    };
  }


}