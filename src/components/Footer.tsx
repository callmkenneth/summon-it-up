import { Link } from "react-router-dom";
export function Footer() {
  return <footer className="bg-dark-purple text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-3">
          
          <div>
            <h4 className="text-xl font-bold mb-4">Summons</h4>
            <p className="text-purple-200">Plan events that weaponize FOMO with RSVP timers, spot limits, and ratio controls.</p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              
            </ul>
          </div>
        </div>
        
        <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-200">
          
        </div>
      </div>
    </footer>;
}