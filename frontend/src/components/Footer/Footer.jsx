import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-800 p-5 shadow-lg border-t border-gray-700">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="max-w-md">
                        <h3 className="text-2xl font-bold text-gray-100 mb-3">About Us</h3>
                        <p className="text-gray-400">
                            StartUP Connect helps startups connect with investors and customers.
                            We provide a platform for startups to showcase their products and services globally.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-3">Follow Us</h3>
                        <div className="flex justify-center md:justify-end">
                            <span
                                className="text-gray-400 hover:text-blue-500 transition duration-300 cursor-pointer"
                                aria-label="GitHub"
                            >
                                <a href="https://github.com/Mohak1809/HackShetra2k25">
                                <FaGithub className="h-6 w-6" />
                                </a>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center text-gray-400">
                    <p>Made with ❤ by <span className="font-semibold text-blue-400 text-lg">Team Insiders</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
