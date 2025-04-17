import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { Toaster } from './components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import Index from './pages/Index';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import ListingDetails from './pages/ListingDetails';
import SellerProfile from './pages/SellerProfile';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
import Messages from './pages/dashboard/Messages';
import Purchases from './pages/dashboard/Purchases';
import BecomeASeller from './pages/dashboard/BecomeASeller';
import ListingsManagement from './pages/dashboard/ListingsManagement';
import CreateListing from './pages/dashboard/CreateListing';
import SupportDashboard from './pages/dashboard/SupportDashboard';
import UserManagement from './pages/dashboard/UserManagement';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EscrowHome from './pages/dashboard/EscrowHome';
import Settings from './pages/dashboard/Settings';

// Admin dashboard components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import DisputeManagement from './pages/admin/DisputeManagement';
import BanSystem from './pages/admin/BanSystem';
import ListingApproval from './pages/admin/ListingApproval';
import FlaggedContent from './pages/admin/FlaggedContent';
import EscrowQueue from './pages/admin/EscrowQueue';
import FeesAnalytics from './pages/admin/FeesAnalytics';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import NotificationsManager from './pages/admin/NotificationsManager';
import RolesPermissions from './pages/admin/RolesPermissions';
import RoleManagement from './pages/admin/RoleManagement';
import MobileNavigation from './components/common/MobileNavigation';

// New Footer Pages
import FeaturedListings from './pages/FeaturedListings';
import SellAccount from './pages/SellAccount';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';

// Create a client
const queryClient = new QueryClient();

import './styles/fonts.css';  // Import our custom fonts
import TicketList from '@/components/tickets/TicketList';
import NewTicketForm from '@/components/tickets/NewTicketForm';
import TicketDetail from '@/components/tickets/TicketDetail';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

