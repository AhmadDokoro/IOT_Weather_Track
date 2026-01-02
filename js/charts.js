let chartInstance = null;
let lastFocusedElement = null;

async function openChart(sensor) {
  const modal = document.getElementById("chartModal");
  const titleEl = document.getElementById("chartTitle");
  const closeBtn = document.getElementById("closeModal");

  lastFocusedElement = document.activeElement;
  modal.classList.remove("hidden");
  titleEl.innerText = sensor.name + " Trend";

  closeBtn.focus();

  // Wire close behavior immediately so the button works while data is loading
  function closeModal() {
    modal.classList.add('hidden');
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }

  closeBtn.onclick = closeModal;
  document.addEventListener('keydown', onKeyDown);

  const history = await fetchHistory();
  const times = history.feeds.map(f => new Date(f.created_at).toLocaleString());
  const values = history.feeds.map(f => {
    const v = f[sensor.field];
    return v === null || v === undefined ? null : Number(v);
  });

  if (!chartInstance) {
    chartInstance = echarts.init(document.getElementById("chart"));
  } else {
    chartInstance.clear();
  }

  chartInstance.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: times, axisLabel: { formatter: (v) => v } },
    yAxis: { type: "value" },
    series: [{
      data: values,
      type: "line",
      smooth: true,
      areaStyle: { opacity: 0.25 },
      animationDuration: 800
    }]
  });

  // handlers already wired before fetching to ensure immediate responsiveness
}
