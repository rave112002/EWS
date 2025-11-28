export const getElevationData = async (
  barangayName,
  psgc,
  elevationCacheRef
) => {
  const elevation = elevationCacheRef.current[psgc] || 0;

  return {
    barangay: barangayName,
    elevation: elevation,
  };
};
