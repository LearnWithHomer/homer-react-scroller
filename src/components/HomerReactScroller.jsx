/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var HomerReactScroller = React.createClass({
	getDefaultProps: function() {
		return {
			component: 'span',
			touchStart: 0
		};
	},
	componentDidMount: function () {
		var viewport = this.props.viewportSelector ? document.querySelector(this.props.viewportSelector) : this.getDOMNode();
		var target = viewport.querySelector(this.props.scrollSelector);
		if (this.props.setMaxHeight) {
			viewport.style.height = target.scrollHeight + 'px';
		}
	},
	scrollToBottom: function () {
		var viewport = this.props.viewportSelector ? document.querySelector(this.props.viewportSelector) : this.getDOMNode();
		var target = viewport.querySelector(this.props.scrollSelector);
		var e = {
			currentTarget: viewport,
			deltaY: target.scrollHeight
		};
		this._scroll(e);
	},
	_scroll: function (e) {
		e.stopPropagation();
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
	_touchEnd: function (e) {
		var upDown = this.props.scrollDirection === 'y';
		var viewport = this.getDOMNode();
		var end = e.nativeEvent.changedTouches[0][(upDown ? 'clientY' : 'clientX')];
		var e = {
			currentTarget: viewport,
			deltaY: this.state.touchStart - end
		};
		this._scroll(e);
	},
	render: function () {
		var el = React.createElement(this.props.component, this.props);
		return React.cloneElement(el, {onWheel: this._scroll, onTouchStart: this._touchStart, onTouchEnd: this._touchEnd});
	}
});

module.exports = HomerReactScroller;