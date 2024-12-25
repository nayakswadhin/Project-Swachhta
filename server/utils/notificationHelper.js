export const calculateSeverity = (score) => {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    return 'high';
  };
  
  export const createNotificationPayload = (wasteData) => {
    const severity = calculateSeverity(wasteData.score);
    
    return {
      type: 'waste_detection',
      severity,
      message: `New waste detected at Post Office ${wasteData.postOfficeId}`,
      details: {
        postOfficeId: wasteData.postOfficeId,
        score: wasteData.score,
        totalWaste: wasteData.quantity.totalCount,
        percentageOrganicWaste: wasteData.percentageOrganicWaste,
        timestamp: new Date().toISOString()
      }
    };
  };
  
