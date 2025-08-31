'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const PortfolioPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Defer popup to avoid impacting LCP: open after first interaction or a longer idle delay
    let timer: any;
    const open = () => setIsOpen(true);

    const scheduleIdle = () => {
      // Open after 8s if no interaction, and only if tab is visible
      timer = setTimeout(() => {
        if (document.visibilityState === 'visible') open();
      }, 8000);
    };

    const onInteract = () => {
      if (timer) clearTimeout(timer);
      // Open a bit later after interaction to ensure initial content paints first
      timer = setTimeout(() => {
        if (document.visibilityState === 'visible') open();
      }, 3000);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('scroll', onInteract as any);
    };

    scheduleIdle();
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('scroll', onInteract as any, { once: true, passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('scroll', onInteract as any);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDownload = () => {
    // Path to your PDF file in the public directory
    const pdfUrl = '/PORTFOLIO-fe3988f3.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'PORTFOLIO-fe3988f3.pdf'); // or any other name you want
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose(); // Close the popup after download
  };

  if (!isOpen) return null;

  return (
        <div onClick={handleClose} className="fixed  inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl mt-[50px] h-auto md:h-auto flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <button
          onClick={handleClose}
          className="absolute w-10 h-10 bg-black rounded-full top-2 left-2 text-white hover:text-gray-800 z-10 transition-colors flex items-center justify-center"
          aria-label="Close popup"
        >
          <svg className="w-8 h-8" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="w-full md:w-1/2  p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">Discover My Work</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for visiting glory home . Download our  portfolio to see a collection of our best products and learn more about us.
          </p>
          <button
            onClick={handleDownload}
            className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Download Portfolio
          </button>
        </div>

        <div className="w-full md:w-1/2 h-64 md:h-auto order-1 md:order-2">
          <Image
            src="/2-7fb9c07a.webp"
            alt="Portfolio Preview"
            width={500}
            height={500}
            className="object-cover w-full h-full"
            loading="lazy"
            fetchPriority="low"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPopup;
