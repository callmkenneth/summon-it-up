import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-pink">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly to us when you create events, RSVP to events, or contact us for support.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@eventmaster.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}