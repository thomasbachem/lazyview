import FastScroll from 'fastscroll';
import domready from 'domready';
import assign from 'object-assign';

const getScrollPosition = () => (window.scrollY || window.pageYOffset || 0);
const getDocumentHeight = () => Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

const getAbsolutBoundingRect = (el, fixedHeight) => {
  var rect = el.getBoundingClientRect();
  var top = rect.top + getScrollPosition();
  var height = fixedHeight || rect.height;
  return {
    top: top,
    bottom: top + height,
    height: height,
    width: rect.width,
  };
};

const defaults = {
  className:  'lazyview-ative',
  addClass: false

};

export default class LazyView {

  constructor(el, options) {
    this.options = assign({}, defaults, options);
    this.el = el;
    this.state = {
      inView: false
    };
    domready(() => {
      this.init();
    });
  }

  init() {

    this.scrollTarget = (window.getComputedStyle(this.el.parentNode).overflow !== 'auto' ? window : this.el.parentNode);
    this.fastScroll = new FastScroll(this.scrollTarget);
    this.cachePosition();

    this.onScroll = this.onScroll.bind(this);
    this.fastScroll.on('scroll:start', this.onScroll);
    this.fastScroll.on('scroll:progress', this.onScroll);
    this.fastScroll.on('scroll:stop', this.onScroll);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize, false);
    window.addEventListener('orientationchange', this.onResize, false);
  }

  render() {
    if (this.options.addClass) {
      if (this.state.inView) {
        this.el.classList.add(this.options.className);
      }else {
        this.el.classList.remove(this.options.className);
      }
    }
  }

  checkInView() {
    const attr = this.fastScroll.attr();
    if (attr.scrollY >= this.position.top - this.windowHeight && attr.scrollY <= this.position.bottom) {
      if (!this.state.inView) {
        this.setState({ inView: true });
      }
    } else {
      if (this.state.inView) {
        this.setState({ inView: false });
      }
    }
  }

  cachePosition() {
    this.windowHeight = window.innerHeight;
    this.documentHeight = getDocumentHeight();
    this.position = getAbsolutBoundingRect(this.el);
  }

  setState(newState, silent) {
    this.state = newState;
    if (silent !== true) {
      this.render();
    }
  }

  onScroll() {
    this.checkInView();
  }

  onResize() {
    this.cachePosition();
    this.checkInView();
  }

}