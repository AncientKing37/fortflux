import React from 'react';
import { Helmet } from 'react-helmet-async';

const Disclaimer: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Disclaimer | FortFlux</title>
        <meta name="description" content="Legal disclaimer for FortFlux, explaining the limitations of our service and your responsibilities." />
      </Helmet>
      
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Disclaimer</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Important information about the limitations of our service.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: April 14, 2025</p>
            
            <h2 className="text-2xl font-bold mb-4">Website Disclaimer</h2>
            <p>The information provided by FortFlux ("we," "us," or "our") on our website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">No Affiliation with Epic Games</h2>
            <p>FortFlux is not affiliated with, endorsed by, or in any way officially connected with Epic Games, Inc. or Fortnite. All Fortnite assets, including names, characters, images, and related intellectual property, are the exclusive property of Epic Games, Inc.</p>
            <p className="mt-2">This is a third-party marketplace that facilitates transactions between buyers and sellers of gaming accounts. We do not create, sell, or provide any game content ourselves.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Account Trading Risks</h2>
            <p>Users should be aware that buying and selling gaming accounts, including Fortnite accounts, may be against the Terms of Service of the respective game. By using our platform, you acknowledge and accept the following risks:</p>
            <ul className="list-disc ml-8 mb-4">
              <li>The purchased account may be banned or suspended by Epic Games or other game publishers</li>
              <li>The original owner might attempt to reclaim the account</li>
              <li>The account might not have all the features or items advertised</li>
              <li>Technical issues may arise during or after the transfer process</li>
            </ul>
            <p className="mt-2">While we implement measures to verify accounts and protect our users, we cannot guarantee that these risks will not materialize.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">External Links Disclaimer</h2>
            <p>Our website may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Professional Disclaimer</h2>
            <p>The site cannot and does not contain legal advice. The legal information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Testimonials Disclaimer</h2>
            <p>The site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Errors and Omissions Disclaimer</h2>
            <p>The information given by the Platform is for general guidance on matters of interest only. Even if the Platform takes every precaution to ensure that the content is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules, and regulations, there may be delays, omissions, or inaccuracies in the information contained on the Platform. The Platform is not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Fair Use Disclaimer</h2>
            <p>This site may use copyrighted material which has not always been specifically authorized by the copyright owner. We are making such material available for criticism, comment, news reporting, teaching, scholarship, or research. We believe this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the United States Copyright law.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Views Expressed Disclaimer</h2>
            <p>The views and opinions expressed in this platform are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer, or company, including the platform itself.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">No Responsibility Disclaimer</h2>
            <p>The information on the Platform is provided with the understanding that the Platform is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal, or other competent advisers.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>If you have any questions about this Disclaimer, please contact us at legal@fortflux.demo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
