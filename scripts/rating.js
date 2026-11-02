// scripts/rating.js
// Algorytm oceny Dicka

/**
 * @param {Object} dick - Obiekt z danymi Dicka
 * @param {number} dick.length - Długość w cm
 * @param {number} dick.girth - Obwód w cm
 * @param {string} dick.ethnicity - Etniczność (np. 'white', 'black', 'latino', ...)
 * @param {string} dick.country - Kraj pochodzenia
 * @param {number} avgCountry - Średnia długość w kraju
 * @param {number} minAvg - Najniższa średnia długość na świecie
 * @param {number} maxAvg - Najwyższa średnia długość na świecie
 * @returns {Object} Wynik oceny
 */
export function rateDick(dick, countries) {
  const { length, girth, ethnicity, country, shape } = dick;
  const countryData = countries.find((entry) => entry.code === country || entry.name === country);
  const averages = countries
    .map((entry) => entry.averageErectLengthCm)
    .filter((average) => Number.isFinite(average));
  const avgCountry = countryData?.averageErectLengthCm
    ?? averages.reduce((total, average) => total + average, 0) / averages.length;
  const minAvg = Math.min(...averages);
  const maxAvg = Math.max(...averages);

  if (!Number.isFinite(avgCountry) || !Number.isFinite(minAvg) || !Number.isFinite(maxAvg)) {
    return null;
  }

  let score = 5;
  let advantages = [];
  let disadvantages = [];
  let description = '';

  // Procenty względem średnich
  const percentVsCountry = ((length - avgCountry) / avgCountry) * 100;
  const percentVsMin = ((length - minAvg) / minAvg) * 100;
  const percentVsMax = ((length - maxAvg) / maxAvg) * 100;

  // Punkty za długość
  if (length > avgCountry) {
    score += 1;
    advantages.push('Powyżej średniej krajowej');
  } else {
    score -= 1;
    disadvantages.push('Poniżej średniej krajowej');
  }
  if (length > 18) {
    score += 1.5;
    advantages.push('Wyjątkowo długi');
  } else if (length < 12) {
    score -= 1.5;
    disadvantages.push('Krótszy niż przeciętnie');
  }

  // Punkty za egzotykę
  if (['black', 'latino'].includes(ethnicity)) {
    score += 1;
    advantages.push('Egzotyczny typ');
  }

  // Punkty za obwód
  if (Number.isFinite(girth) && girth > 13) {
    score += 1;
    advantages.push('Ponadprzeciętny obwód');
  } else if (Number.isFinite(girth) && girth < 10) {
    score -= 1;
    disadvantages.push('Wąski obwód');
  }

  if (shape === 'phimosis') {
    score -= 1;
    disadvantages.push('Stulejka');
  }

  // Ograniczenie wyniku
  score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

  // Ogólny opis
  if (score >= 8) {
    description = 'Wyjątkowo imponujący okaz, z pewnością spełni oczekiwania większości kobiet.';
  } else if (score >= 6) {
    description = 'Ponadprzeciętny, bardzo dobry wynik.';
  } else if (score >= 4) {
    description = 'Przeciętny, spełni oczekiwania, ale bez fajerwerków.';
  } else {
    description = 'Poniżej przeciętnej, może nie spełnić wszystkich oczekiwań.';
  }

  // Zaspokojenie kobiety (prosty model)
  let satisfaction = score >= 7 ? 'Wysokie' : score >= 5 ? 'Średnie' : 'Niskie';

  return {
    score,
    percentVsCountry: Math.round(percentVsCountry * 10) / 10,
    percentVsMin: Math.round(percentVsMin * 10) / 10,
    percentVsMax: Math.round(percentVsMax * 10) / 10,
    satisfaction,
    advantages,
    disadvantages,
    description
  };
}

