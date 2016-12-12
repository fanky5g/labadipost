export function disposeOv() {
  return {
    type: 'DISPOSE_OVERLAY',
  };
}

export function constructOv({component, props}) {
  return {
    type: 'CONSTRUCT_OVERLAY',
    component,
    props,
  };
}

export function replaceOv({component,props}) {
  return {
    type: 'REPLACE_OVERLAY',
    component,
    props,
  };
}