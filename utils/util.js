function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getTime(ts){
  return new Date(parseInt(ts) * 1000).toLocaleString().substr(0,17)
}

function getDate(ts){
  return new Date(parseInt(ts) * 1000).toLocaleString().substr(0,10)
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  getTime: getTime,
  getDate: getDate
}