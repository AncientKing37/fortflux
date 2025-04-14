
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Frequently Asked Questions | EL1TE MARKETPLACE</title>
        <meta name="description" content="Find answers to common questions about buying and selling Fortnite accounts." />
      </Helmet>
      
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Find answers to common questions about our marketplace and services.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">How does the purchase process work?</AccordionTrigger>
              <AccordionContent>
                When you purchase an account, the payment is held in escrow until the account has been successfully transferred to you. Once you confirm receipt of the account, the funds are released to the seller. This ensures a secure transaction for both parties.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">Is it safe to buy accounts on your platform?</AccordionTrigger>
              <AccordionContent>
                We've implemented a secure escrow system to protect both buyers and sellers. Additionally, all sellers undergo verification, and listings are reviewed by our team. However, we recommend reading seller reviews and only proceeding with transactions through our platform.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We currently accept cryptocurrency payments through our integration with NOWPayments. This includes Bitcoin, Ethereum, and several other major cryptocurrencies, providing secure and anonymous transactions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">How do I sell my account?</AccordionTrigger>
              <AccordionContent>
                To sell your account, you need to create a seller account, verify your identity, and then create a listing with detailed information about your account. Once approved, your listing will be visible to potential buyers. When someone purchases your account, you'll be guided through the transfer process.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">What fees do you charge?</AccordionTrigger>
              <AccordionContent>
                We charge a 10% commission fee on successful sales. This fee helps us maintain the platform, provide customer support, and ensure secure transactions through our escrow service. There are no listing fees or upfront costs.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium">What happens if a transaction goes wrong?</AccordionTrigger>
              <AccordionContent>
                If any issues arise during a transaction, our support team is available to mediate. The escrow system ensures that funds are only released when both parties are satisfied. In case of disputes, we review the evidence provided by both parties and make a fair decision based on our terms of service.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium">How long does it take to sell an account?</AccordionTrigger>
              <AccordionContent>
                The selling time varies depending on factors like account value, rarity of items, and pricing. Some accounts sell within hours, while others might take days or weeks. Setting a competitive price and providing detailed information can help attract buyers more quickly.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-medium">Is account trading against Fortnite's terms of service?</AccordionTrigger>
              <AccordionContent>
                Yes, trading accounts is technically against Epic Games' Terms of Service. We recommend understanding this risk before proceeding. Our platform operates as a third-party marketplace and is not affiliated with Epic Games or Fortnite.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-medium">How do I contact support?</AccordionTrigger>
              <AccordionContent>
                You can contact our support team by visiting the Contact Us page or by using the live chat feature available at the bottom right corner of every page. Our support team is available to assist you with any questions or issues you may have.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10">
              <AccordionTrigger className="text-lg font-medium">Can I get a refund if I'm not satisfied?</AccordionTrigger>
              <AccordionContent>
                Our escrow system ensures that you can inspect the account before finalizing the purchase. If the account doesn't match the description or has issues, you should not confirm receipt and contact our support team immediately. Once you've confirmed receipt and the funds have been released to the seller, refunds are generally not possible.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
