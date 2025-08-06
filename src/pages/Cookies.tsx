import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">What Are Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies to improve your experience on our website, remember your preferences, and analyze how our website is used.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Types of Cookies We Use</h2>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li>Essential cookies - necessary for the website to function</li>
                <li>Performance cookies - help us understand how visitors use our website</li>
                <li>Functional cookies - remember your preferences and settings</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may affect your user experience.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our use of cookies, please contact us at cookies@eventmaster.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}