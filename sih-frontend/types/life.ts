export interface LifeNotificationData {
    postOfficeId: string;
    lifeScore: number;
    parameters: {
      area: string;
      plasticAmount: number;
      recyclableWaste: number;
      messiness: number;
      binCount: number;
      overflowStatus: number;
      timestamp: string;
    };
    message: string;
  }
  
  export interface LifeMetrics {
    area: string;
    plasticAmount: number;
    recyclableWaste: number;
    messiness: number;
    binCount: number;
    overflowStatus: number;
    timestamp: string;
  }