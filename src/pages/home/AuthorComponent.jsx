var React = require('react');

var AuthorComponent = React.createClass({
	componentWillMount: function() {
		this.changeAuthor = this.props.changeBook.bind(null, "author");	
	},
	render : function(){
		return <div>
			<h1>Author</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci ex maxime voluptas voluptate cum fuga distinctio recusandae impedit provident perferendis consectetur, hic nisi neque magnam placeat, dolor dolorum facere? Deleniti.</p>
			<input type="text" value={this.props.book.author} onChange={this.changeAuthor}/>
		</div>
	}
})

module.exports = AuthorComponent;