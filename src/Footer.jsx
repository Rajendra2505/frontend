import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Get to Know Us</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect with Us</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">
          <span>amazon.in</span>
        </div>
        <div className="footer-copyright">
          © 2026  Amazon Clone  All rights reserved.
        </div>
      </div>
    </footer>
  );
}

