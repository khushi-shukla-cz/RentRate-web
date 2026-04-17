import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-lg font-heading font-bold text-foreground">RentRate</span>
          </Link>
          <p className="text-sm text-muted-foreground">Building trust in the rental ecosystem through transparency and reviews.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link to="/listings" className="text-sm text-muted-foreground hover:text-primary">Browse Listings</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">How It Works</Link>
            <Link to="/register" className="text-sm text-muted-foreground hover:text-primary">Sign Up</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Company</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Connect</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Twitter</span>
            <span className="text-sm text-muted-foreground">LinkedIn</span>
            <span className="text-sm text-muted-foreground">Instagram</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2025 RentRate. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
