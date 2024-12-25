export const calculateSeverity = (score: number): 'low' | 'medium' | 'high' => {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
};

export const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
  const colors = {
    low: 'bg-green-50 text-green-800 border-green-200',
    medium: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    high: 'bg-red-50 text-red-800 border-red-200'
  };
  return colors[severity];
};

export const calculateLifeSeverity = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 50) return 'high';
  if (score < 75) return 'medium';
  return 'low';
};

