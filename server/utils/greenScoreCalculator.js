const calculateAverageGreenScore = (scores) => {
    const scoreValues = {
      'poor': 25,
      'average': 50,
      'good': 75,
      'excellent': 100
    };
  
    const totalValue = scores.reduce((sum, score) => sum + scoreValues[score], 0);
    const averageValue = totalValue / scores.length;
  
    // Convert numerical average back to category
    if (averageValue <= 25) return 'poor';
    if (averageValue <= 50) return 'average';
    if (averageValue <= 75) return 'good';
    return 'excellent';
  };
  
  module.exports = { calculateAverageGreenScore };