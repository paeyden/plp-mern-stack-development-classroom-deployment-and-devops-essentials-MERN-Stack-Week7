function Footer() {
  return (
    <footer className="border-t mt-8 py-4 px-6 text-sm text-muted-foreground bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Mern Blog. All rights reserved.</p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;