function CrispChat() {
  const { user } = useUser();

  useEffect(() => {
    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "95284ef6-dfb0-4025-8550-2303429ad87f";

    // Load Crisp script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://client.crisp.chat/l.js';
    document.head.appendChild(script);

    // Configure Crisp when it's ready
    script.onload = () => {
      // Set theme colors to match your site
      window.$crisp.push(["set", "buttonColor", "#fbbf24"]);
      window.$crisp.push(["set", "theme:colors:brandColor", "#fbbf24"]);
      window.$crisp.push(["set", "theme:colors:conversationButton", "#fbbf24"]);
      window.$crisp.push(["set", "theme:colors:conversationText", "#000000"]);

      // Set chat box position and behavior
      window.$crisp.push(["set", "position:reverse", true]);
      window.$crisp.push(["set", "position:placement", "right"]);
      window.$crisp.push(["set", "chat:autoPopup", false]);
      window.$crisp.push(["set", "chat:scroll", true]);

      // Customize chat appearance
      window.$crisp.push(["set", "website:name", "FortFlux Support"]);
      window.$crisp.push(["set", "message:welcome", "Welcome to FortFlux! How can we help you today?"]);
      window.$crisp.push(["set", "message:text", "Chat with our support team"]);

      // Set up user identification if logged in
      if (user) {
        window.$crisp.push(["set", "user:email", user.email]);
        window.$crisp.push(["set", "user:nickname", user.username]);
        window.$crisp.push(["set", "user:avatar", user.avatar_url || ""]);
        
        // Set custom user data
        window.$crisp.push(["set", "session:data", [
          ["Role", user.role],
          ["User ID", user.id],
          ["Join Date", new Date(user.created_at).toLocaleDateString()],
          ["Account Status", "Active"]
        ]]);

        // Tag the user based on their role
        if (user.role) {
          window.$crisp.push(["set", "session:tags", [user.role]]);
        }
      }

      // Set up event handlers
      window.$crisp.push(["on", "chat:opened", () => {
        console.log("Chat opened");
      }]);

      window.$crisp.push(["on", "message:sent", () => {
        console.log("Message sent");
      }]);

      window.$crisp.push(["on", "chat:closed", () => {
        console.log("Chat closed");
      }]);
    };

    return () => {
      // Cleanup
      const crispScript = document.querySelector('script[src*="crisp.chat"]');
      if (crispScript && crispScript.parentNode) {
        crispScript.parentNode.removeChild(crispScript);
      }
      // Reset Crisp
      window.$crisp = [];
      delete window.CRISP_WEBSITE_ID;
    };
  }, [user]); // Add user as dependency to update when user state changes

  return null; // This component doesn't render anything
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <BrowserRouter>
            {/* Navbar is rendered on all routes except those under /dashboard and /admin */}
            <Routes>
              {/* Public Routes - with Navbar */}
              <Route 
                path="/" 
                element={
                  <>
                    <Navbar />
                    <Home />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/how-it-works" 
                element={
                  <>
                    <Navbar />
                    <HowItWorks />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <>
                    <Navbar />
                    <Login />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/admin-login" 
                element={
                  <>
                    <Navbar />
                    <AdminLogin />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <>
                    <Navbar />
                    <Signup />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/marketplace" 
                element={
                  <>
                    <Navbar />
                    <Marketplace />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/marketplace/:id" 
                element={
                  <>
                    <Navbar />
                    <ListingDetails />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/seller/:username" 
                element={
                  <>
                    <Navbar />
                    <SellerProfile />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <>
                    <Navbar />
                    <Favorites />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              
              {/* New Footer Pages Routes */}
              <Route 
                path="/featured" 
                element={
                  <>
                    <Navbar />
                    <FeaturedListings />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/sell" 
                element={
                  <>
                    <Navbar />
                    <SellAccount />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/faq" 
                element={
                  <>
                    <Navbar />
                    <FAQ />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <>
                    <Navbar />
                    <Contact />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/terms" 
                element={
                  <>
                    <Navbar />
                    <Terms />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/privacy" 
                element={
                  <>
                    <Navbar />
                    <Privacy />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              <Route 
                path="/disclaimer" 
                element={
                  <>
                    <Navbar />
                    <Disclaimer />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
              
              {/* User Dashboard Routes - for buyer and seller roles - without Navbar */}
              <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
              <Route path="/dashboard/profile" element={<DashboardLayout><ProfilePage /></DashboardLayout>} />
              <Route path="/dashboard/messages" element={<DashboardLayout><Messages /></DashboardLayout>} />
              <Route path="/dashboard/purchases" element={<DashboardLayout><Purchases /></DashboardLayout>} />
              <Route path="/dashboard/become-seller" element={<DashboardLayout><BecomeASeller /></DashboardLayout>} />
              <Route path="/dashboard/listings" element={<DashboardLayout><ListingsManagement /></DashboardLayout>} />
              <Route path="/dashboard/create-listing" element={<DashboardLayout><CreateListing /></DashboardLayout>} />
              <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
              
              {/* Ticket System Routes */}
              <Route path="/dashboard/tickets" element={<DashboardLayout><TicketList /></DashboardLayout>} />
              <Route path="/dashboard/tickets/new" element={<DashboardLayout><NewTicketForm /></DashboardLayout>} />
              <Route path="/dashboard/tickets/:id" element={<DashboardLayout><TicketDetail /></DashboardLayout>} />
              
              {/* Support Staff Routes - without Navbar */}
              <Route path="/dashboard/support" element={<DashboardLayout><SupportDashboard /></DashboardLayout>} />
              <Route path="/dashboard/disputes" element={<DashboardLayout><DisputeManagement /></DashboardLayout>} />
              <Route path="/dashboard/notifications" element={<DashboardLayout><NotificationsManager /></DashboardLayout>} />
              
              {/* Escrow Routes - without Navbar */}
              <Route path="/dashboard/escrows" element={<DashboardLayout><EscrowHome /></DashboardLayout>} />
              <Route path="/dashboard/release-funds" element={<DashboardLayout><EscrowQueue /></DashboardLayout>} />
              <Route path="/dashboard/transactions" element={<DashboardLayout><FeesAnalytics /></DashboardLayout>} />
              <Route path="/dashboard/escrow-earnings" element={<DashboardLayout><EscrowHome /></DashboardLayout>} />
              
              {/* Shared Admin/Support/Escrow Routes - without Navbar */}
              <Route path="/dashboard/users" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
              
              {/* Admin Dashboard Routes - without Navbar */}
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              
              {/* Moderation Routes - without Navbar */}
              <Route path="/admin/disputes" element={<AdminLayout><DisputeManagement /></AdminLayout>} />
              <Route path="/admin/bans" element={<AdminLayout><BanSystem /></AdminLayout>} />
              <Route path="/admin/listings/approve" element={<AdminLayout><ListingApproval /></AdminLayout>} />
              <Route path="/admin/flagged-content" element={<AdminLayout><FlaggedContent /></AdminLayout>} />
              
              {/* Payments & Escrow Routes - without Navbar */}
              <Route path="/admin/escrow-queue" element={<AdminLayout><EscrowQueue /></AdminLayout>} />
              <Route path="/admin/fees" element={<AdminLayout><FeesAnalytics /></AdminLayout>} />
              
              {/* Analytics Routes - without Navbar */}
              <Route path="/admin/analytics" element={<AdminLayout><AnalyticsDashboard /></AdminLayout>} />
              
              {/* Notifications Routes - without Navbar */}
              <Route path="/admin/notifications" element={<AdminLayout><NotificationsManager /></AdminLayout>} />
              
              {/* Roles & Permissions Routes - without Navbar */}
              <Route path="/admin/roles" element={<AdminLayout><RolesPermissions /></AdminLayout>} />
              <Route path="/admin/role-management" element={<AdminLayout><RoleManagement /></AdminLayout>} />
              
              {/* Auth Routes - with Navbar and Footer */}
              <Route 
                path="/forgot-password" 
                element={
                  <>
                    <Navbar />
                    <ForgotPassword />
                    <Footer />
                  </>
                } 
              />
              
              <Route 
                path="/reset-password" 
                element={
                  <>
                    <Navbar />
                    <ResetPassword />
                    <Footer />
                  </>
                } 
              />
              
              <Route 
                path="/auth/callback" 
                element={<AuthCallback />} 
              />
              
              {/* Not Found - with Navbar */}
              <Route 
                path="*" 
                element={
                  <>
                    <Navbar />
                    <NotFound />
                    <Footer />
                    <MobileNavigation />
                  </>
                } 
              />
            </Routes>
            <Toaster />
            <CrispChat />
          </BrowserRouter>
        </UserProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
