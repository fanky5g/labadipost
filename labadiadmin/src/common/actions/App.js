export function downloadFile(path) {
  return {
    type: 'DOWNLOAD',
    promise: (client) => client.get(`/download?path=${path}`),
  };
}

// the environment code is borrowed from Andrew Ngu, https://github.com/andrewngu/sound-redux
function changeIsMobile(isMobile) {
  return {
    type: 'CHANGE_IS_MOBILE',
    isMobile,
  };
}

function changeWidthAndHeight(screenHeight, screenWidth) {
  return {
    type: 'CHANGE_WIDTH_AND_HEIGHT',
    screenHeight,
    screenWidth,
  };
}

export function initEnvironment() {
  return dispatch => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    dispatch(changeIsMobile(isMobile));
    dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

    window.onresize = () => {
      dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));
    };
  };
}
