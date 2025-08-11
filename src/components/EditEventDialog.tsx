import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  event: any;
  isLoading?: boolean;
}

export function EditEventDialog({
  open,
  onOpenChange,
  onSave,
  event,
  isLoading = false
}: EditEventDialogProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    start_time: event?.start_time || '',
    end_time: event?.end_time || '',
    location: event?.location || '',
    guest_limit: event?.guest_limit || '',
    rsvp_deadline: event?.rsvp_deadline ? event.rsvp_deadline.split('T')[0] : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update your event details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="event_date">Event Date</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="rsvp_deadline">RSVP Deadline</Label>
              <Input
                id="rsvp_deadline"
                type="date"
                value={formData.rsvp_deadline}
                onChange={(e) => setFormData({...formData, rsvp_deadline: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                required
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Enter event address"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="guest_limit">Guest Limit</Label>
              <Input
                id="guest_limit"
                type="number"
                min="0"
                value={formData.guest_limit}
                onChange={(e) => setFormData({...formData, guest_limit: e.target.value})}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}