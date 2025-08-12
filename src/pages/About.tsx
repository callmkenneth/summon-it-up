import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white mb-8 text-center">About Summons</h1>
          
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-white text-2xl font-bold mb-4">What is Summons?</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Summons is the ultimate event planning platform that weaponizes FOMO (Fear of Missing Out) to create urgency and excitement around your events. With features like RSVP timers, spot limits, and ratio controls, we help you plan events that people actually want to attend.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-white text-2xl font-bold mb-4">Why Use Summons?</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-white font-semibold mb-2">⏰ RSVP Deadlines</h3>
                  <p className="text-white/80">Create urgency with countdown timers that push people to respond quickly.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">🎯 Spot Limits</h3>
                  <p className="text-white/80">Limited capacity creates exclusivity and makes your event more desirable.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">⚖️ Ratio Controls</h3>
                  <p className="text-white/80">Maintain the perfect balance of attendees for your event type.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">📱 Easy Sharing</h3>
                  <p className="text-white/80">Simple invite links make it easy to spread the word about your event.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-white text-2xl font-bold mb-4">Perfect For</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-white font-semibold">House Parties</h3>
                  <p className="text-white/80 text-sm">Control the crowd and create exclusive gatherings</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💼</div>
                  <h3 className="text-white font-semibold">Corporate Events</h3>
                  <p className="text-white/80 text-sm">Professional networking with strategic attendance limits</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎭</div>
                  <h3 className="text-white font-semibold">Special Occasions</h3>
                  <p className="text-white/80 text-sm">Birthdays, celebrations, and memorable moments</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-primary rounded-lg p-8 text-center">
              <h2 className="text-white text-2xl font-bold mb-4">Ready to Start Planning?</h2>
              <p className="text-white/90 mb-6">Join thousands of event planners who use Summons to create unforgettable experiences.</p>
              <a href="/newevent" className="inline-flex items-center justify-center bg-white text-primary font-semibold px-8 py-3 rounded-[30px] hover:bg-white/90 transition-colors">
                Create Your First Event
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;