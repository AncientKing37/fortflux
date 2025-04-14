
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Wallet, Bitcoin, Loader2 } from 'lucide-react';

interface WalletSettingsProps {
  onUpdate?: () => void;
}

const WalletSettings: React.FC<WalletSettingsProps> = ({ onUpdate }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState<{currency: string, name: string}[]>([]);
  const [preferredCurrency, setPreferredCurrency] = useState('btc');
  const [walletAddress, setWalletAddress] = useState('');
  const [ltcWalletAddress, setLtcWalletAddress] = useState('');
  
  useEffect(() => {
    const fetchWalletSettings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch user profile to get wallet settings
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Use optional chaining to safely access potentially missing properties
          setWalletAddress(data.wallet_address || '');
          setLtcWalletAddress(data.ltc_wallet_address || '');
          if (data.preferred_crypto) {
            setPreferredCurrency(data.preferred_crypto);
          }
        }
        
        // Fetch available cryptocurrencies
        const response = await supabase.functions.invoke('nowpayments', {
          method: 'GET',
          body: {} // Added empty body
        });
        
        if (response.error) throw new Error(response.error.message);
        
        // Filter and format currencies
        const popularCurrencies = ['btc', 'eth', 'ltc', 'usdt', 'usdc', 'xrp', 'doge', 'sol', 'bnb', 'ada'];
        const formattedCurrencies = response.data.currencies
          .filter((currency: string) => popularCurrencies.includes(currency.toLowerCase()))
          .map((currency: string) => ({
            currency: currency.toLowerCase(),
            name: getCurrencyName(currency),
          }));
          
        setAvailableCurrencies(formattedCurrencies);
      } catch (error) {
        console.error('Error fetching wallet settings:', error);
        toast.error('Failed to load wallet settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletSettings();
  }, [user]);
  
  const getCurrencyName = (code: string): string => {
    const names: Record<string, string> = {
      'btc': 'Bitcoin',
      'eth': 'Ethereum',
      'ltc': 'Litecoin',
      'doge': 'Dogecoin',
      'usdt': 'Tether USD',
      'usdc': 'USD Coin',
      'xrp': 'Ripple',
      'sol': 'Solana',
      'bnb': 'Binance Coin',
      'ada': 'Cardano',
    };
    return names[code.toLowerCase()] || code.toUpperCase();
  };
  
  const handleSaveWalletSettings = async () => {
    if (!user) return;
    
    if (!walletAddress) {
      toast.error('Please enter a wallet address');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          wallet_address: walletAddress,
          ltc_wallet_address: ltcWalletAddress,
          preferred_crypto: preferredCurrency,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Wallet settings saved successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving wallet settings:', error);
      toast.error('Failed to save wallet settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Settings
        </CardTitle>
        <CardDescription>
          Configure your wallet for receiving payments from sold accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="preferred-crypto">Preferred Cryptocurrency</Label>
          <Select 
            value={preferredCurrency}
            onValueChange={setPreferredCurrency}
          >
            <SelectTrigger id="preferred-crypto">
              <SelectValue placeholder="Select a cryptocurrency" />
            </SelectTrigger>
            <SelectContent>
              {availableCurrencies.map((currency) => (
                <SelectItem key={currency.currency} value={currency.currency}>
                  {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is the cryptocurrency you'll receive when buyers pay for your listings
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wallet-address">Primary Wallet Address</Label>
          <div className="flex gap-2">
            <Input
              id="wallet-address"
              placeholder={`Enter your ${getCurrencyName(preferredCurrency)} wallet address`}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                if (walletAddress && navigator.clipboard) {
                  navigator.clipboard.writeText(walletAddress);
                  toast.success('Wallet address copied to clipboard');
                }
              }}
              disabled={!walletAddress}
            >
              <Bitcoin className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Make sure to enter the correct address for {getCurrencyName(preferredCurrency)}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ltc-wallet-address">Litecoin (LTC) Wallet Address</Label>
          <div className="flex gap-2">
            <Input
              id="ltc-wallet-address"
              placeholder="Enter your Litecoin wallet address"
              value={ltcWalletAddress}
              onChange={(e) => setLtcWalletAddress(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                if (ltcWalletAddress && navigator.clipboard) {
                  navigator.clipboard.writeText(ltcWalletAddress);
                  toast.success('LTC wallet address copied to clipboard');
                }
              }}
              disabled={!ltcWalletAddress}
            >
              <Bitcoin className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dedicated address for receiving Litecoin payments
          </p>
        </div>
        
        <Button 
          onClick={handleSaveWalletSettings}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Wallet Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletSettings;
