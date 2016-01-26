
var React = require('react');
var _ = require('lodash');


var ObjectUtils = {
	setIn : function(path, value){
        var $update = _.reduceRight(path, function(obj, key){
            var o = {};
            o[key] = obj;
            return o;
        }, value)

        this.setState(React.addons.update(this.state, $update));
	},

}


module.exports = {
	ObjectUtils : ObjectUtils
}