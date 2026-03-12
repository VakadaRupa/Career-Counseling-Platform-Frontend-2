import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../components/ui/BaseComponents';
import { ArrowRight, Briefcase, Bot, Users, BookOpen, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - Recipe 2 & 11 inspired */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                    <span className="text-[10px] font-extrabold text-brand-700 uppercase tracking-[0.2em]">Next-Gen Career Intelligence</span>
                  </div>
                  
                  <h1 className="text-[clamp(3.5rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-slate-900 mb-8">
                    Design your <br />
                    <span className="text-gradient italic font-serif font-normal">Future</span> with AI.
                  </h1>
                  
                  <p className="text-xl text-slate-500 leading-relaxed max-w-xl mb-12">
                    The world's most advanced career intelligence platform. We combine deep AI reasoning with human expertise to accelerate your professional growth.
                  </p>
                  
                  <div className="flex flex-wrap gap-6">
                    <Link to="/signup">
                      <Button className="h-20 px-12 text-sm font-bold uppercase tracking-widest rounded-[2rem] bg-brand-600 hover:bg-brand-700 shadow-[0_20px_50px_rgba(38,101,255,0.3)] border-none group">
                        Get Started Free
                        <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" className="h-20 px-12 text-sm font-bold uppercase tracking-widest rounded-[2rem] border-slate-200 hover:bg-slate-50 hover:border-slate-300">
                        Explore Demo
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-16 flex items-center gap-8">
                    <div className="flex -space-x-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden">
                          <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Joined by 10k+ professionals</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Sparkles key={i} size={12} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="relative z-10"
                >
                  <div className="relative rounded-[4rem] overflow-hidden super-shadow bg-slate-900 aspect-[4/5] lg:aspect-square">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                      alt="Collaboration"
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    
                    {/* Floating UI Elements */}
                    <div className="absolute bottom-12 left-12 right-12 glass-card p-8 rounded-[2.5rem] animate-float">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white">
                            <Bot size={24} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Analysis</p>
                            <p className="text-lg font-bold text-slate-900">Career Trajectory</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full px-4">+24%</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-[85%] bg-brand-500 rounded-full" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Current Skills</span>
                          <span>85% Match</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full" />
                  <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features - Recipe 8 & 1 inspired */}
        <section className="py-32 bg-slate-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="text-center mb-24">
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-tight text-slate-900 mb-6">
                Engineered for <span className="text-gradient">Excellence.</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                We've built the ultimate toolset for your professional journey. Every feature is crafted to give you an unfair advantage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large Bento Item */}
              <div className="md:col-span-8 bento-item bg-white super-shadow group">
                <div className="grid md:grid-cols-2 gap-12 items-center h-full">
                  <div>
                    <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-8">
                      <Bot size={28} />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">AI Career Architect</h3>
                    <p className="text-slate-500 leading-relaxed mb-8">
                      Our proprietary LLM analyzes millions of career paths to provide you with a personalized roadmap to your dream role.
                    </p>
                    <Button variant="ghost" className="p-0 text-brand-600 font-bold uppercase tracking-widest text-xs hover:bg-transparent group-hover:translate-x-2 transition-transform">
                      Learn how it works <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </div>
                  <div className="relative h-64 md:h-full rounded-3xl overflow-hidden bg-slate-50">
                    <img 
                      src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" 
                      alt="AI" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Small Bento Item */}
              <div className="md:col-span-4 bento-item bg-brand-600 text-white super-shadow flex flex-col justify-between group">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8">
                  <Users size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Expert Mentorship</h3>
                  <p className="text-brand-100 text-sm leading-relaxed mb-6">
                    Connect with leaders from Google, Meta, and top startups for 1:1 sessions.
                  </p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-brand-600 bg-brand-400 overflow-hidden">
                        <img src={`https://picsum.photos/seed/mentor${i}/100/100`} alt="Mentor" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full border-2 border-brand-600 bg-brand-500 flex items-center justify-center text-[10px] font-bold">
                      +50
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Bento Item */}
              <div className="md:col-span-4 bento-item bg-slate-900 text-white super-shadow group">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Resource Vault</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  500+ curated templates, guides, and courses updated weekly by industry pros.
                </p>
              </div>

              {/* Large Bento Item */}
              <div className="md:col-span-8 bento-item bg-white border border-slate-100 super-shadow group">
                <div className="flex flex-col md:flex-row gap-12 items-center h-full">
                  <div className="flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-8">
                      <Briefcase size={28} />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Smart Job Matching</h3>
                    <p className="text-slate-500 leading-relaxed">
                      Stop searching. Let our AI find opportunities that perfectly align with your skills, values, and salary expectations.
                    </p>
                  </div>
                  <div className="flex-1 w-full grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-square rounded-3xl bg-slate-50 p-4 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="relative rounded-[4rem] bg-slate-900 p-16 lg:p-24 overflow-hidden text-center">
              <div className="relative z-10">
                <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-white mb-8 leading-tight">
                  Ready to transform <br /> your career?
                </h2>
                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                  Join thousands of professionals who are already using CareerPath AI to reach their full potential.
                </p>
                <Link to="/signup">
                  <Button className="h-20 px-16 text-sm font-bold uppercase tracking-widest rounded-[2rem] bg-brand-500 hover:bg-brand-600 border-none shadow-2xl shadow-brand-500/40">
                    Start Your Journey Now
                  </Button>
                </Link>
              </div>
              
              {/* Background Accents */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500 blur-[120px] rounded-full" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 blur-[120px] rounded-full" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl">CP</div>
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">CareerPath AI</span>
              </Link>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Empowering the next generation of professionals with AI-driven career intelligence and expert mentorship.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/counseling" className="hover:text-brand-600 transition-colors">AI Counseling</Link></li>
                <li><Link to="/resources" className="hover:text-brand-600 transition-colors">Resource Vault</Link></li>
                <li><Link to="/jobs" className="hover:text-brand-600 transition-colors">Job Board</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-brand-600 transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-brand-600 transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-brand-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">© 2024 CareerPath AI. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-slate-400">
              <Link to="/" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
