'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Impetus = require('impetus');
const { isEqual } = require('lodash');

/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/
var attachEvent = document.attachEvent,
	stylesCreated = false;

var requestFrame = (function(){
	var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
						function(fn){ return window.setTimeout(fn, 20); };
	return function(fn){ return raf(fn); };
})();

var cancelFrame = (function(){
	var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
						   window.clearTimeout;
  return function(id){ return cancel(id); };
})();

function resetTriggers(element){
	var triggers = element.__resizeTriggers__,
		expand = triggers.firstElementChild,
		contract = triggers.lastElementChild,
		expandChild = expand.firstElementChild;
	contract.scrollLeft = contract.scrollWidth;
	contract.scrollTop = contract.scrollHeight;
	expandChild.style.width = expand.offsetWidth + 1 + 'px';
	expandChild.style.height = expand.offsetHeight + 1 + 'px';
	expand.scrollLeft = expand.scrollWidth;
	expand.scrollTop = expand.scrollHeight;
};

function checkTriggers(element){
	return element.offsetWidth != element.__resizeLast__.width ||
				 element.offsetHeight != element.__resizeLast__.height;
}

function scrollListener(e){
	var element = this;
	resetTriggers(this);
	if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
	this.__resizeRAF__ = requestFrame(function(){
		if (checkTriggers(element)) {
			element.__resizeLast__.width = element.offsetWidth;
			element.__resizeLast__.height = element.offsetHeight;
			element.__resizeListeners__.forEach(function(fn){
				fn.call(element, e);
			});
		}
	});
};

/* Detect CSS Animations support to detect element display/re-attach */
var animation = false,
	animationstring = 'animation',
	keyframeprefix = '',
	animationstartevent = 'animationstart',
	domPrefixes = 'Webkit Moz O ms'.split(' '),
	startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
	pfx  = '';
{
	var elm = document.createElement('fakeelement');
	if( elm.style.animationName !== undefined ) { animation = true; }    
	
	if( animation === false ) {
		for( var i = 0; i < domPrefixes.length; i++ ) {
			if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
				pfx = domPrefixes[ i ];
				animationstring = pfx + 'Animation';
				keyframeprefix = '-' + pfx.toLowerCase() + '-';
				animationstartevent = startEvents[ i ];
				animation = true;
				break;
			}
		}
	}
}

var animationName = 'resizeanim';
var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';

function createStyles() {
	if (!stylesCreated) {
		//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
		var css = (animationKeyframes ? animationKeyframes : '') +
				'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
				'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
			head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');
		
		style.type = 'text/css';
		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
		stylesCreated = true;
	}
}

window.addResizeListener = function(element, fn){
	if (attachEvent) element.attachEvent('onresize', fn);
	else {
		if (!element.__resizeTriggers__) {
			if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
			createStyles();
			element.__resizeLast__ = {};
			element.__resizeListeners__ = [];
			(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
			element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
																					'<div class="contract-trigger"></div>';
			element.appendChild(element.__resizeTriggers__);
			resetTriggers(element);
			element.addEventListener('scroll', scrollListener, true);
			
			/* Listen for a css animation to detect element display/re-attach */
			animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
				if(e.animationName == animationName)
					resetTriggers(element);
			});
		}
		element.__resizeListeners__.push(fn);
	}
};

window.removeResizeListener = function(element, fn){
	if (attachEvent) element.detachEvent('onresize', fn);
	else {
		element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
		if (!element.__resizeListeners__.length) {
				element.removeEventListener('scroll', scrollListener);
				element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
		}
	}
}

const HomerReactScroller = React.createClass({
	propTypes: {
		viewportSelector: React.PropTypes.element,
		className: React.PropTypes.string,
		component: React.PropTypes.string,
		scrollDirection: React.PropTypes.string,
		scrollSelector: React.PropTypes.string,
		overscroll: React.PropTypes.number,
		setMaxHeight: React.PropTypes.bool,
		update: React.PropTypes.bool,
	},
	defaultProps: function defaultProps() {
		return {
			component: 'span',
			touchStart: 0,
		};
	},
	getInitialState: function getInitialState() {
		return {
			viewport: undefined,
			target: undefined,
			upDown: undefined,
			impetus: undefined,
			maxScroll: 0,
		};
	},
	componentDidMount: function componentDidMount() {
		const viewport = this.props.viewportSelector ? document.querySelector(this.props.viewportSelector) : ReactDOM.findDOMNode(this);
		const target = viewport.querySelector(this.props.scrollSelector);
		const upDown = this.props.scrollDirection === 'y';
		const overscroll = this.props.overscroll || 0;
		this.setState({
			viewport,
			target,
			margin: upDown ? 'marginTop' : 'marginLeft',
			upDown,
			overscroll,
		});
		this.setup();
	},
	componentDidUpdate: function componentDidUpdate(props) {
		if (!isEqual(this.props, props)) {
			this.setup();
		}
	},
	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('resize', this.setup, false);
		window.removeResizeListener(this.state.target, this.setup);
	},
	setWidthForYScroll: function setWidthForYScroll() {
		const target = this.state.target;
		let totalWidth = 0;
		target.childNodes.forEach((element) => {
			totalWidth += element.clientWidth;
		});
		target.style.width = `${totalWidth}px`;
	},
	setup: function setup() {
		const viewport = this.state.viewport;
		const target = this.state.target;
		
		if (!this.state.target) {
			requestAnimationFrame(this.setup);
			return;
		}
		if (!this.state.upDown) {
			// we're going side to side, so force the width of the containing element to fit all elements
			this.setWidthForYScroll();
		}
		window.addEventListener('resize', this.setup, false);
		if (target.offsetHeight > viewport.offsetHeight || target.offsetWidth > viewport.offsetWidth) {
			const maxScroll = this.state.upDown ? (target.offsetHeight - viewport.offsetHeight) : (target.offsetWidth - viewport.offsetWidth);
			const impetus = new Impetus({
				source: viewport,
				update: this.momentum,
				boundY: [-(maxScroll + this.state.overscroll), 0],
				boundX: [-(maxScroll + this.state.overscroll), 0],
			});
			if (this.props.setMaxHeight) {
				viewport.style.height = `${target.scrollHeight}px`;
			}
			this.setState({
				impetus,
				maxScroll: maxScroll + this.state.overscroll,
			});
		}
		window.addResizeListener(target, this.setup);
	},
	scrollToBottom: function scrollToBottom() {
		this.scroll({
			deltaY: this.state.target.scrollHeight,
		});
	},
	momentum: function momentum(x, y) {
		const delta = this.state.upDown ? y : x;
		this.state.target.style[this.state.margin] = `${delta}px`;
	},
	scroll: function scroll(e) {
		e.stopPropagation && e.stopPropagation();
		const margin = this.state.margin;
		const target = this.state.target;
		const currentScroll = parseInt(target.style[margin], 10) || 0;
		const newScroll = Math.min(0, Math.floor(currentScroll - e.deltaY));
		const newMargin = Math.abs(newScroll) <= this.state.maxScroll ? newScroll : Math.min(-this.state.maxScroll, 0);
		target.style[margin] = `${newMargin}px`;
	},
	render: function render() {
		const props = {
			onWheel: this.scroll,
			className: this.props.className,
		};
		const el = React.createElement(this.props.component, props, this.props.children);

		return el;
	},
});

module.exports = HomerReactScroller;