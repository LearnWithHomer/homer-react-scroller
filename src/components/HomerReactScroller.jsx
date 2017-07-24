'use strict';

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const Impetus = require('impetus');
const { isEqual } = require('lodash');

class HomerReactScroller extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: undefined,
      target: undefined,
      upDown: undefined,
    }

    this.maxScroll = 0;
    this.targetHeight = 0;

    this.momentum = this.momentum.bind(this);
    this.setup = this.setup.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  componentDidMount() {
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
    window.addEventListener('resize', this.setup, false);
    window.addEventListener('load', this.setup, false);
    if (this.isMobile()) {
      window.addEventListener('orientationchange', this.calculateMaxScroll);
    }
  }

  componentDidUpdate(props) {
    if (!isEqual(this.props, props)) {
      this.setup();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setup, false);
    window.removeEventListener('load', this.setup, false);
  }

  setWidthForYScroll() {
    const target = this.state.target;
    let totalWidth = 0;
    target.childNodes.forEach((element) => {
      totalWidth += element.clientWidth;
    });
    target.style.width = `${totalWidth}px`;
  }

  setup() {
    if (!this.state.target) {
      requestAnimationFrame(this.setup);
      return;
    }
    if (!this.state.upDown) {
      // we're going side to side, so force the width of the containing element to fit all elements
      this.setWidthForYScroll();
    }

    this.calculateMaxScroll();
  }

  calculateMaxScroll() {
    const viewport = this.state.viewport;
    const target = this.state.target;

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
      this.targetHeight = target.offsetHeight,
        this.maxScroll = maxScroll + this.state.overscroll;
    }
  }

  scrollToBottom() {
    this.scroll({
      deltaY: this.state.target.scrollHeight,
    });
  }

  isMobile() {
    return navigator.userAgent.match(/Android|iPhone|iPad/i);
  }

  momentum(x, y) {
    if (this.isMobile()) {

      const delta = this.state.upDown ? y : x;
      const deltaRounded = Math.floor(delta);

      this.state.target.style[this.state.margin] = `${Math.floor(deltaRounded)}px`;
    }
  }

  scroll(e) {
    e.stopPropagation && e.stopPropagation();
    const margin = this.state.margin;
    const target = this.state.target;
    const currentScroll = parseInt(target.style[margin], 10) || 0;
    const newScroll = Math.min(0, Math.floor(currentScroll - e.deltaY));
    const newMargin = Math.abs(newScroll) <= this.maxScroll ? newScroll : Math.min(-this.maxScroll, 0);
    target.style[margin] = `${newMargin}px`;
  }

  render() {
    const props = {
      onWheel: this.scroll,
      className: this.props.className,
    };
    const el = React.createElement(this.props.component, props, this.props.children);
    return el;
  }
}

HomerReactScroller.propTypes = {
  viewportSelector: PropTypes.element,
  className: PropTypes.string,
  component: PropTypes.string,
  scrollDirection: PropTypes.string,
  scrollSelector: PropTypes.string,
  overscroll: PropTypes.number,
  setMaxHeight: PropTypes.bool,
  update: PropTypes.bool,
}

HomerReactScroller.defaultProps = {
  component: 'span',
  touchStart: 0,
}

module.exports = HomerReactScroller;