import Backbone from 'backbone';
import $ from 'jquery';
import Isotope from 'isotope-layout';

import ProductView from './product'
import CounterView from './counter.js'
import MainTemplate from '../templates/main.hbs';

export default class MainView extends Backbone.View {

  get id() { return 'main'; }

  get events() {
    return {
      //'click #btn-main-clickme': 'clickMe'
    };
  }

  constructor(options) {
    super(options);

    this.listenTo(this.app.collections.products, 'update', this.render);
  }

  render() {

    console.log('render main')

    this.$el.html(MainTemplate());

    this.$grid = $('.grid', this.$el);

    this.addProducts();

    this.initIsotope();

    return this;

  }

  clickMe() {
    this.model.increaseCounter();
  }

  addProducts() {

    this.app.collections.products.each(product => {

      console.log('Add product to grid %s', product.get('name'));

      let productView = new ProductView({model: product}).render();

      this.$grid.append(productView.$el);

    });

  }

  initIsotope() {


    this.isotope = new Isotope(this.$grid[0], {
      //layoutMode: 'masonryHorizontal',
      itemSelector: '.grid-item',
      masonry: {
        rowHeight: 100,
        columnWidth: 100,
        isFitWidth: true
      }
    });

  }


}