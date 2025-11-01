// services/astrologyService.js
import { ZODIAC_TRANSLATIONS, PLANET_TRANSLATIONS } from "../constants/translations";

const API_KEY = '6ldXekUVQh4PJkN8TnLUN1RXYBVTPNrHa0sfdE8a';
const BASE_URL = 'https://json.freeastrologyapi.com/western';

// Helper: delay để tránh vượt quá 1 request/second
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Parse địa chỉ thành lat/long
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
      exclude_planets: [], // Không loại trừ planet nào
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
      await delay(2000);
    }
  }
}

// Lấy thông tin hành tinh (bao gồm tất cả planets)
async function getPlanetsInfo(requestBody) {
  const data = await callAPI('planets', requestBody);
  const planets = {};
  
  if (data.output && Array.isArray(data.output)) {
    data.output.forEach(item => {
      const planetName = item.planet.en.toLowerCase().replace(/\s+/g, '');
      const zodiacSign = item.zodiac_sign.name.en;
      const vietnameseSign = ZODIAC_TRANSLATIONS[zodiacSign] || zodiacSign;
      
      // Map all planets including special points
      const planetMap = {
        'ascendant': 'ascendant',
        'sun': 'sun',
        'moon': 'moon',
        'mercury': 'mercury',
        'venus': 'venus',
        'mars': 'mars',
        'jupiter': 'jupiter',
        'saturn': 'saturn',
        'uranus': 'uranus',
        'neptune': 'neptune',
        'pluto': 'pluto',
        'descendant': 'descendant',
        'mc': 'mc',
        'ic': 'ic',
      };
      
      const mappedKey = planetMap[planetName];
      if (mappedKey) {
        planets[mappedKey] = vietnameseSign;
      }
    });
  }
  
  return planets;
}

// Lấy thông tin cung nhà (chuyển sang tiếng Việt)
async function getHousesInfo(requestBody) {
  await delay(1100);
  const data = await callAPI('houses', requestBody);
  const houses = {};
  
  if (data.output && data.output.Houses) {
    data.output.Houses.forEach(item => {
      const zodiacSign = item.zodiac_sign.name.en;
      const vietnameseSign = ZODIAC_TRANSLATIONS[zodiacSign] || zodiacSign;
      houses[`house${item.House}`] = vietnameseSign;
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
      const planet1 = PLANET_TRANSLATIONS[item.planet_1.en] || item.planet_1.en;
      const planet2 = PLANET_TRANSLATIONS[item.planet_2.en] || item.planet_2.en;
      const aspectString = `${planet1} - ${planet2}`;
      
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

// Tính tỷ lệ nguyên tố (với tên tiếng Việt)
function calculateElementalRatio(planets) {
  const elementMap = {
    'Bạch Dương': 'fire', 'Sư Tử': 'fire', 'Nhân Mã': 'fire',
    'Kim Ngưu': 'earth', 'Xử Nữ': 'earth', 'Ma Kết': 'earth',
    'Song Tử': 'air', 'Thiên Bình': 'air', 'Bảo Bình': 'air',
    'Cự Giải': 'water', 'Bọ Cạp': 'water', 'Song Ngư': 'water',
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

// Tính tuổi từ ngày sinh
function calculateAge(birthDate) {
  try {
    const [year, month, day] = birthDate.split('-').map(Number);
    const today = new Date();
    let age = today.getFullYear() - year;

    // Nếu chưa tới sinh nhật năm nay thì trừ đi 1
    const hasHadBirthday =
      today.getMonth() + 1 > month ||
      (today.getMonth() + 1 === month && today.getDate() >= day);

    if (!hasHadBirthday) age--;

    return age;
  } catch (err) {
    console.error("Error calculating age:", err);
    return 0;
  }
}

// Main function: Lấy toàn bộ thông tin chiêm tinh
export async function fetchAstrologyData(birthDate, birthTime, birthPlace) {
  try {
    console.log('🔮 Fetching astrology data...');
    
    const { latitude, longitude } = await getCoordinates(birthPlace);
    const requestBody = createRequestBody(birthDate, birthTime, latitude, longitude);
    
    const planets = await getPlanetsInfo(requestBody);
    const houses = await getHousesInfo(requestBody);
    const aspects = await getAspectsInfo(requestBody);
    const natalChartImage = await getNatalChart(requestBody);
    
    const elementalRatio = calculateElementalRatio(planets);
    const age = calculateAge(birthDate);
    
    return {
      sun: planets.sun,
      age,
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