/** @jsx React.DOM */
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Impetus = require('impetus');

var HomerReactScroller = React.createClass({
	defaultProps: function() {
		return {
			component: 'span',
			touchStart: 0
		};
	},
	getInitialState: function () {
		return {
			viewport: undefined,
			target: undefined,
			upDown: undefined,
			impetus: undefined,
			maxScroll: 0
		};
	},
	componentDidMount: function () {
		var viewport = this.props.viewportSelector ? document.querySelector(this.props.viewportSelector) : ReactDOM.findDOMNode(this);
		var target = viewport.querySelector(this.props.scrollSelector);
		var upDown = this.props.scrollDirection === 'y';
		var overscroll = this.props.overscroll || 0;
		this.setState({
			viewport: viewport,
			target: target,
			margin: upDown ? 'marginTop' : 'marginLeft',
			upDown: upDown,
			overscroll: overscroll
		});
		setTimeout(this._setup, 500);
	},
	_setup: function () {
		var self = this;
		var viewport = this.state.viewport;
		var target = this.state.target;
		if (target.offsetHeight > viewport.offsetHeight || target.offsetWidth > viewport.offsetWidth) {
			console.log(target.offsetHeight, viewport.offsetHeight)
			var maxScroll = this.state.upDown ? (target.offsetHeight - viewport.offsetHeight) : (target.offsetWidth - viewport.offsetWidth);
			var impetus = new Impetus({
				source: viewport,
				update: self._momentum,
				boundY: [-(maxScroll + self.state.overscroll), 0]
			});
			if (self.props.setMaxHeight) {
				viewport.style.height = target.scrollHeight + 'px';
			}
			self.setState({
				impetus: impetus,
				maxScroll: maxScroll + self.state.overscroll
			});
		} else {
			window.requestAnimationFrame(this._setup);
		}
	},
	scrollToBottom: function () {
		this._scroll({deltaY: this.state.target.scrollHeight});
	},
	_momentum: function (x, y) {
		this.state.target.style[this.state.margin] = y + 'px';
	},
	_scroll: function (e) {
		e.stopPropagation && e.stopPropagation();
		var margin = this.state.margin;
		var target = this.state.target;
		var currentScroll = parseInt(target.style[margin], 10) || 0;
		var newScroll = Math.min(0, Math.floor(currentScroll - e.deltaY));
		target.style[margin] = (Math.abs(newScroll) <= this.state.maxScroll ? newScroll : Math.min(-this.state.maxScroll, 0)) + 'px';
	},
	render: function () {
		var el = React.createElement(this.props.component, this.props);
		var events = {
			onWheel: this._scroll
		};
		return React.cloneElement(el, events);
	}
});

module.exports = HomerReactScroller;