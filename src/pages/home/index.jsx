var React = require('react');


var { Navigation } = require('react-router');

var AuthorComponent = require('./AuthorComponent');
var TitleComponent = require('./TitleComponent');
var ContributorsComponent = require('./ContributorsComponent');
var CategoriesComponent = require('./CategoriesComponent');
var KeywordsComponent = require('./KeywordsComponent');
var DescriptionComponent = require('./DescriptionComponent');
var NavPanel = require('blocks/NavPanel');

var { Screen, Section } = require('blocks/animation-container/');

var { ObjectUtils } = require('utils/');

//TODO: add PureRenderMixin and check shouldComponentUpdate 
var index = React.createClass({
	mixins : [Navigation, ObjectUtils],
	getInitialState: function() {
		//TODO: simply???		
		var step = this.props.params.step;
		var currentStep = step == 'overview' ?  'author' : step || 'author';
		var zoomOut = step == 'overview' ;

		return {
			zoomOut : zoomOut ,
			currentStep : currentStep,
			book : {
				title : 'title ',
				author : 'Vasa'
			}
		};
	},

	//TODO: move setState to componentWillReceiveProps 
	changeZoom : function(){
		var zoomOut = !this.state.zoomOut;
		this.setState({
			zoomOut : zoomOut
		})
		if (zoomOut){
			this.transitionTo('TOC', { step : 'overview' })
		} else {
			this.transitionTo('TOC', { step : this.state.currentStep })
		}
	},
	chageStep : function(step){
		this.transitionTo('TOC', { step : step })
		this.setState({ currentStep : step })
	},
	// -----------------------------------
	
	clickOnStep : function(step){
		this.setState({
			currentStep : step,
			zoomOut : false
		})
	},
	changeBook : function(field, e){
		this.setIn(['book', field], { $set : e.target.value });
	},
	render: function() {
		var book = this.state.book;

		var actions = { changeBook : this.changeBook };

		return <div >
			<div>
				<NavPanel onChangeZoom={this.changeZoom} zoomOut={this.state.zoomOut}/>
				<Screen clickOnStep={this.clickOnStep} onChageStep={this.chageStep} step={this.state.currentStep} zoomOut={this.state.zoomOut}>
					<Section key="basic" className="section--green">
						<AuthorComponent key="author" book={book} {...actions}/>
						<TitleComponent key="title" book={book} {...actions}/>
						<ContributorsComponent key="contributors" book={book}/>
					</Section>
					<Section key="marketing" className="section--yellow" book={book}>
						<CategoriesComponent key="categories" book={book}/>
						<KeywordsComponent key="keywords" book={book}/>
						<DescriptionComponent key="description" book={book}/>
					</Section>
				</Screen>
			</div>
		</div>
	}

});

module.exports = index;

