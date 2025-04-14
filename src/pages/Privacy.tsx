import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>ELITE MP | Privacy Policy</title>
        <meta name="description" content="Privacy policy for ELITE MP marketplace" />
      </Helmet>
      
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: April 14, 2025</p>
            
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>At ELITE MARKETPLACE, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <p><strong>Personal Data:</strong> We may collect, use, store and transfer different kinds of personal data about you, including:</p>
            <ul className="list-disc ml-8 mb-4">
              <li>Identity Data: includes name, username, or similar identifier</li>
              <li>Contact Data: includes email address and telephone numbers</li>
              <li>Financial Data: includes payment method details (processed securely through our payment processors)</li>
              <li>Transaction Data: includes details about payments to and from you and other details of products you have purchased</li>
              <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
              <li>Profile Data: includes your purchases, preferences, feedback, and survey responses</li>
              <li>Usage Data: includes information about how you use our website and services</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Collect Your Data</h2>
            <p>We use different methods to collect data from and about you, including:</p>
            <ul className="list-disc ml-8 mb-4">
              <li>Direct interactions: You may give us your identity, contact, and financial data by filling in forms or corresponding with us.</li>
              <li>Automated technologies: As you interact with our website, we may automatically collect technical data about your equipment, browsing actions, and patterns.</li>
              <li>Third parties: We may receive personal data about you from various third parties, such as payment processors.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc ml-8 mb-4">
              <li>To register you as a new customer</li>
              <li>To process and deliver your orders</li>
              <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy</li>
              <li>To administer and protect our business and website</li>
              <li>To deliver relevant website content and advertisements to you</li>
              <li>To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track the activity on our platform and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Sharing and Transfers</h2>
            <p>We may share your personal data with:</p>
            <ul className="list-disc ml-8 mb-4">
              <li>Service providers who provide IT and system administration services</li>
              <li>Professional advisers including lawyers, bankers, auditors, and insurers</li>
              <li>Regulators and other authorities who require reporting of processing activities in certain circumstances</li>
              <li>Third parties to whom we may choose to sell, transfer, or merge parts of our business or our assets</li>
            </ul>
            <p className="mt-2">We require all third parties to respect the security of your personal data and to treat it in accordance with the law.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Security</h2>
            <p>We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Data Retention</h2>
            <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
            <ul className="list-disc ml-8 mb-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@fortmarket.demo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
