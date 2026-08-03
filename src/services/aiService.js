// FloodGuard AI — Alert Text Generator + Free Multilingual Translation

// Maps our language names to MyMemory's language codes
const LANGUAGE_CODES = {
  English: 'en',
  Tamil: 'ta',
  Telugu: 'te',
  Kannada: 'kn',
  Malayalam: 'ml',
  Hindi: 'hi'
};

/**
 * Translate text using the free MyMemory Translation API.
 * No API key or signup required.
 */
async function translateText(text, targetLanguage) {
  const targetCode = LANGUAGE_CODES[targetLanguage];
  if (!targetCode || targetCode === 'en') return text;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const translated = data?.responseData?.translatedText;
      if (translated) {
        return translated;
      }
    }
  } catch (err) {
    console.warn('MyMemory translation failed, using English fallback:', err);
  }

  return text; // fallback to English if translation fails
}

/**
 * Build the base English SMS alert (deterministic template, always under 160 chars).
 */
function buildEnglishSMS(districtData) {
  const wardsStr = districtData.wards?.length > 0 ? districtData.wards.join(',') : 'All';
  const shortCamp = districtData.nearestCamp?.split(' (')[0] || 'Relief Camp';
  const shortRoute = districtData.safeRoute?.split(' ')[0] || districtData.safeRoute;
  const shortAvoid = districtData.avoidRoad?.split(' (')[0] || districtData.avoidRoad;

  let sms = `FLOOD ALERT-${districtData.name.toUpperCase()} Wd ${wardsStr} / Leave NOW via ${districtData.safeRoute} / Relief: ${districtData.nearestCamp} / Avoid ${districtData.avoidRoad}. Help:1078`;

  if (sms.length > 160) {
    sms = `FLOOD ALERT-${districtData.name.toUpperCase()} Wd ${wardsStr} / Leave NOW via ${shortRoute} / Relief:${shortCamp} / Avoid:${shortAvoid}. Call 1078`;
  }

  return sms.slice(0, 160);
}

/**
 * Generate SMS Alert, translated into the selected language using the free MyMemory API.
 * apiKey is no longer required — kept as a parameter for compatibility, unused.
 */
export async function generateSMSAlert(districtData, apiKey = null, language = 'English') {
  const englishSMS = buildEnglishSMS(districtData);

  if (language === 'English') {
    return englishSMS;
  }

  const translated = await translateText(englishSMS, language);
  return translated;
}

/**
 * Generate Risk Explanation line, translated into the selected language.
 */
export async function generateRiskExplanation(districtData, apiKey = null, language = 'English') {
  const englishLine = `High risk due to: ${districtData.rainfall48h}mm rainfall in 48hrs + river at ${districtData.riverCapacity}% capacity + saturated soil from prior week's rain`;

  if (language === 'English') {
    return englishLine;
  }

  const translated = await translateText(englishLine, language);
  return translated;
}