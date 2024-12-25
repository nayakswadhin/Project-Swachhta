export interface PostOffice {
  _id: string;
  areaId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    area: string;
    postOffice: string;
    phoneno: number;
  };
  name: string;
  cleanlinessScore: number;
  photoLinks: string[];
}

export interface PostOfficeStaff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
}

export interface PostOfficeMetrics {
  cleanlinessScore: number;
  greenMetricScore: number;
  complianceRate: number;
  ranking: number;
  totalOfficesInArea: number;
}

export interface PostOfficeGallery {
  id: string;
  url: string;
  caption: string;
}

export interface PostOfficea {
  _id: string;
  areaId: string;
  userId: string;
  name: string;
  cleanlinessScore: number;
  photoLinks: string[];
  createdAt: string;
  updatedAt: string;
}

