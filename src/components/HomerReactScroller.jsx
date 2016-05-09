/** @jsx React.DOM */
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var HomerReactScroller = React.createClass({
	defaultProps: function() {
		return {
			component: 'span',
			touchStart: 0
		};
	},
	componentDidMount: function () {
		var viewport = this.props.viewportSelector ? document.querySelector(this.props.viewportSelector) : ReactDOM.findDOMNode(this);
		var target = viewport.querySelector(this.props.scrollSelector);
		if (this.props.setMaxHeight) {
			viewport.style.height = target.scrollHeight + 'px';
		}
	},
	scrollToBottom: function () {
		var viewport = this.props.viewportSelector ? document.querySelector(this.props.viewportSelector) : ReactDOM.findDOMNode(this);
		var target = viewport.querySelector(this.props.scrollSelector);
		var e = {
			currentTarget: viewport,
			deltaY: target.scrollHeight
		};
		this._scroll(e);
	},
	_scroll: function (e) {
		e.stopPropagation && e.stopPropagation();
		var upDown = this.props.scrollDirection === 'y';
		var margin = upDown ? 'marginTop' : 'marginLeft';
		var viewport = e.currentTarget;
		var target = viewport.querySelector(this.props.scrollSelector);
		if (target) {
			var maxScroll = upDown ? (target.offsetHeight - viewport.offsetHeight) : (target.offsetWidth - viewport.offsetWidth);
			var currentScroll = parseInt(target.style[margin], 10) || 0;
			var newScroll = Math.min(0, Math.floor(currentScroll - e.deltaY));
			target.style[margin] = (Math.abs(newScroll) <= maxScroll ? newScroll : Math.min(-maxScroll, 0)) + 'px';
		}
	},
	_touchStart: function (e) {
		var touch = e.touches[0];
		var upDown = this.props.scrollDirection === 'y';
		this.setState({
			touchStart: (upDown ? touch.clientY : touch.clientX)
		});
	},
	_touchMove: function (e) {
		var upDown = this.props.scrollDirection === 'y';
		var viewport = ReactDOM.findDOMNode(this);
		var end = e.nativeEvent.changedTouches[0][(upDown ? 'clientY' : 'clientX')];
		var e = {
			currentTarget: viewport,
			deltaY: this.state.touchStart - end
		};
		this._scroll(e);
	},
	render: function () {
		var el = React.createElement(this.props.component, this.props);
		var events = {
			onWheel: this._scroll
		};
		if (this.props.touchEvents === true) {
			events.onTouchStart = this._touchStart;
			events.onTouchMove = this._touchMove;
		}
		return React.cloneElement(el, events);
	}
});

module.exports = HomerReactScroller;