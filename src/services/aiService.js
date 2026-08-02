// Claude API & Offline AI Fallback Generator for FloodGuard AI

/**
 * Generate SMS Alert strictly under 160 characters.
 * Uses Claude API if apiKey is provided, otherwise falls back to smart offline template generator.
 */
export async function generateSMSAlert(districtData, apiKey = null) {
  if (apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `Generate a concise flood evacuation SMS under 160 characters for ${districtData.name}.
Wards affected: ${districtData.wards.join(',')}.
Safe Route: ${districtData.safeRoute}.
Relief Camp: ${districtData.nearestCamp}.
Road to Avoid: ${districtData.avoidRoad}.
Format strictly like: FLOOD ALERT-[District] Wd [X,Y] / Leave NOW via [SafeRoute] / Relief: [Camp] / Avoid [BadRoad]. Help:1078`
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text?.trim();
        if (text && text.length <= 160) {
          return text;
        }
      }
    } catch (err) {
      console.warn('Claude API call failed, falling back to local generator:', err);
    }
  }

  // Smart Offline Generator (< 160 characters guaranteed)
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
 * Generate Risk Explanation line.
 */
export async function generateRiskExplanation(districtData, apiKey = null) {
  if (apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 80,
          messages: [{
            role: 'user',
            content: `Summarize in ONE sentence why ${districtData.name} has a flood risk score of ${districtData.riskScore}/100.
Rainfall: ${districtData.rainfall48h}mm in 48h, River level: ${districtData.riverCapacity}%, Soil moisture: ${districtData.soilMoisture}%.`
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch (err) {
      console.warn('Claude API explanation call failed:', err);
    }
  }

  // Fallback line
  return `High risk due to: ${districtData.rainfall48h}mm rainfall in 48hrs + river at ${districtData.riverCapacity}% capacity + saturated soil from prior week's rain`;
}
