export function getButtonStyles() {
	return {
    display: 'inline-block',
    position: 'relative',
    height: '37px',
    padding: '0 16px',
    color: 'rgba(0, 0, 0, .44)',
    background: 'rgba(0, 0, 0, 0)',
    fontSize: '14px',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    border: '1px solid rgba(0, 0, 0, .15)',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
    textRendering: 'auto',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
    boxSizing: 'border-box',
    borderRadius: '999em',
    letterSpacing: 0,
    fontWeight: 400,
    fontStyle: 'normal',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    MozFontFeatureSettings: 'liga on',
	};
}

export function getButtonChromelessStyles() {
	const buttonStyles = getButtonStyles();
	return Object.assign(buttonStyles, {
    height: '37px',
		lineHeight: '35px',
		borderRadius: 0,
		boxShadow: 'none',
		height: 'auto',
		lineHeight: 'inherit',
		borderWidth: 0,
		padding: 0,
		verticalAlign: 'baseline',
		color: 'rgba(0, 0, 0, .44)',
		whiteSpace: 'normal',
		textAlign: 'left',
		lineHeight: 'inherit',
		verticalAlign: 'baseline',
		height: 'auto',
		padding: 0,
  });
}