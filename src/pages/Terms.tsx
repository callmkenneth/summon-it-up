import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using EventMaster, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily use EventMaster for personal, non-commercial transitory viewing only.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Disclaimer</h2>
              <p className="text-muted-foreground mb-4">
                The materials on EventMaster are provided on an 'as is' basis. EventMaster makes no warranties, expressed or implied.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at legal@eventmaster.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}