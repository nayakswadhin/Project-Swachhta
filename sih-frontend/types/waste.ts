export interface WasteNotification {
    _id: string;
    date: string;
    type: 'organic' | 'plastic';
    isAccidentProne: boolean;
    size: 'small' | 'medium' | 'large';
    longitude: number;
    latitude: number;
    postOfficeId: string;
    photoLink: string;
  }