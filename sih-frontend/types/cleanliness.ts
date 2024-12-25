export interface CleanlinessScore {
    postOfficeId: string;
    responseTime: Date;
    percentageOrganicWaste: number;
    quantity: {
      frequency: number;
      size: string;
    };
    swatchComplianceTracker: number;
    score: number;
  }
  
  export interface CleanlinessAlert {
    id: string;
    postOfficeId: string;
    previousScore: number;
    currentScore: number;
    difference: number;
    timestamp: Date;
    postOfficeName: string;
    location: string;
  }
  
  export interface NotificationPayload {
    id: string;
    type: string;
    date: Date;
    isAccidentProne: boolean;
    size: string;
    postOffice: {
      name: string;
      location: string;
    };
    location: {
      latitude: number;
      longitude: number;
    };
    photoLink: string;
    isRead: boolean;
  }