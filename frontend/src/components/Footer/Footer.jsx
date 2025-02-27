import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-800 py-12 shadow-lg border-t border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="text-left">
                        <h3 className="text-2xl font-bold text-gray-100 mb-4">About Us</h3>
                        <p className="text-gray-400">
                            StartUP Connect is a platform to help startups connect with investors and customers.
                            We provide a platform for startups to showcase their products and services to the world.
                        </p>
                    </div>

                    <div className="text-right">
                        <h3 className="text-2xl font-bold text-gray-100 mb-4">Follow Us</h3>
                        <div className="flex justify-end">
                            <span
                                className="text-gray-400 hover:text-blue-500 transition duration-300 cursor-pointer"
                                aria-label="GitHub"
                            >
                                <FaGithub className="h-6 w-6" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-400">
                    <p>Made with ❤ by <span className="font-semibold text-blue-400 text-xl">Team Insiders</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;