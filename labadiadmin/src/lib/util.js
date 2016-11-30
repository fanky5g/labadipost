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
