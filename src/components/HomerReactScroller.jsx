'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Impetus = require('impetus');

const HomerReactScroller = React.createClass({
	propTypes: {
		viewportSelector: React.PropTypes.element,
		className: React.PropTypes.string,
		component: React.PropTypes.string,
		children: React.PropTypes.object,
		scrollDirection: React.PropTypes.string,
		scrollSelector: React.PropTypes.string,
		overscroll: React.PropTypes.number,
		setMaxHeight: React.PropTypes.bool,
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
	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('resize', this.setup, false);
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
			window.addEventListener('resize', this.setup, false);
		}
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
		return React.createElement(this.props.component, props, this.props.children);
	},
});

module.exports = HomerReactScroller;