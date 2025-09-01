import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Crown, 
  Shield, 
  Users, 
  Send,
  Search,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "How do I increase my rank in the kingdom?",
    answer: "Your rank increases by earning XP through participating in discussions, completing quests, and contributing to the kingdom. Each rank requires a certain amount of XP to unlock."
  },
  {
    question: "What are VIP privileges and how do I get them?",
    answer: "VIP status grants access to exclusive channels, special powers like issuing decrees, and priority support. VIP status can be purchased or earned through exceptional contributions to the kingdom."
  },
  {
    question: "How do decrees work?",
    answer: "VIP members can issue decrees - special announcements that appear prominently in channels. You have a limited number of decrees per day that reset at midnight."
  },
  {
    question: "Can I create my own channels?",
    answer: "Channel creation is currently limited to administrators. However, you can submit requests through petitions for new channels if there's community interest."
  },
  {
    question: "What happens if I violate kingdom rules?",
    answer: "Rule violations may result in temporary channel restrictions, XP penalties, or in severe cases, banishment from the kingdom. All actions are reviewed by the Royal Council."
  }
];

const guides = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of navigating the kingdom",
    topics: ["Creating your profile", "Understanding ranks", "Joining conversations", "Kingdom etiquette"]
  },
  {
    title: "Advanced Features",
    description: "Master the kingdom's special features",
    topics: ["Message reactions", "Typing indicators", "Presence status", "Channel permissions"]
  },
  {
    title: "VIP Member Guide",
    description: "Exclusive guide for VIP members",
    topics: ["Issuing decrees", "VIP channel access", "Special privileges", "Leadership roles"]
  }
];

export function HelpSupportCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description for your support ticket.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate ticket submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Support Ticket Submitted",
      description: "Your ticket has been submitted. You'll receive a response within 24 hours.",
    });
    
    setTicketTitle("");
    setTicketDescription("");
    setIsSubmitting(false);
  };

  return (
    <div className="h-full bg-background">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-throne-gradient border-b border-border p-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-display font-bold text-primary">Help & Support Center</h1>
              <p className="text-muted-foreground">Get assistance and learn about the kingdom</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No FAQs found matching your search.</p>
                  <p className="text-sm mt-2">Try different keywords or contact support directly.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <div className="grid gap-4">
                {guides.map((guide, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {guide.title}
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Topics covered:</p>
                        <div className="flex flex-wrap gap-2">
                          {guide.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Book className="w-3 h-3 mr-2" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Submit Support Ticket
                  </CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Submit a support ticket and our team will help you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="ticket-title" className="text-sm font-medium">
                        Issue Title
                      </label>
                      <Input
                        id="ticket-title"
                        placeholder="Brief description of your issue..."
                        value={ticketTitle}
                        onChange={(e) => setTicketTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="ticket-description" className="text-sm font-medium">
                        Detailed Description
                      </label>
                      <Textarea
                        id="ticket-description"
                        placeholder="Please provide as much detail as possible about your issue..."
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Submitting..." : "Submit Support Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">Most tickets are resolved within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Community Help</p>
                      <p className="text-sm text-muted-foreground">Ask other members in General Chat for quick tips</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">VIP Priority</p>
                      <p className="text-sm text-muted-foreground">VIP members receive priority support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}