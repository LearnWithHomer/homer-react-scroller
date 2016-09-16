(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["HomerReactScroller"] = factory(require("react"), require("react-dom"));
	else
		root["HomerReactScroller"] = factory(root["react"], root["react-dom"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const HomerReactScroller = __webpack_require__(2);

	module.exports = HomerReactScroller;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
			factory(exports, module);
		} else {
			var mod = {
				exports: {}
			};
			factory(mod.exports, mod);
			global.Impetus = mod.exports;
		}
	})(this, function (exports, module) {
		'use strict';

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

		var stopThresholdDefault = 0.3;
		var bounceDeceleration = 0.04;
		var bounceAcceleration = 0.11;

		var Impetus = function Impetus(_ref) {
			var _ref$source = _ref.source;
			var sourceEl = _ref$source === undefined ? document : _ref$source;
			var updateCallback = _ref.update;
			var _ref$multiplier = _ref.multiplier;
			var multiplier = _ref$multiplier === undefined ? 1 : _ref$multiplier;
			var _ref$friction = _ref.friction;
			var friction = _ref$friction === undefined ? 0.92 : _ref$friction;
			var initialValues = _ref.initialValues;
			var boundX = _ref.boundX;
			var boundY = _ref.boundY;
			var _ref$bounce = _ref.bounce;
			var bounce = _ref$bounce === undefined ? true : _ref$bounce;

			_classCallCheck(this, Impetus);

			var boundXmin, boundXmax, boundYmin, boundYmax, pointerLastX, pointerLastY, pointerCurrentX, pointerCurrentY, pointerId, decVelX, decVelY;
			var targetX = 0;
			var targetY = 0;
			var stopThreshold = stopThresholdDefault * multiplier;
			var ticking = false;
			var pointerActive = false;
			var paused = false;
			var decelerating = false;
			var trackingPoints = [];

			/**
	   * Initialize instance
	   */
			(function init() {
				sourceEl = typeof sourceEl === 'string' ? document.querySelector(sourceEl) : sourceEl;
				if (!sourceEl) {
					throw new Error('IMPETUS: source not found.');
				}

				if (!updateCallback) {
					throw new Error('IMPETUS: update function not defined.');
				}

				if (initialValues) {
					if (initialValues[0]) {
						targetX = initialValues[0];
					}
					if (initialValues[1]) {
						targetY = initialValues[1];
					}
					callUpdateCallback();
				}

				// Initialize bound values
				if (boundX) {
					boundXmin = boundX[0];
					boundXmax = boundX[1];
				}
				if (boundY) {
					boundYmin = boundY[0];
					boundYmax = boundY[1];
				}

				sourceEl.addEventListener('touchstart', onDown);
				sourceEl.addEventListener('mousedown', onDown);
			})();

			/**
	   * Disable movement processing
	   * @public
	   */
			this.pause = function () {
				pointerActive = false;
				paused = true;
			};

			/**
	   * Enable movement processing
	   * @public
	   */
			this.resume = function () {
				paused = false;
			};

			/**
	   * Update the current x and y values
	   * @public
	   * @param {Number} x
	   * @param {Number} y
	   */
			this.setValues = function (x, y) {
				if (typeof x === 'number') {
					targetX = x;
				}
				if (typeof y === 'number') {
					targetY = y;
				}
			};

			/**
	   * Update the multiplier value
	   * @public
	   * @param {Number} val
	   */
			this.setMultiplier = function (val) {
				multiplier = val;
				stopThreshold = stopThresholdDefault * multiplier;
			};

			/**
	   * Executes the update function
	   */
			function callUpdateCallback() {
				updateCallback.call(sourceEl, targetX, targetY);
			}

			/**
	   * Creates a custom normalized event object from touch and mouse events
	   * @param  {Event} ev
	   * @returns {Object} with x, y, and id properties
	   */
			function normalizeEvent(ev) {
				if (ev.type === 'touchmove' || ev.type === 'touchstart' || ev.type === 'touchend') {
					var touch = ev.targetTouches[0] || ev.changedTouches[0];
					return {
						x: touch.clientX,
						y: touch.clientY,
						id: touch.identifier
					};
				} else {
					// mouse events
					return {
						x: ev.clientX,
						y: ev.clientY,
						id: null
					};
				}
			}

			/**
	   * Initializes movement tracking
	   * @param  {Object} ev Normalized event
	   */
			function onDown(ev) {
				var event = normalizeEvent(ev);
				if (!pointerActive && !paused) {
					pointerActive = true;
					decelerating = false;
					pointerId = event.id;

					pointerLastX = pointerCurrentX = event.x;
					pointerLastY = pointerCurrentY = event.y;
					trackingPoints = [];
					addTrackingPoint(pointerLastX, pointerLastY);

					document.addEventListener('touchmove', onMove);
					document.addEventListener('touchend', onUp);
					document.addEventListener('touchcancel', stopTracking);
					document.addEventListener('mousemove', onMove);
					document.addEventListener('mouseup', onUp);
				}
			}

			/**
	   * Handles move events
	   * @param  {Object} ev Normalized event
	   */
			function onMove(ev) {
				ev.preventDefault();
				var event = normalizeEvent(ev);

				if (pointerActive && event.id === pointerId) {
					pointerCurrentX = event.x;
					pointerCurrentY = event.y;
					addTrackingPoint(pointerLastX, pointerLastY);
					requestTick();
				}
			}

			/**
	   * Handles up/end events
	   * @param {Object} ev Normalized event
	   */
			function onUp(ev) {
				var event = normalizeEvent(ev);

				if (pointerActive && event.id === pointerId) {
					stopTracking();
				}
			}

			/**
	   * Stops movement tracking, starts animation
	   */
			function stopTracking() {
				pointerActive = false;
				addTrackingPoint(pointerLastX, pointerLastY);
				startDecelAnim();

				document.removeEventListener('touchmove', onMove);
				document.removeEventListener('touchend', onUp);
				document.removeEventListener('touchcancel', stopTracking);
				document.removeEventListener('mouseup', onUp);
				document.removeEventListener('mousemove', onMove);
			}

			/**
	   * Records movement for the last 100ms
	   * @param {number} x
	   * @param {number} y [description]
	   */
			function addTrackingPoint(x, y) {
				var time = Date.now();
				while (trackingPoints.length > 0) {
					if (time - trackingPoints[0].time <= 100) {
						break;
					}
					trackingPoints.shift();
				}

				trackingPoints.push({ x: x, y: y, time: time });
			}

			/**
	   * Calculate new values, call update function
	   */
			function updateAndRender() {
				var pointerChangeX = pointerCurrentX - pointerLastX;
				var pointerChangeY = pointerCurrentY - pointerLastY;

				targetX += pointerChangeX * multiplier;
				targetY += pointerChangeY * multiplier;

				if (bounce) {
					var diff = checkBounds();
					if (diff.x !== 0) {
						targetX -= pointerChangeX * dragOutOfBoundsMultiplier(diff.x) * multiplier;
					}
					if (diff.y !== 0) {
						targetY -= pointerChangeY * dragOutOfBoundsMultiplier(diff.y) * multiplier;
					}
				} else {
					checkBounds(true);
				}

				callUpdateCallback();

				pointerLastX = pointerCurrentX;
				pointerLastY = pointerCurrentY;
				ticking = false;
			}

			/**
	   * Returns a value from around 0.5 to 1, based on distance
	   * @param {Number} val
	   */
			function dragOutOfBoundsMultiplier(val) {
				return 0.000005 * Math.pow(val, 2) + 0.0001 * val + 0.55;
			}

			/**
	   * prevents animating faster than current framerate
	   */
			function requestTick() {
				if (!ticking) {
					requestAnimFrame(updateAndRender);
				}
				ticking = true;
			}

			/**
	   * Determine position relative to bounds
	   * @param {Boolean} restrict Whether to restrict target to bounds
	   */
			function checkBounds(restrict) {
				var xDiff = 0;
				var yDiff = 0;

				if (boundXmin !== undefined && targetX < boundXmin) {
					xDiff = boundXmin - targetX;
				} else if (boundXmax !== undefined && targetX > boundXmax) {
					xDiff = boundXmax - targetX;
				}

				if (boundYmin !== undefined && targetY < boundYmin) {
					yDiff = boundYmin - targetY;
				} else if (boundYmax !== undefined && targetY > boundYmax) {
					yDiff = boundYmax - targetY;
				}

				if (restrict) {
					if (xDiff !== 0) {
						targetX = xDiff > 0 ? boundXmin : boundXmax;
					}
					if (yDiff !== 0) {
						targetY = yDiff > 0 ? boundYmin : boundYmax;
					}
				}

				return {
					x: xDiff,
					y: yDiff,
					inBounds: xDiff === 0 && yDiff === 0
				};
			}

			/**
	   * Initialize animation of values coming to a stop
	   */
			function startDecelAnim() {
				var firstPoint = trackingPoints[0];
				var lastPoint = trackingPoints[trackingPoints.length - 1];

				var xOffset = lastPoint.x - firstPoint.x;
				var yOffset = lastPoint.y - firstPoint.y;
				var timeOffset = lastPoint.time - firstPoint.time;

				var D = timeOffset / 15 / multiplier;

				decVelX = xOffset / D || 0; // prevent NaN
				decVelY = yOffset / D || 0;

				var diff = checkBounds();

				if (Math.abs(decVelX) > 1 || Math.abs(decVelY) > 1 || !diff.inBounds) {
					decelerating = true;
					requestAnimFrame(stepDecelAnim);
				}
			}

			/**
	   * Animates values slowing down
	   */
			function stepDecelAnim() {
				if (!decelerating) {
					return;
				}

				decVelX *= friction;
				decVelY *= friction;

				targetX += decVelX;
				targetY += decVelY;

				var diff = checkBounds();

				if (Math.abs(decVelX) > stopThreshold || Math.abs(decVelY) > stopThreshold || !diff.inBounds) {

					if (bounce) {
						var reboundAdjust = 2.5;

						if (diff.x !== 0) {
							if (diff.x * decVelX <= 0) {
								decVelX += diff.x * bounceDeceleration;
							} else {
								var adjust = diff.x > 0 ? reboundAdjust : -reboundAdjust;
								decVelX = (diff.x + adjust) * bounceAcceleration;
							}
						}
						if (diff.y !== 0) {
							if (diff.y * decVelY <= 0) {
								decVelY += diff.y * bounceDeceleration;
							} else {
								var adjust = diff.y > 0 ? reboundAdjust : -reboundAdjust;
								decVelY = (diff.y + adjust) * bounceAcceleration;
							}
						}
					} else {
						if (diff.x !== 0) {
							if (diff.x > 0) {
								targetX = boundXmin;
							} else {
								targetX = boundXmax;
							}
							decVelX = 0;
						}
						if (diff.y !== 0) {
							if (diff.y > 0) {
								targetY = boundYmin;
							} else {
								targetY = boundYmax;
							}
							decVelY = 0;
						}
					}

					callUpdateCallback();

					requestAnimFrame(stepDecelAnim);
				} else {
					decelerating = false;
				}
			}
		}

		/**
	  * @see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	  */
		;

		module.exports = Impetus;
		var requestAnimFrame = (function () {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const React = __webpack_require__(3);
	const ReactDOM = __webpack_require__(4);
	const Impetus = __webpack_require__(1);

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
		setup: function setup() {
			const viewport = this.state.viewport;
			const target = this.state.target;
			if (!this.state.target) {
				requestAnimationFrame(this.setup);
				return;
			}
			if (!this.state.upDown) {
				// we're going side to side, so force the width of the containing element to fit all elements
				console.log(target);
				let totalWidth = 0;
				target.childNodes.forEach((element) => {
					totalWidth += element.clientWidth;
				});
				target.style.width = `${totalWidth}px`;
			}
			if (target.offsetHeight > viewport.offsetHeight || target.offsetWidth > viewport.offsetWidth) {
				const maxScroll = this.state.upDown ? (target.offsetHeight - viewport.offsetHeight) : (target.offsetWidth - viewport.offsetWidth);
				const impetus = new Impetus({
					source: viewport,
					update: this.momentum,
					boundY: [-(maxScroll + this.state.overscroll), 0],
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
			this.state.target.style[this.state.margin] = `${y}px`;
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }
/******/ ])
});
;