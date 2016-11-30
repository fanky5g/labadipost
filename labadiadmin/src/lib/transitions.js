import { spring } from 'react-motion';

const fadeTransitionConfig = { stiffness: 200, damping: 22 };
const popTransitionConfig = { stiffness: 360, damping: 25 };
const slideTransitionConfig = { stiffness: 330, damping: 30 };

export const noTransition = {
  atEnter: {
    opacity: 1,
    scale: 1,
    offset: 0,
  },
  atLeave: {
    opacity: spring(1, fadeTransitionConfig),
    scale: spring(1, popTransitionConfig),
    offset: spring(0, slideTransitionConfig),
  },
  atActive: {
    opacity: spring(1, fadeTransitionConfig),
    scale: spring(1, popTransitionConfig),
    offset: spring(0, slideTransitionConfig),
  },
  mapStyles: (styles) => ({
    position: 'absolute',
    top: '65px',
    boxSizing: 'border-box',
    width: '100%',
    height: 'calc(100% - 270px)',
    opacity: styles.opacity,
    transform: `translateX(${styles.offset}%) scale(${styles.scale})`,
  }),
};

export const fadeTransition = {
  atEnter: Object.assign({}, noTransition.atEnter, { opacity: 0 }),
  atLeave: Object.assign({}, noTransition.atLeave, { opacity: spring(0, fadeTransitionConfig) }),
  atActive: Object.assign({}, noTransition.atLeave, { opacity: spring(1, fadeTransitionConfig) }),
  mapStyles: noTransition.mapStyles,
};

export const popTransition = {
  atEnter: Object.assign({}, noTransition.atEnter, { scale: 0.8 }),
  atLeave: Object.assign({}, noTransition.atLeave, { scale: spring(0.8, popTransitionConfig) }),
  atActive: Object.assign({}, noTransition.atLeave, { scale: spring(1, popTransitionConfig) }),
  mapStyles: noTransition.mapStyles,
};

export const slideLeftTransition = {
  atEnter: Object.assign({}, noTransition.atEnter, { offset: 100 }),
  atLeave: Object.assign({}, noTransition.atLeave, { offset: spring(-100, slideTransitionConfig) }),
  atActive: Object.assign({}, noTransition.atLeave, { offset: spring(0, slideTransitionConfig) }),
  mapStyles: noTransition.mapStyles,
};

export const slideRightTransition = {
  atEnter: Object.assign({}, noTransition.atEnter, { offset: -100 }),
  atLeave: Object.assign({}, noTransition.atLeave, { offset: spring(100, slideTransitionConfig) }),
  atActive: Object.assign({}, noTransition.atLeave, { offset: spring(0, slideTransitionConfig) }),
  mapStyles: noTransition.mapStyles,
};
