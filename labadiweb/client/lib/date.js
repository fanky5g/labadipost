import moment from 'moment';

export function displayDate(intDate) {
  return moment(intDate, 'YYYYMMDD').format('MMMM DD, YYYY');
}

export function currentDate() {
  return parseInt(moment().format('YYYYMMDD'), 10);
}
