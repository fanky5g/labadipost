import moment from '#node_modules/moment';

export function displayDate(intDate) {
  return moment(intDate, 'YYYYMMDD').format('MMMM DD, YYYY');
}

export function currentDate() {
  return parseInt(moment().format('YYYYMMDD'), 10);
}

export function timeAgo(time) {
	moment.updateLocale('en', {
    relativeTime : {
	        future: "in %s",
	        past:   "%s",
	        s:  "s",
	        m:  "1m",
	        mm: "%dm",
	        h:  "1h",
	        hh: "%dh",
	        d:  "1d",
	        dd: "%dd",
	        M:  "1 month",
	        MM: "%d months",
	        y:  "1y",
	        yy: "%dyrs"
	    }
	});
	let date = moment(time).fromNow();
	if (date === '2016yrs') {
		date = '~h';
	}
	return date;
}