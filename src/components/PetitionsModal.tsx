import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scroll, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PetitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PetitionsModal({ isOpen, onClose }: PetitionsModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content for your petition.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate petition submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Petition Submitted",
      description: "Your petition has been submitted to the Royal Council for review.",
    });
    
    setTitle("");
    setContent("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-primary" />
            Submit Petition to Royal Council
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="petition-title">Petition Title</Label>
            <Input
              id="petition-title"
              placeholder="Brief title for your petition..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="petition-content">Petition Details</Label>
            <Textarea
              id="petition-content"
              placeholder="Describe your petition in detail..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Petition"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}