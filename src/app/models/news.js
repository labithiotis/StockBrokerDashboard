import Backbone from 'backbone';
import _ from 'underscore';

exports.article = class Article extends Backbone.Model {


};

export default class News extends Backbone.Collection {

	model: Article;

	get url() {
		return 'http://explorer.content.guardianapis.com/search?api-key=vg5gd5qcnm8er3uabrws7u57&format=xml'
	}

	parse (r) {
		return r.results;
	}

}