const Footer = () => {
    return (
        <footer className="w-full bg-white border-t px-4 py-3 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">

            {/* Left */}
            <div>
                © {new Date().getFullYear()} CRM Pro. All rights reserved.
            </div>

            {/* Right */}
            <div className="flex gap-4 mt-2 md:mt-0">
                <span className="hover:text-blue-500 cursor-pointer">Privacy</span>
                <span className="hover:text-blue-500 cursor-pointer">Terms</span>
                <span className="hover:text-blue-500 cursor-pointer">Support</span>
            </div>

        </footer>
    );
};

export default Footer;