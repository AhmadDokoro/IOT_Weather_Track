const sensors = [
  { field: "field1", name: "Temperature", unit: "°C", icon: "🌡️" },
  { field: "field2", name: "Humidity", unit: "%", icon: "💧" },
  { field: "field3", name: "Brightness", unit: "%", icon: "☀️" },
  { field: "field4", name: "Distance", unit: "cm", icon: "📏" },
  { field: "field5", name: "Motion", unit: "", icon: "🚶" },
  { field: "field6", name: "Rain Level", unit: "%", icon: "🌧️" }
];

function renderCards(data) {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = "";
  // If no data yet, render skeletons
  if (!data) {
    sensors.forEach(() => {
      const card = document.createElement("div");
      card.className = "card skeleton";
      card.innerHTML = `
        <div class="icon">&nbsp;</div>
        <h3>&nbsp;</h3>
        <p class="value">&nbsp;</p>
        <span class="hint">&nbsp;</span>
      `;
      dashboard.appendChild(card);
    });
    return;
  }

  sensors.forEach(sensor => {
    const value = data[sensor.field] ?? "--";
    const updatedAt = data.created_at ? new Date(data.created_at).toLocaleString() : null;

    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="icon">${sensor.icon}</div>
      <h3>${sensor.name}</h3>
      <p class="value">${value} ${sensor.unit}</p>
      <div class="meta">
        <span class="hint">Click to view trend</span>
        ${updatedAt ? `<small class="updated">Updated: ${updatedAt}</small>` : ''}
      </div>
    `;

    card.onclick = () => openChart(sensor);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChart(sensor); } });
    dashboard.appendChild(card);
  });
}
