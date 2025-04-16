import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Shield, Wallet, Star, MessageSquare, Check } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">How FortFlux Works</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our secure and trusted platform makes buying and selling Fortnite accounts safe and simple.
              Here's how it all works.
            </p>
          </div>
        </div>
      </section>
      
      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-yellow-400/20 text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Create an Account</h2>
              <p className="text-gray-300 mb-6">
                Sign up for free and set up your profile to start buying or selling accounts.
              </p>
              <Link to="/signup">
                <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                  Get Started
                </Button>
              </Link>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-yellow-400/20 text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Browse or List</h2>
              <p className="text-gray-300 mb-6">
                Find the perfect account or list your own with detailed descriptions and screenshots.
              </p>
              <Link to="/marketplace">
                <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-yellow-400/20 text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Secure Transaction</h2>
              <p className="text-gray-300 mb-6">
                Complete your purchase through our escrow system for maximum protection.
              </p>
              <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                Learn About Escrow
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Browse & Buy Section */}
          <div className="flex flex-col md:flex-row items-center mb-24 gap-12">
            <div className="md:w-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-1 rounded-lg">
                <div className="bg-black rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 flex flex-col">
                      <span className="text-yellow-400 text-sm mb-2">Rare Skins</span>
                      <span className="font-bold text-white">Black Knight</span>
                      <span className="text-gray-400 text-xs">Season 2</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 flex flex-col">
                      <span className="text-yellow-400 text-sm mb-2">Account Level</span>
                      <span className="font-bold text-white">350+</span>
                      <span className="text-gray-400 text-xs">Veteran Player</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 flex flex-col">
                      <span className="text-yellow-400 text-sm mb-2">Skin Count</span>
                      <span className="font-bold text-white">200+</span>
                      <span className="text-gray-400 text-xs">Full Collection</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 flex flex-col">
                      <span className="text-yellow-400 text-sm mb-2">Price</span>
                      <span className="font-bold text-white">$299.99</span>
                      <span className="text-gray-400 text-xs">Verified Value</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <ShoppingBag className="text-yellow-400 h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold text-white">Browse & Buy</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Our marketplace features a wide selection of verified Fortnite accounts. 
                Each listing is thoroughly checked to ensure accuracy of description, 
                including skin inventory, account level, and battle pass history.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Detailed account information with screenshots</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Advanced filtering to find exactly what you want</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Every account is verified by our team before listing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Escrow Protection Section */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-24 gap-12">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur-sm"></div>
                <div className="relative bg-black rounded-lg p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-yellow-400/20 p-2 rounded-full mr-3">
                          <Shield className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">Payment Secured</p>
                          <p className="text-sm text-gray-400">In Escrow</p>
                        </div>
                      </div>
                      <span className="text-yellow-400 font-bold">$299.99</span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 p-4 bg-white/5 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Buyer</p>
                        <div className="w-10 h-10 bg-yellow-400 rounded-full mx-auto my-2"></div>
                        <p className="text-white font-bold">Player123</p>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Escrow</p>
                        <div className="w-10 h-10 bg-yellow-500 rounded-full mx-auto my-2"></div>
                        <p className="text-white font-bold">FortFlux</p>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-400"></div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Seller</p>
                        <div className="w-10 h-10 bg-yellow-600 rounded-full mx-auto my-2"></div>
                        <p className="text-white font-bold">FortniteGod</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <Shield className="text-yellow-400 h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold text-white">Escrow Protection</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Our escrow system serves as a secure middleman for all transactions. 
                We hold payment until the buyer confirms receipt of the account credentials 
                and verifies everything is as described.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Buyer's payment is securely held until delivery is confirmed</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Sellers don't provide account access until payment is confirmed</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Dedicated escrow agents available to resolve any disputes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Crypto Payments Section */}
          <div className="flex flex-col md:flex-row items-center mb-24 gap-12">
            <div className="md:w-1/2">
              <div className="bg-black rounded-lg p-6 border border-yellow-400/20">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-2">Supported Cryptocurrencies</h3>
                  <p className="text-sm text-gray-400">Fast, secure transactions with low fees</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#F7931A] rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-white">₿</span>
                    </div>
                    <span className="font-bold text-white">Bitcoin</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#627EEA] rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-white">Ξ</span>
                    </div>
                    <span className="font-bold text-white">Ethereum</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#345D9D] rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-white">L</span>
                    </div>
                    <span className="font-bold text-white">Litecoin</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#2775CA] rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-white">₮</span>
                    </div>
                    <span className="font-bold text-white">USDT</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#3E73C4] rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-white">D</span>
                    </div>
                    <span className="font-bold text-white">Dogecoin</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#26A17B] rounded-full mb-2 flex items-center justify-center">
                      <span className="font-bold text-white">U</span>
                    </div>
                    <span className="font-bold text-white">USDC</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <Wallet className="text-yellow-400 h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold text-white">Crypto Payments</h2>
              </div>
              <p className="text-gray-300 mb-6">
                We accept payments in multiple cryptocurrencies through Coinbase Commerce,
                providing a secure and pseudonymous way to purchase accounts with lower fees
                than traditional payment methods.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Support for Bitcoin, Ethereum, and other major cryptocurrencies</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Instant payment confirmation through blockchain verification</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Lower fees compared to credit card or bank transfers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reputation System Section */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-24 gap-12">
            <div className="md:w-1/2">
              <div className="bg-black rounded-lg p-6 border border-yellow-400/20">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">FortniteGod</h3>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 text-yellow-400" fill="#10B981" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400 ml-2">5.0 (124 reviews)</span>
                    </div>
                  </div>
                  <div className="bg-yellow-400/20 py-1 px-3 rounded-full">
                    <span className="text-yellow-400 font-bold text-sm">Trusted Seller</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500 rounded-full mr-2"></div>
                        <span className="font-bold text-white">John_123</span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400" fill="#10B981" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Smooth transaction. Account exactly as described with all the rare skins mentioned. Would buy again!
                    </p>
                    <p className="text-gray-500 text-xs mt-2">2 days ago</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
                        <span className="font-bold text-white">FortPlayer98</span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-yellow-400" fill="#10B981" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Great seller, very responsive. The account had even more skins than listed. Highly recommended!
                    </p>
                    <p className="text-gray-500 text-xs mt-2">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold text-white">Reputation System</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Our comprehensive reputation system helps build trust within our community. 
                After each transaction, buyers can leave reviews and ratings for sellers, 
                creating a transparent marketplace where trustworthy sellers are rewarded.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Detailed seller profiles with transaction history and ratings</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Verified buyer reviews that can't be manipulated</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Special badges for trusted sellers with excellent track records</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Live Chat Section */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-black rounded-lg overflow-hidden border border-yellow-400/20">
                <div className="bg-white/5 p-4 border-b border-yellow-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full mr-3"></div>
                      <div>
                        <h3 className="font-bold text-white">FortniteGod</h3>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span className="text-xs text-gray-400">Online</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="p-4 h-64 overflow-y-auto">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-white/5 rounded-lg py-2 px-3 max-w-xs">
                        <p className="text-gray-300 text-sm">Hi there! I'm interested in your OG Fortnite account. Does it have the Black Knight skin?</p>
                        <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-yellow-400/20 rounded-lg py-2 px-3 max-w-xs">
                        <p className="text-black text-sm">Hey! Yes, it has Black Knight and all season 2 Battle Pass skins. I can show you screenshots if you'd like.</p>
                        <p className="text-xs text-gray-400 mt-1">10:34 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white/5 rounded-lg py-2 px-3 max-w-xs">
                        <p className="text-gray-300 text-sm">That would be great. And what's the account level?</p>
                        <p className="text-xs text-gray-500 mt-1">10:35 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-yellow-400/20 rounded-lg py-2 px-3 max-w-xs">
                        <p className="text-black text-sm">The account is level 350+. Been active since Season 1 but I don't play anymore.</p>
                        <p className="text-xs text-gray-400 mt-1">10:36 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 border-t border-yellow-400/20">
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 bg-gray-700 border-none rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    />
                    <Button size="sm" className="ml-2 bg-yellow-400 text-black hover:bg-yellow-500">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <MessageSquare className="text-yellow-400 h-6 w-6 mr-3" />
                <h2 className="text-3xl font-bold text-white">Live Chat</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Our integrated messaging system allows for direct communication between 
                buyers, sellers, and escrow agents. Ask questions about accounts, 
                negotiate prices, or get help with any issues during the transaction process.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Real-time messaging with typing indicators and read receipts</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Image sharing for account verification and screenshots</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Escrow agents can be added to chats to mediate transactions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[#B8860B]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
            Join thousands of satisfied users on the most trusted Fortnite account marketplace.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/signup">
              <Button size="lg" className="bg-[#F4D03F] text-black hover:bg-yellow-400 text-base font-semibold px-8 py-6">
                Create Account
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 text-base font-semibold px-8 py-6 border-none">
                Browse Accounts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
