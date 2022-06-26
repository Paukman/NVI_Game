const throttle = (delay, fn) => {
  let lastTime = 0;
  let called = false;
  return (...args) => {
    called = false;
    const now = new Date();
    if (now - lastTime >= delay) {
      fn(...args);
      called = true;
      lastTime = now;
    }
    return { delay, args, called }; // returned for tests only
  };
};

export default throttle;
