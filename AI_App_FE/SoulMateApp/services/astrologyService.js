// services/astrologyService.js
const API_KEY = 'ByNqfA4kvD1EBGyi6ZlUC8aekqCi7FgF8VuJ8SF1';
const BASE_URL = 'https://json.freeastrologyapi.com/western';

// Helper: delay để tránh vượt quá 1 request/second
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Parse địa chỉ thành lat/long (dùng Geocoding API)
async function getCoordinates(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    // Default to Hanoi if not found
    return { latitude: 21.0285, longitude: 105.8542 };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { latitude: 21.0285, longitude: 105.8542 };
  }
}

// Helper: Parse date và time
function parseDateTime(birthDate, birthTime) {
  const [year, month, date] = birthDate.split('-').map(Number);
  const [hours, minutes] = birthTime.split(':').map(Number);
  return { year, month, date, hours, minutes, seconds: 0 };
}

// Helper: Tính timezone offset
function getTimezoneOffset(date) {
  const offset = -date.getTimezoneOffset() / 60;
  return offset;
}

// Tạo request body
function createRequestBody(birthDate, birthTime, latitude, longitude) {
  const dateTime = parseDateTime(birthDate, birthTime);
  const date = new Date(birthDate + 'T' + birthTime);
  const timezone = getTimezoneOffset(date);

  return {
    ...dateTime,
    latitude,
    longitude,
    timezone,
    config: {
      observation_point: 'topocentric',
      ayanamsha: 'tropical',
      house_system: 'Placidus',
      language: 'en',
      exclude_planets: ['Lilith', 'Chiron', 'Ceres', 'Vesta', 'Juno', 'Pallas'],
      allowed_aspects: ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      orb_values: {
        Conjunction: 3,
        Opposition: 5,
        Square: 5,
        Trine: 5,
        Sextile: 5,
      },
    },
  };
}

// Call API với retry logic
async function callAPI(endpoint, requestBody, retryCount = 3) {
  for (let i = 0; i < retryCount; i++) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed (attempt ${i + 1}/${retryCount}):`, error);
      if (i === retryCount - 1) throw error;
      await delay(2000); // Wait 2s before retry
    }
  }
}

// Lấy thông tin hành tinh
async function getPlanetsInfo(requestBody) {
  const data = await callAPI('planets', requestBody);
  const planets = {};
  
  if (data.output && Array.isArray(data.output)) {
    data.output.forEach(item => {
      const planetName = item.planet.en.toLowerCase();
      if (['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(planetName)) {
        planets[planetName] = item.zodiac_sign.name.en;
      }
    });
  }
  
  return planets;
}

// Lấy thông tin cung
async function getHousesInfo(requestBody) {
  await delay(1100); // Rate limit: 1 request/second
  const data = await callAPI('houses', requestBody);
  const houses = {};
  
  if (data.output && data.output.Houses) {
    data.output.Houses.forEach(item => {
      houses[`house${item.House}`] = item.zodiac_sign.name.en;
    });
  }
  
  return houses;
}

// Lấy thông tin góc cạnh
async function getAspectsInfo(requestBody) {
  await delay(1100);
  const data = await callAPI('aspects', requestBody);
  const aspects = {
    conjunction: [],
    opposition: [],
    trine: [],
    square: [],
    sextile: [],
  };
  
  if (data.output && Array.isArray(data.output)) {
    data.output.forEach(item => {
      const aspectType = item.aspect.en.toLowerCase();
      const aspectString = `${item.planet_1.en} - ${item.planet_2.en}`;
      
      if (aspectType === 'conjunction') aspects.conjunction.push(aspectString);
      else if (aspectType === 'opposition') aspects.opposition.push(aspectString);
      else if (aspectType === 'trine') aspects.trine.push(aspectString);
      else if (aspectType === 'square') aspects.square.push(aspectString);
      else if (aspectType === 'sextile') aspects.sextile.push(aspectString);
    });
  }
  
  return aspects;
}

// Lấy biểu đồ natal chart
async function getNatalChart(requestBody) {
  await delay(1100);
  const data = await callAPI('natal-wheel-chart', requestBody);
  return data.output || '';
}

// Tính tỷ lệ nguyên tố dựa trên hành tinh
function calculateElementalRatio(planets) {
  const elementMap = {
    Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
    Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
    Gemini: 'air', Libra: 'air', Aquarius: 'air',
    Cancer: 'water', Scorpio: 'water', Pisces: 'water',
  };

  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  
  Object.values(planets).forEach(sign => {
    const element = elementMap[sign];
    if (element) counts[element]++;
  });

  const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
  
  return {
    fireRatio: Math.round((counts.fire / total) * 100) || 0,
    earthRatio: Math.round((counts.earth / total) * 100) || 0,
    airRatio: Math.round((counts.air / total) * 100) || 0,
    waterRatio: Math.round((counts.water / total) * 100) || 0,
  };
}

// Lấy cung hoàng đạo từ ngày sinh
function getZodiacSign(birthDate) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const zodiacSigns = [
    { name: 'Capricorn', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', start: [2, 19], end: [3, 20] },
    { name: 'Aries', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', start: [6, 21], end: [7, 22] },
    { name: 'Leo', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
  ];

  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
      return sign.name;
    }
  }
  
  return 'Unknown';
}

// Main function: Lấy toàn bộ thông tin chiêm tinh
export async function fetchAstrologyData(birthDate, birthTime, birthPlace) {
  try {
    console.log('🔮 Fetching astrology data...');
    
    // 1. Get coordinates
    const { latitude, longitude } = await getCoordinates(birthPlace);
    const requestBody = createRequestBody(birthDate, birthTime, latitude, longitude);
    
    // 2. Call APIs (with delays)
    const planets = await getPlanetsInfo(requestBody);
    const houses = await getHousesInfo(requestBody);
    const aspects = await getAspectsInfo(requestBody);
    const natalChartImage = await getNatalChart(requestBody);
    
    // 3. Calculate derived data
    const elementalRatio = calculateElementalRatio(planets);
    const zodiac = getZodiacSign(birthDate);
    
    // 4. Return complete data
    return {
      zodiac,
      ...planets,
      ...houses,
      conjunctionAspect: aspects.conjunction.join(', '),
      oppositionAspect: aspects.opposition.join(', '),
      trineAspect: aspects.trine.join(', '),
      squareAspect: aspects.square.join(', '),
      sextileAspect: aspects.sextile.join(', '),
      natalChartImage,
      ...elementalRatio,
    };
  } catch (error) {
    console.error('❌ Error fetching astrology data:', error);
    throw error;
  }
}

export default {
  fetchAstrologyData,
};