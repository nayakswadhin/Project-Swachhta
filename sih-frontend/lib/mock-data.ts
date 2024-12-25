import { AreaData } from '../components/ui/ComparisonCard';

export const areaData: Record<string, AreaData> = {
  'North Zone': {
    name: 'North Zone',
    metrics: [
      {
        label: 'Cleanliness Index',
        value: '94%',
        change: 5.2,
        changeLabel: 'vs last month'
      },
      {
        label: 'Green Practices',
        value: '88%',
        change: 3.1,
        changeLabel: 'vs last month'
      },
      {
        label: 'LiFE Score',
        value: '96%',
        change: 2.5,
        changeLabel: 'vs last month'
      }
    ]
  },
  'South Zone': {
    name: 'South Zone',
    metrics: [
      {
        label: 'Cleanliness Index',
        value: '91%',
        change: 4.8,
        changeLabel: 'vs last month'
      },
      {
        label: 'Green Practices',
        value: '92%',
        change: 6.2,
        changeLabel: 'vs last month'
      },
      {
        label: 'LiFE Score',
        value: '94%',
        change: 1.8,
        changeLabel: 'vs last month'
      }
    ]
  },
  'East Zone': {
    name: 'East Zone',
    metrics: [
      {
        label: 'Cleanliness Index',
        value: '89%',
        change: 3.5,
        changeLabel: 'vs last month'
      },
      {
        label: 'Green Practices',
        value: '87%',
        change: 4.2,
        changeLabel: 'vs last month'
      },
      {
        label: 'LiFE Score',
        value: '92%',
        change: 2.8,
        changeLabel: 'vs last month'
      }
    ]
  },
  'West Zone': {
    name: 'West Zone',
    metrics: [
      {
        label: 'Cleanliness Index',
        value: '93%',
        change: 4.9,
        changeLabel: 'vs last month'
      },
      {
        label: 'Green Practices',
        value: '90%',
        change: 5.1,
        changeLabel: 'vs last month'
      },
      {
        label: 'LiFE Score',
        value: '95%',
        change: 3.2,
        changeLabel: 'vs last month'
      }
    ]
  }
};