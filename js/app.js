async function init() {
  const latest = await fetchLatest();
  renderCards(latest);
}

setInterval(init, 5000);
init();
