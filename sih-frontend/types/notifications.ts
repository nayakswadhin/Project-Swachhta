export interface WasteNotification {
    type: string;
    size: string;
    date: string;
    isAccidentProne: boolean;
  }
  

  
  export interface NotificationStyles {
    border: string;
    background: string;
    icon: string;
  }

  export type NotificationSeverity = 'critical' | 'warning' | 'info';

export type Location = {
  latitude: number;
  longitude: number;
};

export type PostOffice = {
  name: string;
  location: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
  severity: NotificationSeverity;
  type: string;
  size: string;
  isAccidentProne: boolean;
  location: Location;
  postOffice: PostOffice;
  photoLink: string;
};