import Backbone from 'backbone';
import numeral from 'numeral';

import ProductTemplate from '../templates/product.hbs';

export default class ProductView extends Backbone.View {

  get className() {
    return 'grid-item product'
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {

    let data = this.model.toJSON(),
        change = this.model.get('percentage_change');

    if(change > 0) data.direction = 'up';
    if(change < 0) data.direction = 'down';
    if(change == 0 || !change) data.direction = 'same';

    data.percentage_change *= 100;

    data.price = '£' + numeral(data.price).format('0,0.00');
    data.sale_price = '£' + numeral(data.sale_price).format('0,0.00');

    this.$el.html(ProductTemplate(data));

    return this;

  }

}