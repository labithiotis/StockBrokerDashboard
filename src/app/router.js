import Backbone from 'backbone';

export default class Router extends Backbone.Router {

  get routes() {
    return {
      '*path': 'default'
    };
  }

  initialize() {
    console.log('init router')
    this.app.collections.products.set([
      {
        name: 'Amstel',
        price: 3.45,
        sale_price: 3.25,
        percentage_change: -10.1
      },
      {
        name: 'Becks',
        price: 2.20
      },
      {
        name: 'Bud',
        price: 4.2,
        sale_price: 4.4,
        percentage_change: 5.4
      }
    ])
    // TODO: not yet implemented
  }

  default(path = '') {
    // TODO: not yet implemented
  }

}
