import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Card, Button, Badge, Input } from '../components/ui/BaseComponents';
import { Check, Star, Zap, Shield, QrCode, Upload, X, Info, CreditCard, Edit3, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePricing } from '../context/PricingContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, qrCode, updatePlanPrice, updateQrCode } = usePricing();
  const isAdmin = user?.role === 'admin';
  const fileInputRef = useRef(null);
  
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null); // ID of the plan being edited
  const [tempPrice, setTempPrice] = useState('');

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQrCode(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpgrade = (plan) => {
    if (plan.price === '0') return;
    setShowPaymentModal(plan);
  };

  const confirmPayment = () => {
    alert('Payment verification initiated! Our team will review your transaction.');
    setShowPaymentModal(null);
    navigate('/dashboard');
  };

  const startEditingPrice = (plan) => {
    setEditingPrice(plan.id);
    setTempPrice(plan.price);
  };

  const savePrice = (id) => {
    updatePlanPrice(id, tempPrice);
    setEditingPrice(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="info" className="mb-4 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em]">
              Flexible Plans
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
              Invest in your <span className="text-brand-600 italic serif">Future.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
              Choose a plan that fits your career goals. Unlock premium features and expert guidance to accelerate your growth.
            </p>
          </motion.div>
        </div>

        {/* Admin Controls Section */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <QrCode size={32} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Admin: Pricing & QR Management</h3>
                  <p className="text-slate-400 text-sm">Update plan costs and the official payment QR code.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-xl bg-white p-2 shadow-inner">
                  <img src={qrCode} alt="Current QR" className="h-full w-full object-contain" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleQrUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <Button 
                  onClick={() => fileInputRef.current.click()}
                  className="bg-brand-500 hover:bg-brand-600 text-white rounded-2xl px-6 py-3 flex items-center gap-2"
                >
                  <Upload size={18} />
                  Change QR Code
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-end">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card className={`relative flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-none rounded-[3rem] ${
                plan.popular ? 'bg-slate-900 text-white ring-4 ring-brand-500/20 h-[110%]' : 'bg-white text-slate-900'
              }`}>
                <div className="p-10 flex-1 flex flex-col">
                  {plan.popular && (
                    <div className="absolute top-8 right-8">
                      <Badge className="bg-brand-500 text-white border-none px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mb-10">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${plan.popular ? 'text-brand-400' : 'text-slate-400'}`}>
                      {plan.name} Plan
                    </p>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-5xl font-black tracking-tighter">
                        {editingPrice === plan.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">$</span>
                            <input 
                              type="text" 
                              value={tempPrice} 
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-24 bg-white/10 border border-white/20 rounded-xl px-3 py-1 text-3xl font-black text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                          </div>
                        ) : (
                          `$${plan.price}`
                        )}
                      </span>
                      <span className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>/month</span>
                      
                      {isAdmin && (
                        <div className="ml-auto">
                          {editingPrice === plan.id ? (
                            <button onClick={() => savePrice(plan.id)} className="p-2 text-brand-400 hover:text-brand-300">
                              <Save size={18} />
                            </button>
                          ) : (
                            <button onClick={() => startEditingPrice(plan)} className="p-2 text-slate-400 hover:text-brand-400">
                              <Edit3 size={18} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>

                    {plan.price !== '0' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`mt-6 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                          plan.popular ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        <div className="h-16 w-16 bg-white p-1 rounded-lg shrink-0 shadow-sm">
                          <img src={qrCode} alt="Pay QR" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="text-left">
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${plan.popular ? 'text-brand-400' : 'text-brand-600'}`}>
                            Scan to Pay
                          </p>
                          <p className={`text-[9px] leading-tight font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pay ${plan.price} instantly via QR and click below to verify.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className={`h-px w-full mb-10 ${plan.popular ? 'bg-white/10' : 'bg-slate-100'}`} />

                  <ul className="flex-1 space-y-5 mb-10">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-4 text-sm font-medium">
                        <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.popular ? 'bg-brand-500/20 text-brand-400' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className={plan.popular ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.variant} 
                    className={`w-full py-8 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/20' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                    onClick={() => handleUpgrade(plan)}
                    disabled={plan.price === '0'}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-xl"
        >
          <div className="p-10 md:p-16">
            <h3 className="text-3xl font-black text-slate-900 mb-12 text-center">Compare <span className="text-brand-600 italic serif">Features</span></h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-slate-400">Feature</th>
                    <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-slate-900 text-center">Free</th>
                    <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-brand-600 text-center">Pro</th>
                    <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-indigo-600 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'AI Career Assistant', free: '5/day', pro: 'Unlimited', enterprise: 'Unlimited' },
                    { name: 'Expert Counseling', free: '-', pro: '1/month', enterprise: '4/month' },
                    { name: 'Resource Library', free: 'Basic', pro: 'Premium', enterprise: 'All-Access' },
                    { name: 'Interview Simulation', free: '-', pro: '-', enterprise: 'Unlimited' },
                    { name: 'Priority Support', free: '-', pro: 'Email', enterprise: '24/7 Personal' },
                    { name: 'Resume Review', free: '-', pro: 'Yes', enterprise: 'Yes' },
                  ].map((row) => (
                    <tr key={row.name} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-6 px-4 text-sm font-bold text-slate-900">{row.name}</td>
                      <td className="py-6 px-4 text-sm text-slate-500 text-center font-medium">{row.free}</td>
                      <td className="py-6 px-4 text-sm text-slate-900 text-center font-bold">{row.pro}</td>
                      <td className="py-6 px-4 text-sm text-slate-900 text-center font-bold">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-32 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {[
            { icon: Shield, title: 'Secure Payments', desc: 'Encrypted transactions with instant verification.', color: 'indigo' },
            { icon: Zap, title: 'Instant Access', desc: 'Unlock all features immediately after payment.', color: 'emerald' },
            { icon: Star, title: 'Cancel Anytime', desc: 'No commitments. Switch or stop whenever you want.', color: 'amber' }
          ].map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-${item.color}-50 text-${item.color}-600 mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <item.icon size={28} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <button 
                  onClick={() => setShowPaymentModal(null)}
                  className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={24} />
                </button>

                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-50 text-brand-600 mb-6">
                    <CreditCard size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Complete Payment</h2>
                  <p className="text-slate-500">Scan the QR code below to pay for the <span className="font-bold text-slate-900">{showPaymentModal.name}</span> plan.</p>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <div className="relative p-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                      <img src={qrCode} alt="Payment QR" className="w-48 h-48 object-contain" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Scan to Pay
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                      <Info className="text-amber-600 shrink-0" size={20} />
                      <p className="text-xs text-amber-800 leading-relaxed">
                        After payment, please click the button below. Our team will verify the transaction and upgrade your account within 24 hours.
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full py-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 shadow-xl"
                      onClick={confirmPayment}
                    >
                      I've Made the Payment
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
