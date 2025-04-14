import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Check, Wallet, Clock, Search, CircleDollarSign } from "lucide-react";

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section with custom wallpaper */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-[url('/fortnite-bus.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6">
                <div className="inline-block px-4 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full text-sm font-medium mb-2">
                  #1 Trusted Fortnite Marketplace
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mx-0">
                  Buy & Sell <span className="text-yellow-500">Fortnite</span> Accounts Securely
                </h1>
                <p className="text-lg md:text-xl text-gray-100 md:pr-10">
                  Secure transactions with escrow protection, crypto payments, and 24/7 support from our trusted community.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/marketplace">
                    <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 font-semibold text-base">
                      Browse Accounts <Search className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/20 font-semibold text-base"
                    >
                      Sell Your Account <CircleDollarSign className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-sm text-white">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1.5 text-yellow-500" />
                    <span>Secure Escrow</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1.5 text-yellow-500" />
                    <span>Verified Sellers</span>
                  </div>
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 mr-1.5 text-yellow-500" />
                    <span>Crypto Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 bg-white border-t border-yellow-500/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg border border-yellow-500">
                <p className="text-3xl md:text-4xl font-bold text-yellow-500">10k+</p>
                <p className="text-gray-800 mt-2">Active Accounts</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-yellow-500">
                <p className="text-3xl md:text-4xl font-bold text-yellow-500">5k+</p>
                <p className="text-gray-800 mt-2">Happy Customers</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-yellow-500">
                <p className="text-3xl md:text-4xl font-bold text-yellow-500">99%</p>
                <p className="text-gray-800 mt-2">Success Rate</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-yellow-500">
                <p className="text-3xl md:text-4xl font-bold text-yellow-500">24/7</p>
                <p className="text-gray-800 mt-2">Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EL1TE MP?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">The safest platform to buy and sell Fortnite accounts with confidence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-xl border border-yellow-500 hover:border-yellow-600 transition-all duration-300 group">
                <div className="bg-yellow-500 p-3 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-yellow-500 transition-colors">Secure Escrow</h3>
                <p className="text-gray-600">
                  Our escrow system ensures both buyers and sellers are protected throughout every transaction.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-yellow-500 hover:border-yellow-600 transition-all duration-300 group">
                <div className="bg-yellow-500 p-3 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-yellow-500 transition-colors">Crypto Payments</h3>
                <p className="text-gray-600">
                  Fast and secure transactions with Bitcoin, Ethereum, and other popular cryptocurrencies.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-yellow-500 hover:border-yellow-600 transition-all duration-300 group">
                <div className="bg-yellow-500 p-3 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-yellow-500 transition-colors">Verified Accounts</h3>
                <p className="text-gray-600">
                  All accounts undergo strict verification to ensure they match the seller's description.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-yellow-500 hover:border-yellow-600 transition-all duration-300 group">
                <div className="bg-yellow-500 p-3 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-yellow-500 transition-colors">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your account details quickly after payment confirmation through our automated system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20"></div>
          <div className="absolute inset-0 bg-[url('/fortnite-bus.jpg')] bg-cover bg-center opacity-10"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600">
              Whether you're looking to buy a rare Fortnite account or sell your own, EL1TE MP makes it safe and simple.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 text-base font-semibold">
                  Create Account
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/20 text-base font-semibold">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
