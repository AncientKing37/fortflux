import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Terms of Service | ELITE MARKETPLACE</title>
        <meta name="description" content="Terms and conditions for using the ELITE MARKETPLACE platform." />
      </Helmet>
      
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: April 14, 2025</p>
            
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>Welcome to ELITE MARKETPLACE ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our website, services, and applications (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Account Registration</h2>
            <p>To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Platform Rules</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-8 mb-4">
              <li>Use the Platform in any way that violates any applicable law or regulation.</li>
              <li>Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Platform.</li>
              <li>Use any robot, spider, crawler, scraper, or other automated means to access the Platform.</li>
              <li>Bypass or circumvent measures we may use to prevent or restrict access to the Platform.</li>
              <li>Sell counterfeit items or misrepresent the items you list.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Marketplace Transactions</h2>
            <p>Our Platform facilitates transactions between buyers and sellers. By listing an item for sale, you represent and warrant that you have the right to sell such item. By purchasing an item, you agree to pay the full amount specified.</p>
            <p className="mt-2">We use an escrow service to protect both buyers and sellers. Payments are held in escrow until the buyer confirms receipt of the item as described. We charge a commission fee on each successful transaction as outlined in our Fee Schedule.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Account Transfer Risk</h2>
            <p>You acknowledge that trading Fortnite accounts or other gaming accounts is against Epic Games' Terms of Service and other game publishers' terms. FortMarket is not affiliated with Epic Games or any game publisher. By using our Platform, you assume all risks associated with account transfers, including but not limited to account bans or suspensions.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Payment and Fees</h2>
            <p>We accept various payment methods, including cryptocurrencies through our third-party payment processors. All fees are non-refundable unless otherwise specified. Seller fees are deducted from the final sale amount before disbursement to the seller.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Disputes and Resolution</h2>
            <p>If a dispute arises between users, we encourage users to first attempt to resolve the issue directly. If that is unsuccessful, our support team will review the case and make a decision based on our policies and the evidence provided by both parties.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Intellectual Property</h2>
            <p>The Platform and its original content (excluding content provided by users), features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Platform.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless our company, its officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Platform.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at legal@fortmarket.demo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
