function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return 'به تازگی';

    return Math.round(elapsed / 1000) + ' ثانیه پیش';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' دقیقه پیش';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' ساعت پیش';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' روز پیش';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' ماه پیش';
  } else {
    return Math.round(elapsed / msPerYear) + ' سال پیش';
  }
}

module.exports = timeDifference;
