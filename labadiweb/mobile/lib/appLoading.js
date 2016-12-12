export default class AppLoading {
  constructor() {
    if (typeof document === 'undefined') {
      throw new Error('use only in BROWSER environments');
    }
  }

  opts = {
    className: 'app-loading',
    loadingBar: '.loading-bar',
    color: null,
  };

  start = (color) => {
    this.showBar(color);
    return this;
  };

  stop = () => {
    this.hideBar();
    return this;
  };

  getBar = () => {
    let bar = document.querySelector(this.opts.loadingBar);
    if (!bar) {
      bar = this.initBar();
    }
    return bar;
  };

  hideBar = () => {
    document.querySelector('body').classList.remove(this.opts.className);
    this.getBar().style.backgroundColor = null;
  };

  showBar = (color) => {
    const bar = this.getBar();
    if (this.opts.color) {
      bar.style.backgroundColor = this.opts.color;
    }
    if (color) {
      bar.style.backgroundColor = color;
    }
    document.querySelector('body').classList.add(this.opts.className);
  };

  initBar = () => {
    const bar = document.createElement('div');
    bar.className = this.opts.loadingBar.substring(1);
    document.body.appendChild(bar);
    return bar;
  };

  setColor = (color) => {
    this.opts.color = color;
    this.getBar().style.backgroundColor = color;
    return this;
  };
}