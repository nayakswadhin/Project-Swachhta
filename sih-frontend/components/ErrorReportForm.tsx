import React, { useState } from 'react';
import { AlertCircle, Send, Camera, Scale, Trash2, Leaf, Recycle, Factory, Timer, Car, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

interface ErrorReportFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  postOfficeId?: string;
}

interface FormData {
  detectionType: string;
  errorCategory: string;
  severity: string;
  additionalNotes: string;
}

const INITIAL_FORM_DATA: FormData = {
  detectionType: '',
  errorCategory: '',
  severity: '',
  additionalNotes: ''
};

export default function ErrorReportForm({ open, onClose, onSubmit, postOfficeId,alertImage }: ErrorReportFormProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detectionTypes = [
    { value: 'recyclable', label: 'Recyclable/Non-Recyclable', icon: <Recycle className="h-4 w-4" /> },
    { value: 'messy', label: 'Messy Area', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'overflow', label: 'Overflow Detection', icon: <Factory className="h-4 w-4" /> },
    { value: 'greenery', label: 'Greenery', icon: <Leaf className="h-4 w-4" /> },
    { value: 'bin', label: 'Bin Detection', icon: <Trash2 className="h-4 w-4" /> },
    { value: 'vehicle', label: 'Vehicle Count', icon: <Car className="h-4 w-4" /> },
    { value: 'frequency', label: 'Frequency', icon: <Timer className="h-4 w-4" /> },
    { value: 'spit', label: 'Spit Detection', icon: <Scale className="h-4 w-4" /> },
  ];

  const errorCategories = [
    { value: 'false_positive', label: 'False Positive' },
    { value: 'false_negative', label: 'False Negative' },
    { value: 'misclassification', label: 'Misclassification' },
    { value: 'poor_detection', label: 'Poor Detection Quality' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low Impact', color: 'text-emerald-600' },
    { value: 'medium', label: 'Medium Impact', color: 'text-amber-600' },
    { value: 'high', label: 'High Impact', color: 'text-red-600' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.detectionType) newErrors.detectionType = 'Please select a detection type';
    if (!formData.errorCategory) newErrors.errorCategory = 'Please select an error category';
    if (!formData.severity) newErrors.severity = 'Please select severity level';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/error-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          postOfficeId: postOfficeId || "default-score-id",
          alertImage: alertImage,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit error report');
      }

      const data = await response.json();
      
      toast.success('Error report submitted successfully');
      onSubmit(formData);
      onClose();
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit error report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-6 w-6 text-red-500" />
            Report Detection Error
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Detection Type</Label>
              <Select
                value={formData.detectionType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, detectionType: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select detection type" />
                </SelectTrigger>
                <SelectContent>
                  {detectionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.detectionType && (
                <p className="text-sm text-red-500">{errors.detectionType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Error Category</Label>
              <Select
                value={formData.errorCategory}
                onValueChange={(value) => setFormData(prev => ({ ...prev, errorCategory: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select error category" />
                </SelectTrigger>
                <SelectContent>
                  {errorCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.errorCategory && (
                <p className="text-sm text-red-500">{errors.errorCategory}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Severity Level</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.severity && (
                <p className="text-sm text-red-500">{errors.severity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Provide any additional details about the error..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Submitting...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}