var React = require('react');

var NavPanel = React.createClass({
	render : function(){
		return <div className="nav-panel">
			<button onClick={this.props.onChangeZoom}>{this.props.zoomOut ? 'zoom in' : 'zoom out'}</button>
		</div>
	}
})

module.exports = NavPanel;