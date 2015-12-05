import $ from 'jquery';
import Backbone from 'backbone';
import App from './app';

//import Counter from './models/counter.js';
import MainView from './views/main.js';
import Router from './router';



$(() => {

  const view = new MainView();

  $('#app').append(view.render().$el);

  const router = new Router();
  
  Backbone.history.start();

});
