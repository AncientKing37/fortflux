import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Check, Wallet, Clock, Search, CircleDollarSign } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FortFlux | Homepage</title>
        <meta name="description" content="The secure marketplace for buying and selling Fortnite accounts" />
      </Helmet>
      <div className="min-h-screen bg-white">
        {/* Hero Section with custom wallpaper */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-[url('/fortnite-bus.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-black/40"></div>
          
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
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
              Why Choose <span className="text-yellow-500">FortFlux</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature cards */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-500/20">
                <Shield className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">Secure Escrow</h3>
                <p className="text-gray-600">Your funds are protected until the transaction is complete.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-500/20">
                <Check className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">Verified Sellers</h3>
                <p className="text-gray-600">All sellers are verified to ensure safe transactions.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-500/20">
                <Wallet className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">Crypto Payments</h3>
                <p className="text-gray-600">Fast and secure payments with multiple crypto options.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
              How <span className="text-yellow-500">FortFlux</span> Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-yellow-500 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Browse Listings</h3>
                <p className="text-gray-600">Find the perfect Fortnite account for you.</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-500 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Secure Payment</h3>
                <p className="text-gray-600">Pay securely through our escrow system.</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-500 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Account Transfer</h3>
                <p className="text-gray-600">Receive your account details securely.</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-500 text-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Release Funds</h3>
                <p className="text-gray-600">Confirm receipt and release payment to seller.</p>
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
              Whether you're looking to buy a rare Fortnite account or sell your own, FortFlux makes it safe and simple.
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
