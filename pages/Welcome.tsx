import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Play, ChevronDown, Plus, Minus, 
  Twitter, Youtube, Instagram, Disc, Globe, Video, Image as ImageIcon,
  Wand2, Zap, Layers, Mic, Menu, X, ArrowUpRight, Users
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Welcome: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const templates = [
    { type: 'Image to Video', img: 'https://picsum.photos/400/600?random=101', title: 'Cyberpunk' },
    { type: 'Video to Video', img: 'https://picsum.photos/400/600?random=102', title: 'Anime Style' },
    { type: 'Text to Video', img: 'https://picsum.photos/400/600?random=103', title: 'Realistic' },
    { type: 'Image to Video', img: 'https://picsum.photos/400/600?random=104', title: '3D Render' },
  ];

  const faqs = [
    { q: "What can I do with SUCCESS_AI?", a: "You can generate videos from text, animate static images, transform existing videos into different styles (like anime or 3D), and upscale content to 4K resolution." },
    { q: "Is SUCCESS_AI free to use?", a: "We offer a free tier with daily credits. For advanced features and faster generation, Pro and Premium plans are available." },
    { q: "Can I use the content generated commercially?", a: "Yes, content generated under our Pro and Premium plans comes with a commercial license." },
    { q: "Is my uploaded content secure?", a: "Absolutely. We use enterprise-grade encryption and your source files are automatically deleted after processing." },
    { q: "I have more questions. How can I reach out?", a: "You can join our Discord server or contact our support team via email." }
  ];

  const footerLinks = {
    "AI Tools": [
      "All AI Tools", "Video to Video", "Image to Video", "Text to Video", 
      "Image to Image", "Image Animation", "Character Animation", "Text to Image"
    ],
    "Quick Apps": [
      "All Quick Apps", "AI Anime Video Generator", "AI Talking Avatar", "Video Upscaler",
      "Background Remover", "AI Video Lip Sync", "AI Video Style Transfer", 
      "Cartoonize Video Object", "AI Image Generator", "AI Image Upscaler",
      "AI VTuber Maker", "AI Cartoon Video Generator"
    ],
    "Solutions": [
      "AI Animation", "Content Creator", "Filmmaker", "AI Ads", "Gaming Asset", "Anime Creator"
    ],
    "Resources": [
      "Blog", "Affiliate", "Media Kit", "Creative Partner Program", "Help Center"
    ]
  };

  const WateryButton = ({ children, className = '', ...props }: any) => (
    <button 
      className={`relative overflow-hidden group backdrop-blur-md bg-white/5 border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10 hover:border-white/30 hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] text-white rounded-full transition-all duration-300 ${className}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );

  const partners = [
    { name: "voicy", color: "text-white" },
    { name: "Civitai", color: "text-white", icon: <Layers size={20} className="mr-1 fill-white" /> },
    { name: "Discord", color: "text-[#5865F2]", icon: <Disc size={24} className="mr-1 fill-current" /> },
    { name: "tv asahi", color: "text-pink-500", icon: <div className="w-5 h-3 bg-pink-500 rounded-sm mr-1"></div> },
    { name: "a16z", color: "text-white" },
    { name: "OpenAI", color: "text-white" },
    { name: "Runway", color: "text-white" },
    { name: "Midjourney", color: "text-white" },
    { name: "Stability", color: "text-white" },
    { name: "Pika", color: "text-white" },
  ];

  const creators = [
    { name: "EMDOTTECH", followers: "1768K", img: "https://picsum.photos/100/100?random=50" },
    { name: "SEB.DRAWS.THINGS", followers: "1559K", img: "https://picsum.photos/100/100?random=51" },
    { name: "DENY KING", followers: "1340K", img: "https://picsum.photos/100/100?random=52" },
    { name: "PLANET AI", followers: "377K", img: "https://picsum.photos/100/100?random=53" },
    { name: "ARTIFICIAL", followers: "892K", img: "https://picsum.photos/100/100?random=54" },
    { name: "VISUALS_BY_AI", followers: "654K", img: "https://picsum.photos/100/100?random=55" },
    { name: "MOTION_LAB", followers: "420K", img: "https://picsum.photos/100/100?random=56" },
    { name: "NEON_DREAMS", followers: "980K", img: "https://picsum.photos/100/100?random=57" },
    { name: "CYBER_ARTIST", followers: "2.1M", img: "https://picsum.photos/100/100?random=58" },
    { name: "PIXEL_PERFECT", followers: "550K", img: "https://picsum.photos/100/100?random=59" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-slate-400 flex items-center justify-center">
               <Wand2 size={20} className="text-black" />
            </div>
            <span className="text-xl font-bold brand-font tracking-tight text-white">SUCCESS_AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div onClick={() => navigate('/signup')}>
              <WateryButton className="px-5 py-2 text-sm font-semibold">
                Get Started Now <ArrowRight size={14} />
              </WateryButton>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://cdn.coverr.co/videos/coverr-a-person-in-a-hoodie-with-green-lights-8647/1080p.mp4"
        ></video>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>

        {/* Hero Content - Tightly grouped vertically, positioned in upper center */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 container mx-auto pt-12 md:pt-0">
          <div className="max-w-4xl animate-in slide-in-from-bottom-10 duration-1000">
            <p className="text-white/90 font-medium text-xl mb-2 italic serif-font tracking-wide">AI Video Generator</p>
            
            {/* Tighter leading and margins for a compact look */}
            <h1 className="text-6xl md:text-8xl font-medium leading-[0.95] mb-4 serif-font">
              Generate.<br/>
              <span className="italic font-light">Animate.</span> Engage.
            </h1>
            
            <p className="text-slate-200 text-lg md:text-xl max-w-xl mb-6 font-light leading-snug">
              The complete AI animation platform for video generation. 
              Turn text, images, and video into anime, realistic, or artistic styles instantly.
            </p>
            
            <div onClick={() => navigate('/signup')} className="inline-block w-fit cursor-pointer">
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Start Creating Free <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof / Partners Marquee */}
      <div className="bg-black py-10 border-b border-white/5 overflow-hidden flex flex-col gap-10">
        
        {/* Partners - Moving Right */}
        <div className="marquee-container">
           <div className="marquee-content-right">
              {[...partners, ...partners, ...partners].map((p, i) => (
                 <div key={i} className={`flex items-center gap-2 mx-8 md:mx-12 text-2xl md:text-3xl font-bold tracking-tight opacity-50 hover:opacity-100 transition-opacity ${p.color}`}>
                    {p.icon}
                    {p.name}
                 </div>
              ))}
           </div>
        </div>
        
        {/* Creators - Moving Left (Marquee) */}
        <div className="marquee-container">
          <div className="marquee-content">
             {[...creators, ...creators, ...creators].map((creator, idx) => (
               <div key={idx} className="flex items-center gap-4 mx-8 md:mx-12 group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                 <div className="flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 mb-2 group-hover:scale-110 transition-transform">
                     <img src={creator.img} alt={creator.name} className="w-full h-full rounded-full border-2 border-black object-cover" />
                   </div>
                   <span className="text-xs font-bold tracking-wider uppercase text-white">{creator.name}</span>
                   <span className="text-[10px] text-slate-400">{creator.followers}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Feature Section: From Concept to AI Videos */}
      <div className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl serif-font italic mb-4 font-light text-white">From Concept to AI Videos</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">
              Generate videos from text, animate static images, or transform any footage into professional creative content in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Main Featured Card */}
            <div className="col-span-1 md:col-span-8 relative group rounded-[2rem] overflow-hidden bg-[#111] border border-white/5">
               <div className="aspect-[4/3] md:aspect-[16/9] w-full">
                  <img src="https://picsum.photos/800/600?random=1" alt="Video to Video" className="w-full h-full object-cover" />
               </div>
               <div className="p-8 pb-10">
                  <div className="flex items-center gap-3 mb-3 text-white">
                     <Video size={24} />
                     <h3 className="text-2xl font-bold">Video to Video</h3>
                  </div>
                  <p className="text-slate-400 mb-8 max-w-md font-light">
                     Transform existing footage into anime, realistic, or any style by your reference.
                  </p>
                  <WateryButton className="px-6 py-2.5 text-sm font-semibold">
                    Try Now <ArrowUpRight size={14} />
                  </WateryButton>
               </div>
            </div>

            {/* Side Card (Partially Visible Style) */}
            <div className="col-span-1 md:col-span-4 relative group rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 opacity-60 hover:opacity-100 transition-opacity">
               <div className="aspect-[3/4] w-full relative">
                  <img src="https://picsum.photos/400/600?random=2" alt="Image to Video" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                     <div className="flex items-center gap-2 mb-2 text-white">
                       <ImageIcon size={20} />
                       <h3 className="text-xl font-bold">Image to Video</h3>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Cards Section (Image Editor, Text to Image, etc) */}
      <div className="bg-black pb-24 space-y-6">
         <div className="container mx-auto px-6 max-w-3xl">
            {/* AI Image Editor Card */}
            <div className="rounded-[2rem] bg-[#0f0f0f] border border-white/5 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
               <h3 className="text-2xl font-bold text-white mb-4">AI Image Editor</h3>
               <p className="text-slate-400 mb-8 max-w-sm font-light">Edit any photo using simple descriptions in Nano Banana Pro.</p>
               <WateryButton className="px-8 py-3 text-sm font-semibold">
                  Try Now <ArrowUpRight size={14} />
               </WateryButton>
            </div>

            {/* Text to Image Card */}
            <div className="mt-6 rounded-[2rem] bg-[#0f0f0f] border border-white/5 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
               <h3 className="text-2xl font-bold text-white mb-4">Text to Image</h3>
               <p className="text-slate-400 mb-8 max-w-sm font-light">Generate stunning visuals from any prompt description.</p>
               <WateryButton className="px-8 py-3 text-sm font-semibold">
                  Try Now <ArrowUpRight size={14} />
               </WateryButton>
            </div>
         </div>
      </div>

      {/* Templates Section */}
      <div className="bg-black pb-24 overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="flex justify-between items-end mb-10">
              <div>
                 <h2 className="text-4xl serif-font italic text-white mb-2">Get Templates</h2>
                 <h2 className="text-4xl serif-font text-white italic">Then Remix</h2>
                 <p className="text-slate-400 mt-4 max-w-md font-light text-sm">Browse viral creations from our community, then remix any style with your own content.</p>
              </div>
              <div className="flex gap-4">
                 <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><ArrowRight className="rotate-180" size={18} /></button>
                 <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><ArrowRight size={18} /></button>
              </div>
           </div>
           
           <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x">
              {templates.map((t, i) => (
                 <div key={i} className="snap-center shrink-0 w-[280px] md:w-[320px] aspect-[9/16] rounded-2xl overflow-hidden relative group">
                    <img src={t.img} alt={t.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                       <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-white flex items-center gap-1">
                          {i === 0 ? <Video size={10} /> : <ImageIcon size={10} />}
                          {t.type}
                       </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <h4 className="text-lg font-bold text-white mb-4">{t.title}</h4>
                       <WateryButton className="w-full py-2 text-xs font-semibold">
                          Try Now <ArrowUpRight size={12} />
                       </WateryButton>
                    </div>
                 </div>
              ))}
           </div>
           <div className="flex justify-center mt-8">
              <WateryButton className="px-8 py-3 text-sm">View All</WateryButton>
           </div>
        </div>
      </div>

      {/* Stats Section (Circles) */}
      <div className="py-24 bg-black">
        <div className="container mx-auto px-6 text-center">
           <h2 className="text-4xl serif-font italic text-white mb-2">3M+ Creators</h2>
           <h2 className="text-4xl serif-font text-white italic mb-16">Millions of Viral Videos</h2>
           
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 max-w-5xl mx-auto">
             {/* Stat 1 */}
             <div className="flex flex-col items-center">
               <div className="w-36 h-36 rounded-full border border-white/20 flex flex-col items-center justify-center mb-6 relative group">
                 <div className="absolute inset-0 rounded-full bg-white/5 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                 <Globe size={28} className="text-white mb-2 relative z-10" />
                 <span className="text-2xl font-bold text-white relative z-10">#7</span>
               </div>
               <p className="text-white/60 text-xs font-medium uppercase tracking-widest text-center leading-relaxed">Discord<br/>Server<br/>Globally</p>
             </div>
             
             {/* Stat 2 */}
             <div className="flex flex-col items-center">
               <div className="w-36 h-36 rounded-full border border-white/20 flex flex-col items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 rounded-full bg-white/5 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                 <Video size={28} className="text-white mb-2 relative z-10" />
                 <span className="text-2xl font-bold text-white relative z-10">70+</span>
               </div>
               <p className="text-white/60 text-xs font-medium uppercase tracking-widest text-center leading-relaxed">AI Video<br/>Models</p>
             </div>
             
             {/* Stat 3 */}
             <div className="flex flex-col items-center">
               <div className="w-36 h-36 rounded-full border border-white/20 flex flex-col items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 rounded-full bg-white/5 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                 <Users size={28} className="text-white mb-2 relative z-10" />
                 <span className="text-2xl font-bold text-white relative z-10">4M+</span>
               </div>
               <p className="text-white/60 text-xs font-medium uppercase tracking-widest text-center leading-relaxed">Active<br/>Users</p>
             </div>
           </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 bg-black">
        <div className="container mx-auto px-6 max-w-3xl">
           <h2 className="text-4xl serif-font italic text-center mb-16 text-white">Frequently Asked Questions</h2>
           <div className="space-y-2">
             {faqs.map((faq, idx) => (
               <div key={idx} className="bg-[#0f0f0f] rounded-2xl overflow-hidden transition-all">
                 <button 
                   onClick={() => toggleFaq(idx)}
                   className="w-full flex justify-between items-center p-6 text-left font-semibold text-white hover:text-slate-200 transition-colors"
                 >
                   <span className="text-base md:text-lg">{faq.q}</span>
                   {openFaq === idx ? <Minus size={20} className="shrink-0" /> : <Plus size={20} className="shrink-0" />}
                 </button>
                 {openFaq === idx && (
                   <div className="px-6 pb-6 text-slate-400 leading-relaxed text-sm md:text-base animate-in slide-in-from-top-2">
                     {faq.a}
                   </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Footer "Start for free" Banner */}
      <div className="bg-[#22c55e] py-4 text-center">
         <div onClick={() => navigate('/signup')} className="text-black font-bold flex items-center justify-center gap-2 hover:gap-4 transition-all text-sm md:text-base cursor-pointer">
           Start for free with SUCCESS_AI <ArrowRight size={18} />
         </div>
      </div>

      {/* Main Footer (The "Many Words" Section) */}
      <footer className="bg-black pt-20 pb-10 border-t border-white/5">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between mb-16 items-start">
              <div className="mb-10 md:mb-0">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-slate-400 flex items-center justify-center">
                     <Wand2 size={20} className="text-black" />
                  </div>
                  <span className="text-xl font-bold brand-font text-white">SUCCESS_AI</span>
                </div>
                <div className="flex gap-3">
                   <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"><Disc size={18} /></a>
                   <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"><Youtube size={18} /></a>
                   <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"><Twitter size={18} /></a>
                   <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"><Instagram size={18} /></a>
                </div>
              </div>
              
              <div>
                 <button className="px-5 py-2.5 border border-white/20 rounded-full flex items-center gap-2 text-sm text-white hover:bg-white hover:text-black transition-colors">
                   English <ChevronDown size={14} />
                 </button>
              </div>
           </div>

           {/* The Massive Link Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 mb-20">
             {Object.entries(footerLinks).map(([category, links]) => (
               <div key={category}>
                 <h4 className="font-bold mb-6 text-white text-base">{category}</h4>
                 <ul className="space-y-3">
                   {links.map((link, idx) => (
                     <li key={idx}>
                       <span className="text-slate-500 hover:text-white text-sm transition-colors block cursor-pointer">{link}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             ))}
             
             {/* About Section Column */}
             <div>
               <h4 className="font-bold mb-6 text-white text-base">About</h4>
               <ul className="space-y-3">
                 <li><span className="text-slate-500 hover:text-white text-sm transition-colors block cursor-pointer">About us</span></li>
                 <li><span className="text-slate-500 hover:text-white text-sm transition-colors block cursor-pointer">Privacy Policy</span></li>
                 <li><span className="text-slate-500 hover:text-white text-sm transition-colors block cursor-pointer">Terms of Service</span></li>
                 <li><span className="text-slate-500 hover:text-white text-sm transition-colors block cursor-pointer">Pricing</span></li>
               </ul>
             </div>
           </div>

           <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-600 text-sm">
             <p>© 2025 SUCCESS_AI Inc. All rights reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};