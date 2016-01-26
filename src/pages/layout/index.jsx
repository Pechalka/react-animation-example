var React = require('react');



var { RouteHandler, State } = require('react-router');
require('./index.css');


var Layout = React.createClass({
    mixins : [State],
    getInitialState: function() {
        return {
            user : null 
        };
    },
    render: function () {
        return <div>
            <RouteHandler  />
        </div>
    }

});

module.exports = Layout;