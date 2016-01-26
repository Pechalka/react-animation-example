var React = require('react');

var TitleComponent = React.createClass({
	componentWillMount: function() {
		this.changeTitle = this.props.changeBook.bind(null, "title");	
	},
	render : function(){
		return <div>
			<h1>Title</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci ex maxime voluptas voluptate cum fuga distinctio recusandae impedit provident perferendis consectetur, hic nisi neque magnam placeat, dolor dolorum facere? Deleniti.</p>
			<input type="text" value={this.props.book.title} onChange={this.changeTitle}/>
		</div>
	}
})

module.exports = TitleComponent;