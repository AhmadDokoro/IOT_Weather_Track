const sensors = [
  { field: "field1", name: "Temperature", unit: "°C", icon: "🌡️" },
  { field: "field2", name: "Humidity", unit: "%", icon: "💧" },
  // Field3 is Brightness but displayed as "Light Intensity"
  { field: "field3", name: "Light Intensity", unit: "%", icon: "☀️" },
  // Field4 is Distance but represents Water Level in cm
  { field: "field4", name: "Water Level", unit: "cm", icon: "📏" },
  { field: "field5", name: "Motion", unit: "", icon: "🚶" },
  { field: "field6", name: "Rain", unit: "", icon: "🌧️" }
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

    // determine display value and dynamic icon/labels for specific fields
    let displayValue = value;
    let iconHtml = sensor.icon;
    let statusHtml = '';

    // Field3: Brightness -> display as Light Intensity with Day/Night logic
    if (sensor.field === 'field3') {
      const numeric = value === "--" ? NaN : Number(value);
      if (!isNaN(numeric)) {
        if (numeric < 50) { iconHtml = '🌙'; displayValue = `${numeric} ${sensor.unit}`; statusHtml = `<div class="status"><span class="status-label">Night</span></div>`; }
        else { iconHtml = '☀️'; displayValue = `${numeric} ${sensor.unit}`; statusHtml = `<div class="status"><span class="status-label">Day</span></div>`; }
      } else {
        displayValue = '--';
      }
    }

    // Field4: Distance interpreted as Water Level (cm) with Danger/Warning/Safe
    if (sensor.field === 'field4') {
      const numeric = value === "--" ? NaN : Number(value);
      if (!isNaN(numeric)) {
        displayValue = `${numeric} ${sensor.unit}`;
        let statusClass = 'status-unknown';
        let statusLabel = 'Unknown';
        if (numeric < 30) { statusClass = 'status-red'; statusLabel = 'Danger'; }
        else if (numeric <= 150) { statusClass = 'status-amber'; statusLabel = 'Warning'; }
        else { statusClass = 'status-green'; statusLabel = 'Safe'; }
        statusHtml = `<div class="status"><span class="status-bulb ${statusClass}" aria-hidden="true"></span><span class="status-label">${statusLabel}</span></div>`;
      } else {
        displayValue = '--';
        statusHtml = `<div class="status"><span class="status-bulb status-unknown" aria-hidden="true"></span><span class="status-label">Unknown</span></div>`;
      }
    }

    // Field5: Motion mapping
    if (sensor.field === 'field5') {
      if (value === "1" || value === 1) displayValue = 'Human Detected';
      else displayValue = 'No Motion';
    }

    // Field6: Rain mapping (truthy -> Rain)
    if (sensor.field === 'field6') {
      const numeric = Number(value);
      if (!isNaN(numeric) && numeric > 0) displayValue = 'Rain';
      else if (!isNaN(numeric) && numeric === 0) displayValue = 'No Rain';
      else displayValue = value === '--' ? '--' : String(value);
    }

    card.innerHTML = `
      <div class="icon">${iconHtml}</div>
      <h3>${sensor.name}</h3>
      <p class="value">${displayValue}${(sensor.field !== 'field5' && sensor.field !== 'field6' && sensor.field !== 'field3') ? ' ' + sensor.unit : ''}</p>
      ${statusHtml}
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
