import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DateFilterProps {
  onFilterChange: (filter: string) => void;
  onDateChange: (dateRange: DateRange | undefined) => void;
}

export function DateFilter({ onFilterChange, onDateChange }: DateFilterProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('month');
  const [isCustomRange, setIsCustomRange] = React.useState(false);

  const updateDateRange = React.useCallback((period: string) => {
    if (period === 'custom') {
      setIsCustomRange(true);
      return;
    }

    setIsCustomRange(false);
    const today = new Date();
    let newRange: DateRange;

    switch (period) {
      case 'day':
        newRange = {
          from: startOfDay(today),
          to: endOfDay(today)
        };
        break;
      case 'month':
        newRange = {
          from: startOfMonth(today),
          to: endOfMonth(today)
        };
        break;
      case 'year':
        newRange = {
          from: startOfYear(today),
          to: endOfYear(today)
        };
        break;
      default:
        return;
    }

    setDateRange(newRange);
    onDateChange(newRange);
  }, [onDateChange]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    updateDateRange(period);
    onFilterChange(period);
  };

  // Initialize with current month on component mount
  React.useEffect(() => {
    if (!isCustomRange) {
      updateDateRange(selectedPeriod);
    }
  }, [selectedPeriod, updateDateRange, isCustomRange]);

  return (
    <div className="flex items-center space-x-4">
      <Select onValueChange={handlePeriodChange} defaultValue={selectedPeriod}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">Custom Range</SelectItem>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(newDateRange) => {
              setDateRange(newDateRange);
              if (isCustomRange) {
                onDateChange(newDateRange);
              }
            }}
            numberOfMonths={2}
            className="flex"
            disabled={!isCustomRange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}