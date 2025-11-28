export const getHeatIndexCategory = (apparentTempC) => {
  if (apparentTempC < 27)
    return { category: "Caution", color: "#FFFF00", level: 1 };
  if (apparentTempC < 32)
    return { category: "Extreme Caution", color: "#FFA500", level: 2 };
  if (apparentTempC < 41)
    return { category: "Danger", color: "#FF4500", level: 3 };
  if (apparentTempC < 54)
    return { category: "Extreme Danger", color: "#8B0000", level: 4 };
  return { category: "Extreme Danger", color: "#8B0000", level: 4 };
};
