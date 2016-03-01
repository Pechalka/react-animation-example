var React = require('react');


require('./index.css')

var _ = require('lodash');

var cx = require('classnames');

var getWindowHeight = function()  {
    return window.innerHeight || document.body.clientHeight;
}

//TODO: use animation for scroll https://github.com/michaelrhodes/scroll
var Screen = React.createClass ({
	getInitialState: function() {
		
		return {
			state :  1,
			translateY : 0,
			translateX : 0,
			offsetTop : 0,
			h : -1,
			zoomOutAnimation : false //Do not animation when screen show
		}
	},
	componentDidMount : function() {
		this.handleScroll = _.throttle(this.handleScroll, 500);

     	window.addEventListener('scroll', this.handleScroll);

     	// this.setState({
     	// 	state : this.props.zoomOut ? 3 : 1 
     	// })
		this.calculateAnimation(this.props.step);
		// if (this.props.zoomOut){
		// 	this.zoomOut();
		// } else {
		// 	this.zoomIn();
		// }

		if (this.props.zoomOut){
			window.scrollTo(0, 0);
			this.setState({ 
				state : 3,
				h :  this.getMaxSectionHeight()
			})

			setTimeout(() => this.setState({ zoomOutAnimation : true }), 500)
			
		} else {
			this.setState({ state : 1 , zoomOutAnimation : true }, () => {
				window.scrollTo(0, this.state.offsetTop);
			})
		}
  	},

  	componentWillUnmount : function() {
    	window.removeEventListener('scroll', this.handleScroll);
  	},
  	handleScroll : function(e){
  		if (this.state.state != 1) return;

		//TODO: clean
  		var h  = 0;
  		var step = null;
  		var y = window.scrollY + getWindowHeight()/2;

  		for(var n =0; n < this.props.children.length; n++){
			var section = this.refs['section_' + n];
			var steps = section.getStepsInfo();

			steps.forEach(function(s){
				if (y >= h && y < (h + s.height)){
					step = s.key;
				}
				h += s.height;
			})

			//console.log(steps, h, y, step);

			if (step) {
				this.props.onChageStep(step);
				break;
			}
		}
  	},
	calculateAnimation : function(currentStep){
		var sectionNumber = 0;
		var translateY = 0;
		var offsetTop = 0;

		//TODO: clean
		for(var n =0; n < this.props.children.length; n++){
			var section = this.refs['section_' + n];
			var index = section.indexOf(currentStep);
			var steps = section.getStepsInfo();
			
			if (index != -1){
				sectionNumber = n;

				for (var n = 0; n < steps.length; n++) {
					if (n < index){
						translateY += steps[n].height;
						offsetTop += steps[n].height;
					}
				};
				break;
			} else {
				translateY = 0;
				offsetTop += steps.map((step) => step.height).reduce((h, sum) => h + sum)
			}
		}

		this.setState({
			translateY : -1 * translateY + 'px',
			translateX : -50 * sectionNumber + '%',
			offsetTop : offsetTop
		})
	},
	componentWillReceiveProps: function(nextProps) {
//		console.log('componentWillReceiveProps ', this.props.step, nextProps.step);

		if (this.props.step != nextProps.step)
			this.calculateAnimation(nextProps.step);//TODO: more faster ???

		if (this.props.zoomOut === nextProps.zoomOut) return;

		if (this.props.zoomOut == false && nextProps.zoomOut == true){
			this.zoomOut();
		}

		if (this.props.zoomOut == true && nextProps.zoomOut == false){
			this.zoomIn();
		}
	},
	zoomOut : function(){
		window.scrollTo(0, 0);
		this.setState({
			state : 2
		})
		setTimeout(()=> {
			this.setState({ 
				state : 3,
				h :  this.getMaxSectionHeight()
			})
		}, 1000)
	},
	zoomIn : function(){
		this.setState({
			state : 4
		})
		setTimeout(()=> {
			this.setState({ state : 1 }, () => {
				window.scrollTo(0, this.state.offsetTop);
			})
		}, 1000)	
	},
	calculateTOCStyle : function(){
		var state = this.state.state;
		if (state == 2) 
			return {     
				transform: 'scale(1) translate(' + this.state.translateX  + ', ' + this.state.translateY + ' )',
	    		transformOrigin: '0 0',
	    		width: '200%'
			};

		if (state == 3) 
			return {     
				transition : this.state.zoomOutAnimation && 'all 1s' ,// ,
				transform: 'scale(0.5)',
	    		transformOrigin: '0 0',
	    		width: '200%',
	    		height : '200%'
			};

		if (state == 4) 
			return {     
				transition : 'all 1s',
				transform: 'scale(1) translate(' + this.state.translateX  +', ' + this.state.translateY + ')',
	    		transformOrigin: '0 0',
	    		width: '200%'
			};

		return {};
	},
	getMaxSectionHeight : function(){
		var sectionsHeight = this.props.children.map((s, n) => {
			var section = this.refs['section_' + n];
			var heights = section.getStepsInfo().map(s => s.height);
			return _.reduce(heights, (sum, h) => sum + h);
		})

		return _.max(sectionsHeight);
	},
	clickOnStep : function(step){
		// this.setState({

		// })
		this.props.clickOnStep(step)
	},
	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	return this.state.state != nextState.state;
	// },
	render : function(){

		console.log(' render ', this.state.state, this.state.h);
		var wrapperStyle = { 
			height : this.state.state == 3 ?  this.state.h / 2 : "auto",
			overflow : this.state.state == 3 ? 'hidden' : 'inherit'
			//, visibility : this.state.h == -1 ? 'hidden' : 'visible'
		}

		var sections = this.props.children.map((Section, n)=>React.addons.cloneWithProps(Section, { ref : 'section_' + n, key : n, state : this.state.state, currentStep : this.props.step, onClickOnStep : this.clickOnStep }))
		return <div style={wrapperStyle} className={cx({ 'TOC--zoom-out' : this.state.state == 3 })}>
			<div onScroll={this.scroll} className="toc clearfix" style={this.calculateTOCStyle()}>
				{sections}
			</div>
		</div>
	}
})

var Section = React.createClass({
	length : function(){
		return this.props.children.length;
	},
	indexOf : function(step){
		return _.findIndex(this.props.children, { key : step });
	},
	getStepsInfo : function(y){
		return this.props.children.map((c) => {
			var stepNode = React.findDOMNode(this.refs[c.key])

			return { height : stepNode.offsetHeight, key : c.key }
		})		 
	},
	render : function(){
		var currentStep = this.props.currentStep;

		var steps = this.props.children.map((c) => {
			var css = cx('step', { 'step--active' : c.key == currentStep })
			return <div onClick={this.props.state == 3 && this.props.onClickOnStep.bind(null, c.key)} ref={c.key} key={c.key} className={css}>{c}</div>
		});

		var s = { width : this.props.state == 1 ? '100%' : '50%' };
		
		return <div  style={s} className={this.props.className + ' section'}>
			{steps}
		</div>
	}
})

module.exports = {
	Section : Section,
	Screen : Screen
}

