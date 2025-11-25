export const getRainEffectType = (rainData) => {
  if (!rainData) return null;

  const { weatherCode, precipitation } = rainData;
  const isThunderstorm = weatherCode >= 95;

  let intensity = "moderate";
  if (precipitation > 10) intensity = "heavy";
  else if (precipitation < 2.5 && precipitation > 0) intensity = "light";

  return { intensity, isThunderstorm };
};
