function calculateAngledTickInterval(width, tickUiHeight, tickCount) {
  const amountOfUiTicks = (width / tickUiHeight);
  return Math.floor(tickCount / amountOfUiTicks);
}

export {
  calculateAngledTickInterval
};
