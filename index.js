var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Model = mongoose.Model;

class ExtendableSchema extends Schema{
	constructor(discriminator,obj, options){
		options.discriminatorKey =  'SchemaType';
		obj[options.discriminatorKey] = { type : String, index:true };
		super(obj, options);
		this.discriminator = discriminator;
		this.obj = obj;
		this.options = options;

		let key = this.options.discriminatorKey;
		this.pre('save', function(next) {
	      	this[key] = ""+discriminator;
			next();
	    });
	    this.pre('find', function() {
	    	let cond = {};
	    	var regexp = new RegExp("^"+ discriminator);
	    	cond[key] = regexp;
		    this.where(cond);
		});
	}
	extendSchema(discriminator,obj){
		let newObj = Object.assign({}, this.obj, obj)
		let disc = this.discriminator+"-"+discriminator;
		let newSchema = new ExtendableSchema(disc,newObj, this.options);
		return newSchema;
	}
}
module.exports.ExtendableSchema = ExtendableSchema;