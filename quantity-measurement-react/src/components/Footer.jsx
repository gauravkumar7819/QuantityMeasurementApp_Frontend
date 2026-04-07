import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-8 text-center text-text-muted mt-auto">
      <p>&copy; {new Date().getFullYear()} UnitMaster. Made with ❤️ for precision and simplicity.</p>
    </footer>
  );
};

export default Footer;
