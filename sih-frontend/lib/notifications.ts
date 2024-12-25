import { formatDistanceToNow } from 'date-fns';

export const createNotificationFromWaste = (waste: any) => {
  return {
    id: waste._id,
    title: 'New Waste Detection',
    message: `Detected ${waste.quantity.totalCount} items of waste`,
    severity: calculateSeverity(waste.score),
    isRead: false,
    time: new Date(waste.time),
    postOffice: {
      _id: waste.postOfficeId._id,
      name: waste.postOfficeId.name
    },
    location: waste.area,
    type: 'WASTE_DETECTION',
    size: waste.quantity.size,
    photoLink: waste.imageUrl,
    quantity: waste.quantity,
    score: waste.score,
    spit: waste.spit,
    dump: waste.dump,
  };
};

export const formatNotifications = (data: any) => {
  return data.notifications.map((notification: any) => ({
    id: notification.id,
    title: 'Waste Alert',
    message: `Detected waste with cleanliness score: ${notification.score.toFixed(2)}`,
    severity: calculateSeverity(notification.score),
    isRead: false,
    time: new Date(notification.time),
    postOffice: {
      _id: notification.postOfficeId._id,
      name: notification.postOfficeId.name
    },
    location: notification.area,
    type: 'WASTE_DETECTION',
    size: notification.quantity.size,
    photoLink: notification.imageUrl,
    quantity: notification.quantity,
    score: notification.score.toFixed(2),
    spit: notification.spit,
    dump: notification.dump,
  }));
};

const calculateSeverity = (score: number): string => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};