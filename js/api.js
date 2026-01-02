async function fetchLatest() {
  const url = `${THINGSPEAK.BASE_URL}/${THINGSPEAK.CHANNEL_ID}/feeds/last.json?api_key=${THINGSPEAK.READ_API_KEY}`;
  return fetch(url).then(res => res.json());
}

async function fetchHistory(results = 200) {
  const url = `${THINGSPEAK.BASE_URL}/${THINGSPEAK.CHANNEL_ID}/feeds.json?results=${results}`;
  return fetch(url).then(res => res.json());
}
