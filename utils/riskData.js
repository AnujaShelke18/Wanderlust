// Levels: 0 = Low, 1 = Moderate, 2 = Elevated
const LEVEL_NAMES = ["Low", "Moderate", "Elevated"];

// General, hand-written guidance. Edit freely.
const countries = {
  "India": {
    aliases: [], base: 1,
    notes: [
      "Drink bottled or filtered water and be careful with street food.",
      "Carry travel insurance and copies of your documents.",
    ],
    seasonal: [
      { months: [6, 7, 8, 9], level: 1, note: "Monsoon season: heavy rain, flooding and transport delays are common." },
      { months: [4, 5], level: 1, note: "Extreme heat in many regions. Stay hydrated and avoid midday travel." },
      { months: [12, 1], level: 0, note: "Fog in the north can delay flights and trains." },
    ],
  },
  "United States": {
    aliases: ["usa", "us", "america"], base: 0,
    notes: ["Travel insurance is advisable because medical costs are high."],
    seasonal: [
      { months: [6, 7, 8, 9, 10, 11], level: 1, note: "Atlantic hurricane season affects the Gulf and East coasts." },
      { months: [12, 1, 2], level: 0, note: "Winter storms can disrupt flights in the north." },
    ],
  },
  "Italy": {
    aliases: [], base: 0,
    notes: ["Watch for pickpockets in busy tourist areas."],
    seasonal: [{ months: [7, 8], level: 1, note: "Summer heat waves are common. Plan sightseeing for mornings and evenings." }],
  },
  "Mexico": {
    aliases: [], base: 1,
    notes: [
      "Check regional advisories before choosing where to go, since conditions vary a lot by area.",
      "Use licensed taxis or ride apps.",
    ],
    seasonal: [{ months: [6, 7, 8, 9, 10, 11], level: 1, note: "Hurricane season affects both coasts." }],
  },
  "Tanzania": {
    aliases: [], base: 1,
    notes: ["Ask a doctor about malaria prevention and required vaccinations well before you go."],
    seasonal: [{ months: [3, 4, 5], level: 1, note: "The long rains can make roads and some parks hard to reach." }],
  },
  "Netherlands": {
    aliases: ["holland"], base: 0,
    notes: ["Bike lanes are busy, so watch for cyclists.", "Pickpockets operate around stations and crowded areas."],
    seasonal: [{ months: [11, 12, 1, 2], level: 0, note: "Short days and cold, wet weather." }],
  },
  "Thailand": {
    aliases: [], base: 1,
    notes: ["Use licensed transport and be careful if you rent a scooter."],
    seasonal: [{ months: [5, 6, 7, 8, 9, 10], level: 1, note: "Rainy season: flooding and travel delays are possible." }],
  },
  "Japan": {
    aliases: [], base: 0,
    notes: ["Learn the basic earthquake safety steps for your hotel."],
    seasonal: [{ months: [6, 7, 8, 9, 10], level: 1, note: "Typhoon season can cancel transport and flights." }],
  },
  "France": {
    aliases: [], base: 0,
    notes: ["Watch for pickpockets in tourist areas and on public transport."],
    seasonal: [{ months: [7, 8], level: 1, note: "Summer heat waves, especially in the south and in Paris." }],
  },
  "United Kingdom": {
    aliases: ["uk", "england", "scotland", "wales", "britain"], base: 0,
    notes: ["Weather changes fast, so carry a rain layer."],
    seasonal: [{ months: [12, 1, 2], level: 0, note: "Winter weather can disrupt rail and road travel." }],
  },
  "Australia": {
    aliases: [], base: 0,
    notes: ["The sun is strong, so use sun protection."],
    seasonal: [
      { months: [12, 1, 2, 3], level: 1, note: "Heat and bushfire risk in many regions." },
      { months: [11, 12, 1, 2, 3, 4], level: 1, note: "Stinger jellyfish season in northern waters. Swim only in marked areas." },
    ],
  },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function findCountry(text) {
  const t = text.toLowerCase();
  return Object.keys(countries).find((name) => {
    const names = [name.toLowerCase(), ...countries[name].aliases];
    return names.some((n) => new RegExp(`\\b${escapeRegex(n)}\\b`).test(t));
  });
}

function assess(destination, start, end) {
  const name = findCountry(destination);
  if (!name) return { found: false };

  const months = new Set();
  const d = new Date(start);
  while (d <= end) {
    months.add(d.getUTCMonth() + 1);
    d.setUTCDate(d.getUTCDate() + 1);
  }

  const data = countries[name];
  const seasonal = data.seasonal.filter((s) => s.months.some((m) => months.has(m)));
  const level = Math.max(data.base, ...seasonal.map((s) => s.level));

  return {
    found: true,
    country: name,
    level,
    levelName: LEVEL_NAMES[level],
    notes: data.notes,
    seasonal: seasonal.map((s) => s.note),
  };
}

module.exports = { assess };