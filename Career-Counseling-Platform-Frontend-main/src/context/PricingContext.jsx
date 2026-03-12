import React, { createContext, useContext, useState, useEffect } from 'react';

const PricingContext = createContext();

export const usePricing = () => useContext(PricingContext);

export const PricingProvider = ({ children }) => {
  const [qrCode, setQrCode] = useState(() => {
    const savedQr = localStorage.getItem('pricing_qr_code');
    return savedQr || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CareerPathPayment';
  });
  
  const [plans, setPlans] = useState(() => {
    const savedPlans = localStorage.getItem('pricing_plans');
    if (savedPlans) return JSON.parse(savedPlans);
    return [
      {
        id: 'free',
        name: 'Free',
        price: '0',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=400',
        description: 'Perfect for getting started.',
        features: [
          '5 AI Career Assistant chats/day',
          'Access to basic resources',
          'Community forum access',
          'Public job board'
        ],
        buttonText: 'Current Plan',
        variant: 'outline',
        color: 'slate'
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '19',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
        description: 'Best for active job seekers.',
        features: [
          'Unlimited AI Career Assistant',
          '1 Expert counseling session/month',
          'Premium resource library',
          'Priority job applications',
          'Resume review tool'
        ],
        buttonText: 'Upgrade to Pro',
        variant: 'primary',
        popular: true,
        color: 'brand'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: '49',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400',
        description: 'For those who want it all.',
        features: [
          'Everything in Pro',
          '4 Expert counseling sessions/month',
          'Direct 24/7 mentor support',
          'Interview simulation with AI',
          'Personalized career roadmap'
        ],
        buttonText: 'Go Enterprise',
        variant: 'secondary',
        color: 'indigo'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pricing_qr_code', qrCode);
  }, [qrCode]);

  useEffect(() => {
    localStorage.setItem('pricing_plans', JSON.stringify(plans));
  }, [plans]);

  const updatePlanPrice = (id, newPrice) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p));
  };

  const updateQrCode = (newQr) => {
    setQrCode(newQr);
  };

  return (
    <PricingContext.Provider value={{ plans, qrCode, updatePlanPrice, updateQrCode }}>
      {children}
    </PricingContext.Provider>
  );
};
