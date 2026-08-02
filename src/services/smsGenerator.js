// Claude API (claude-sonnet-4-6 simulation) for Localized Emergency SMS Broadcast

export const generateClaudeSMS = (district) => {
  if (!district) return '';

  const wardStr = district.wardNumbers?.length ? `Wd ${district.wardNumbers.join(',')}` : 'All Wards';
  const campNameShort = district.nearestCamp ? district.nearestCamp.split(' ')[0] + ' ' + (district.nearestCamp.split(' ')[1] || 'School') : 'GHS Shelter';
  const distanceVal = district.nearestCamp ? district.nearestCamp.match(/\((.*?)\)/)?.[1] || '1.8km' : '1.8km';
  const safeRoad = district.safeRoute ? district.safeRoute.split(' ')[0] + ' ' + (district.safeRoute.split(' ')[1] || 'North') : 'SH45 North';
  const avoidRoad = district.avoidRoad ? district.avoidRoad.split(' ')[0] : 'NH32';

  // Format explicitly specified in prompt:
  // "FLOOD ALERT-[District] Wd [X,Y,Z] / Leave NOW via [Road] / Relief: [Camp] ([Xkm]) / Avoid [Road]. Help:1078"
  const smsMessage = `FLOOD ALERT-${district.name} ${wardStr} / Leave NOW via ${safeRoad} / Relief: ${campNameShort} (${distanceVal}) / Avoid ${avoidRoad}. Help:1078`;

  return {
    text: smsMessage,
    charCount: smsMessage.length,
    isUnder160: smsMessage.length <= 160,
    generatedBy: 'Claude-3.5-Sonnet (Pre-Flood Pre-Computed Pipeline)',
    window: 'PRE-FLOOD BROADCAST (12-24 HRS BEFORE TOWER OUTAGE)'
  };
};

export const getTargetNumbersCount = (districtKey) => {
  const counts = {
    cuddalore: 1847,
    chennai: 4250,
    thanjavur: 1420,
    madurai: 890,
    trichy: 450
  };
  return counts[districtKey?.toLowerCase()] || 1847;
};
