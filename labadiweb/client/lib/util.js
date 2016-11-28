import StackBlur from 'stackblur-canvas';

export function slugify(name) {
  return name.trim().toLowerCase().replace(/[ \n!@#$%^&*():"'|?=]/g, '-');
}

export function mergeObj(...args) {
  const obj = {};
  args.forEach(arg => {
    Object.keys(arg).forEach(k => {
      obj[k] = arg[k];
    });
  });
  return obj;
}

export function getSrc(url) {
  return `http://images.labadipost.com/display?url=${url}`;
}
// images.labadipost.com/display?url=http://3news.com/wp-content/uploads/2016/11/Akufo-Addo-north2.jpg&w=500&h=300&op=resize&upscale=0

const escapeChars = {
  '\x00': '%00',
  '': '%01',
  '': '%02',
  '': '%03',
  '': '%04',
  '': '%05',
  '': '%06',
  '': '%07',
  '\b': '%08',
  '\t': '%09',
  '\n': '%0A',
  '\x0B': '%0B',
  '\f': '%0C',
  '\r': '%0D',
  '': '%0E',
  '': '%0F',
  '': '%10',
  '': '%11',
  '': '%12',
  '': '%13',
  '': '%14',
  '': '%15',
  '': '%16',
  '': '%17',
  '': '%18',
  '': '%19',
  '': '%1A',
  '': '%1B',
  '': '%1C',
  '': '%1D',
  '': '%1E',
  '': '%1F',
  ' ': '%20',
  '\'': '%22',
  '"': '%27',
  '(': '%28',
  ')': '%29',
  '\x3c': '%3C',
  '\x3e': '%3E',
  '\\': '%5C',
  '{': '%7B',
  '}': '%7D',
  '': '%7F',
  '': '%C2%85',
  ' ': '%C2%A0',
  '\u2028': '%E2%80%A8',
  '\u2029': '%E2%80%A9',
  '！': '%EF%BC%81',
  '＃': '%EF%BC%83',
  '＄': '%EF%BC%84',
  '＆': '%EF%BC%86',
  '＇': '%EF%BC%87',
  '（': '%EF%BC%88',
  '）': '%EF%BC%89',
  '＊': '%EF%BC%8A',
  '＋': '%EF%BC%8B',
  '，': '%EF%BC%8C',
  '／': '%EF%BC%8F',
  '：': '%EF%BC%9A',
  '；': '%EF%BC%9B',
  '＝': '%EF%BC%9D',
  '？': '%EF%BC%9F',
  '＠': '%EF%BC%A0',
  '［': '%EF%BC%BB',
  '］': '%EF%BC%BD'
};

const bn = (a) => {
  return escapeChars[a];
};

/* eslint:disable */
const an = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;

function cleanString(str) {
  return String(str).replace(an, bn);
};

const getPixelRatio = () => {
  let pixelRatio = 1; // just for safety
  if ('deviceXDPI' in screen) { // IE mobile or IE
    pixelRatio = screen.deviceXDPI / screen.logicalXDPI;
  } else if (window.hasOwnProperty('devicePixelRatio')) { // other devices
    pixelRatio = window.devicePixelRatio;
  }
  return pixelRatio;
};

const ql = function (a, b) {
  this.start = a < b ? a : b;
  this.end = a < b ? b : a;
};

const Kn = (a) => {
  return {
    toString: function () {
      return String(a());
    },
  };
};

const Hn = (a) => {
  return {
    valueOf: a,
    toString: () => String(Number(this)),
  };
};

export const In = (a, b, c, d) => {
  a = (d ? Math.ceil : Math.floor)(a / c) * c;
  return Math.max(Math.min(a, b.end), b.start);
};

export const Jn = new ql(200, 2E3);
const Hba = new ql(200, 2E3);

export const Iba = () => {
  const a = {};
  const b = window;
  const c = b.document;
  a.oq = Hn(() => c.body.clientWidth);
  a.YO = Hn(() => In(c.body.clientWidth, Hba, 200, !1));
  a.pw = Hn(() => In(c.body.clientWidth || 1200, Jn, 200, !0));
  a.devicePixelRatio = Hn(() => b.devicePixelRatio || 1);
  a.pathname = Kn(() => b.location.pathname);
  a.Ot = Kn(() => b.location.toString());
  a.tC = Hn(() => (new Date).getTimezoneOffset());
  return a;
};

function getMaxWidth(width, height) {
  let maxWidth;
  if ((width / height) === 1) {
    maxWidth = 800;
  } else if (width > 1200 && Math.round(width / height) !== 1.5) {
    maxWidth = 2000;
  } else if (width >= 1200 && Math.round(width / height) === 1.5 && width > 4E3) {
    maxWidth = 1200;
  } else if (width >= 1200 && Math.round(width / height) === 1.5 && width < 4E3) {
    maxWidth = 2000;
  } else if (width > 800) {
    maxWidth = 1200;
  } else if (width < 800) {
    maxWidth = 800;
  } else {
    maxWidth = 1200;
  }
  return maxWidth;
}

export function getClass(width, height) {
  let classGroup;
  if ((width / height) === 1) {
    classGroup = 1;
  } else if (width > 1200 && Math.round(width / height) !== 1.5) {
    classGroup = 2;
  } else if (width >= 1200 && Math.round(width / height) === 1.5 && width > 4E3) {
    classGroup = 3;
  } else if (width >= 1200 && Math.round(width / height) === 1.5 && width < 4E3) {
    classGroup = 4;
  } else if (width > 800 && width < 1020) {
    classGroup = 5;
  } else if (width < 800) {
    classGroup = 6;
  } else if (width > 800) {
    classGroup = 7;
  }
  return classGroup;
}

export function parseImageUrl(image, c = {}, clientWidth) {
  if (!c.hasOwnProperty('devicePixelRatio') && process.env.BROWSER) {
    c = Iba();
  } else if (!process.env.BROWSER) {
    c.devicePixelRatio = 1;
    c.pw = Hn(() => In(clientWidth || 1200, Jn, 200, !0));
  }
  let b = 'http://images.labadipost.com/display?url=';

  if (image.url) {
    b += image.url;
    let e = image.q0 ? getMaxWidth(image.width || c.pw, image.height || .8 * image.width) : image.width || c.pw;
    let g = image.height ? image.height : Math.round(.8 * e);
    let k = c.devicePixelRatio && !image.q0 ? Math.min(e * c.devicePixelRatio, 5 <= e / g ? 4E3 : 2E3) / e : 1;
    e = Math.round(e * k);
    g = Math.round(g * k);

    switch (image.strategy) {
    case 'crop-fixed':
      b += '&op=resize&w=' + cleanString(e) + '&h=' + cleanString(g);
      break;
    case 'crop-preserve':
      b += '&op=fit&w=' + cleanString(e) + '&h=' + cleanString(Math.round(image.height * e));
      break;
    case 'resample':
    default:
      b += '&op=resize&w=' + cleanString(e);
      break;
    }
    b += image.quality ? `&q=${image.quality}` : '';
    b += image.upscale ? '&upscale=1' : '&upscale=0';
  }
  return b;
}

export function drawCanvasWithBlur(canvas, thumbnail, blurRadius) {
  const context = canvas.getContext('2d');

  context.drawImage(thumbnail, 0, 0,
    thumbnail.naturalWidth, thumbnail.naturalHeight,
    0, 0, canvas.width, canvas.height);

  StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blurRadius);
}

export const getDefaultWidth = (ua, clientWidth) => {
  const {
    isAndroidTablet,
    isMobile,
    isipad,
    isiphone,
    isAndroid,
    isDesktop,
    isOpera,
    isTablet
  } = ua;

  if (clientWidth) return clientWidth;
  let width; // uses min width for now

  if (isMobile && isiphone) {
    width = 320;
  } else if (isMobile && isOpera) {
    width = 600;
  } else if (isMobile && isAndroid) {
    width = 480;
  } else if (isTablet && isAndroidTablet) {
    width = 480;
  } else if (isTablet && isipad) {
    width = 1024;
  } else {
    width = 1366;
  }
  return width;
};