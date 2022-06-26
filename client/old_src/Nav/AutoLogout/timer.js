const ONE_SECOND = 1000;
const timer = (time, listener) => {
  let min = time[0];
  let sec = time[1];
  let secondsCounter = time[1];
  const intervalId = setInterval(() => {
    sec -= 1;
    secondsCounter -= 1;
    if (sec < 0) {
      sec = 59;
    }
    if (sec === 59) {
      min -= 1;
    }
    listener({
      sec,
      min,
      secondsCounter
    });
  }, ONE_SECOND);
  return intervalId;
};

export default timer;
