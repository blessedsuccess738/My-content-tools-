import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VideoJob, GenerationStatus, VideoConfig, AspectRatio } from '../types';
import { GENERATION_COST, VIDEO_STYLES, StyleModel } from '../constants';
import { 
  Upload, Wand2, Smartphone, Monitor, Square, 
  Sparkles, RefreshCw, Coins, Zap, CheckCircle, Video, 
  History, X, ChevronRight, Image as ImageIcon, Type, Film,
  SlidersHorizontal, Lock, Play, Pause, Trash2, Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';

type Tab = 'image-to-video' | 'video-to-video' | 'text-to-video';

export const Create: React.FC = () => {
  const { user, refreshUser } = useAuth();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>('image-to-video');
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showTasks, setShowTasks] = useState(false); // Mobile task drawer

  // Configuration State
  const [selectedStyle, setSelectedStyle] = useState<StyleModel>(VIDEO_STYLES[0]);
  const [prompt, setPrompt] = useState('');
  
  // File Inputs
  const [primaryFile, setPrimaryFile] = useState<File | null>(null); // Image for Img2Vid, Video for Vid2Vid
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  
  // Specific for Video-to-Video Motion Transfer
  const [refImageFile, setRefImageFile] = useState<File | null>(null);
  const [refImagePreview, setRefImagePreview] = useState<string | null>(null);
  
  // Settings
  const [duration, setDuration] = useState<number>(5);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [isRelaxMode, setIsRelaxMode] = useState(false);
  const [noWatermark, setNoWatermark] = useState(false);

  // Job State
  const [isGenerating, setIsGenerating] = useState(false); // Button loading state
  const [activeJobs, setActiveJobs] = useState<VideoJob[]>([]);
  const [error, setError] = useState('');
  const [currentCost, setCurrentCost] = useState(GENERATION_COST);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  // Calculate Cost
  useEffect(() => {
    let cost = 15;
    if (duration > 5) cost += 10;
    if (activeTab === 'text-to-video') cost = 7;
    // Vid2Vid is more expensive
    if (activeTab === 'video-to-video') cost += 10;
    setCurrentCost(cost);
  }, [duration, activeTab]);

  // Polling for jobs (Background)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (activeJobs.length === 0) return;
      
      // We only poll jobs that aren't done
      const processingJobs = activeJobs.filter(j => 
        j.status === GenerationStatus.PROCESSING || j.status === GenerationStatus.PENDING
      );

      if (processingJobs.length === 0) return;

      const updatedJobs = [...activeJobs];
      for (const job of processingJobs) {
        try {
           const statusUpdate = await api.checkJobStatus(job.id);
           const index = updatedJobs.findIndex(j => j.id === job.id);
           if (index !== -1) updatedJobs[index] = statusUpdate;
        } catch (e) { console.error(e); }
      }
      setActiveJobs(updatedJobs);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeJobs]);

  const handlePrimaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRefImageFile(file);
      setRefImagePreview(URL.createObjectURL(file));
    }
  };

  const startGeneration = async () => {
    if (!user) return;
    if (user.coins < currentCost) {
      setError(`Insufficient coins. Need ${currentCost}.`);
      return;
    }
    
    // Validation
    if (activeTab === 'image-to-video' && !primaryFile) {
        setError('Please upload an image first.');
        return;
    }
    if (activeTab === 'video-to-video' && !primaryFile) {
        setError('Please upload a source video.');
        return;
    }
    if (activeTab === 'text-to-video' && !prompt.trim()) {
        setError('Please enter a prompt.');
        return;
    }

    setIsGenerating(true); // Button spinner
    setError('');

    const config: VideoConfig = {
        quality: 'medium',
        duration: duration,
        aspectRatio: aspectRatio,
        modelId: 'veo-fast'
    };

    // Style prompt modification
    const finalPrompt = prompt + (selectedStyle ? `, ${selectedStyle.promptModifier}` : '');

    try {
      // API Call
      const newJob = await api.startGeneration(
        user.id, 
        activeTab === 'image-to-video' ? primaryFile : null, 
        'motion-1', // Generic template ID
        config,
        activeTab === 'video-to-video' ? primaryFile : null, // Pass video file as "customMotionFile"
        undefined,
        refImageFile || undefined // Pass reference image for character replacement
      );
      
      // Update UI immediately (non-blocking)
      setActiveJobs(prev => [newJob, ...prev]);
      await refreshUser();
      
      // UX: Show tasks sidebar on desktop, or toast on mobile
      if (window.innerWidth >= 768) {
         // Desktop: Maybe flash the sidebar? 
      } else {
         setShowTasks(true); // Mobile: Open task drawer briefly or rely on badge
      }

      // Optional: Clear inputs? DomoAI usually keeps them to regenerate.
      // We will keep inputs.

    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false); // Stop button spinner
    }
  };

  // --- UI Components ---

  const TabButton = ({ id, label }: { id: Tab, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setPrimaryFile(null); setPrimaryPreview(null); setRefImageFile(null); setRefImagePreview(null); }}
      className={`pb-3 px-1 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
        activeTab === id 
          ? 'border-[#22c55e] text-[#22c55e]' 
          : 'border-transparent text-slate-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const AspectRatioSelector = () => (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white">Ratio</span>
            <span className="text-xs text-slate-500">Auto</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {[
                { id: '1:1', label: '1:1', icon: Square },
                { id: '16:9', label: '16:9', icon: Monitor },
                { id: '9:16', label: '9:16', icon: Smartphone },
            ].map((ratio) => (
                <button
                key={ratio.id}
                onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] font-medium transition-all ${
                    aspectRatio === ratio.id 
                    ? 'bg-[#1a1a1a] border-[#22c55e] text-white' 
                    : 'bg-transparent border-slate-800 text-slate-500 hover:bg-slate-900'
                }`}
                >
                <ratio.icon size={16} className="mb-1" />
                {ratio.label}
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <div className="min-h-[85vh] flex flex-col relative pb-32 md:pb-0">
      
      {/* 1. Header Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md pt-2">
          <div className="flex items-center gap-6 border-b border-slate-800 mb-6 overflow-x-auto no-scrollbar px-1">
            <TabButton id="image-to-video" label="Image to Video" />
            <TabButton id="video-to-video" label="Video to Video" />
            <TabButton id="text-to-video" label="Text to Video" />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Workspace */}
        <div className="flex-1 space-y-6">
            
            {/* Style Selector (DomoAI Style) */}
            <div 
                onClick={() => setShowStyleModal(true)}
                className="bg-[#0f0f0f] border border-slate-800 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 group-hover:border-[#22c55e] transition-colors">
                        <img src={selectedStyle.thumbnail} alt="Style" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">{selectedStyle.name}</h3>
                            <span className="text-[10px] bg-[#22c55e]/10 text-[#22c55e] px-1.5 py-0.5 rounded font-bold border border-[#22c55e]/20">V6 Model</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{selectedStyle.description}</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-slate-500 group-hover:text-white" />
            </div>

            {/* MAIN CANVAS AREA */}
            <div className="relative">
                {/* Main Upload Box */}
                <div className="aspect-[4/3] md:aspect-[16/9] bg-[#0a0a0a] rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
                    {primaryPreview ? (
                        <>
                            {activeTab === 'video-to-video' ? (
                                <video src={primaryPreview} className="w-full h-full object-contain" autoPlay muted loop />
                            ) : (
                                <img src={primaryPreview} alt="Preview" className="w-full h-full object-contain" />
                            )}
                            <button 
                                onClick={() => { setPrimaryPreview(null); setPrimaryFile(null); }}
                                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition-colors z-10"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    ) : (
                        activeTab === 'text-to-video' ? (
                             <div className="w-full h-full p-6 relative">
                                 <textarea 
                                    className="w-full h-full bg-transparent text-white text-xl placeholder:text-slate-700 outline-none resize-none font-light"
                                    placeholder="Describe the video you want. Clear details make the result better."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                 />
                                 <div className="absolute bottom-6 left-6 flex gap-2">
                                    <button className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1 hover:text-white hover:border-slate-600 transition-colors">
                                        <Sparkles size={12} className="text-[#22c55e]" /> AI optimize
                                    </button>
                                 </div>
                             </div>
                        ) : (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-900/30 transition-colors"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-4 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all">
                                    {activeTab === 'video-to-video' ? <Video size={28} /> : <ImageIcon size={28} />}
                                </div>
                                <span className="font-bold text-slate-200 mb-1">Click to Upload {activeTab === 'image-to-video' ? 'Image' : 'Video'}</span>
                                <p className="text-xs text-slate-600">Supports JPG, PNG, MP4</p>
                            </div>
                        )
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept={activeTab === 'video-to-video' ? "video/*" : "image/*"}
                        onChange={handlePrimaryUpload}
                    />
                </div>

                {/* SPECIAL FEATURE: Reference Image for Video-to-Video (Character Replacement) */}
                {activeTab === 'video-to-video' && (
                    <div className="mt-4 animate-in slide-in-from-bottom-2 fade-in">
                        <div className="flex items-center justify-between mb-2">
                           <label className="text-sm font-bold text-white flex items-center gap-2">
                              <ImageIcon size={14} className="text-[#22c55e]" /> 
                              Character Reference
                           </label>
                           <span className="text-[10px] text-slate-500 uppercase tracking-wider">Optional</span>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                            <div 
                                onClick={() => refInputRef.current?.click()}
                                className="w-24 h-32 rounded-lg border border-dashed border-slate-700 bg-[#0f0f0f] flex flex-col items-center justify-center cursor-pointer hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 transition-all relative overflow-hidden"
                            >
                                {refImagePreview ? (
                                    <>
                                        <img src={refImagePreview} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <RefreshCw size={16} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} className="text-slate-500 mb-1" />
                                        <span className="text-[10px] text-slate-500">Add Image</span>
                                    </>
                                )}
                                <input type="file" ref={refInputRef} className="hidden" accept="image/*" onChange={handleRefImageUpload} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Upload an image of a person to replace the character in the video while keeping the original motion.
                                    <br/><span className="text-slate-600">Best results with full-body shots on clear backgrounds.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Prompt Input for Image/Video modes */}
            {activeTab !== 'text-to-video' && (
                <div className="bg-[#0f0f0f] border border-slate-800 rounded-xl p-4">
                    <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">Prompt</label>
                    <textarea 
                        className="w-full bg-transparent text-white text-sm placeholder:text-slate-600 outline-none resize-none h-12"
                        placeholder={activeTab === 'video-to-video' ? "Describe the new style (e.g. Japanese anime girl dancing)" : "Describe the motion (e.g. Camera zooms in, character smiles)"}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
            )}

            {error && <div className="p-3 bg-red-500/10 text-red-400 text-xs text-center rounded-lg border border-red-500/20">{error}</div>}
        </div>

        {/* RIGHT COLUMN: Settings Panel */}
        <div className="w-full lg:w-80 space-y-6">
            <div className="bg-[#0f0f0f] rounded-xl border border-slate-800 p-5 space-y-6">
                
                {/* Duration */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-white">Duration</span>
                         <span className="text-xs text-slate-500 flex items-center gap-1"><History size={10} /> {duration}s</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[3, 5, 10].map(d => (
                            <button 
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all ${duration === d ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]' : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'}`}
                            >
                                {d}s
                            </button>
                        ))}
                    </div>
                </div>

                <AspectRatioSelector />

                {/* Toggles */}
                <div className="space-y-4 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                           <span className="text-sm">Relax Mode</span>
                           <Lock size={12} className="opacity-50" />
                        </div>
                        <div className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${isRelaxMode ? 'bg-[#22c55e]' : 'bg-slate-700'}`} onClick={() => setIsRelaxMode(!isRelaxMode)}>
                           <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isRelaxMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                           <span className="text-sm">No Watermark</span>
                           <Lock size={12} className="opacity-50" />
                        </div>
                         <div className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${noWatermark ? 'bg-[#22c55e]' : 'bg-slate-700'}`} onClick={() => setNoWatermark(!noWatermark)}>
                           <div className={`w-3 h-3 bg-white rounded-full transition-transform ${noWatermark ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Active Tasks List (Persistent) */}
            <div className="hidden lg:block bg-[#0f0f0f] rounded-xl border border-slate-800 p-4 min-h-[200px]">
                 <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2"><History size={14} /> Task History</h3>
                     <span className="text-xs text-slate-500">{activeJobs.length} tasks</span>
                 </div>
                 
                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                     {activeJobs.length === 0 ? (
                         <div className="text-center py-8 text-slate-600 text-xs">No active tasks</div>
                     ) : (
                         activeJobs.map(job => (
                             <div key={job.id} className="flex gap-3 items-start group relative">
                                 <div className="w-12 h-16 bg-slate-900 rounded border border-slate-800 overflow-hidden shrink-0">
                                     {job.status === GenerationStatus.COMPLETED ? (
                                         <video src={job.outputVideoUrl} className="w-full h-full object-cover" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center">
                                             <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin"></div>
                                         </div>
                                     )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <div className="flex justify-between items-start">
                                         <span className="text-xs font-bold text-white truncate block">Video Generation</span>
                                         <span className="text-[10px] text-slate-500">{new Date(job.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                     </div>
                                     <div className="mt-1">
                                         {job.status === GenerationStatus.COMPLETED ? (
                                             <span className="text-[10px] text-[#22c55e] flex items-center gap-1"><CheckCircle size={10} /> Completed</span>
                                         ) : job.status === GenerationStatus.FAILED ? (
                                             <span className="text-[10px] text-red-500">Failed</span>
                                         ) : (
                                             <div className="w-full bg-slate-800 h-1 rounded-full mt-1">
                                                 <div className="bg-[#22c55e] h-full rounded-full transition-all duration-500" style={{width: `${job.progress}%`}}></div>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
            </div>
        </div>

      </div>

      {/* FIXED BOTTOM BAR (Canvas UI) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-white/5 lg:relative lg:bg-transparent lg:border-0 lg:p-0 lg:mt-8 z-30">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
             {/* Mobile: Task Drawer Toggle */}
             <button 
                onClick={() => setShowTasks(!showTasks)}
                className="lg:hidden w-12 h-12 rounded-full bg-[#1e1e1e] flex items-center justify-center text-white border border-slate-700 hover:bg-slate-700 relative"
             >
                 <History size={20} />
                 {activeJobs.some(j => j.status === GenerationStatus.PROCESSING) && (
                     <span className="absolute top-0 right-0 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-black"></span>
                 )}
             </button>

             <button className="hidden lg:flex w-12 h-12 rounded-full bg-[#1e1e1e] items-center justify-center text-white border border-slate-700 hover:bg-slate-700">
                 <SlidersHorizontal size={20} />
             </button>
             
             <Button 
                onClick={startGeneration}
                isLoading={isGenerating}
                className="flex-1 h-12 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-base rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGenerating}
             >
                Generate ({currentCost}<Coins size={14} className="inline -mt-0.5 ml-0.5" />)
             </Button>
          </div>
      </div>

      {/* Style Modal */}
      {showStyleModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center">
              <div className="bg-[#111] w-full md:w-[700px] md:rounded-2xl rounded-t-3xl border border-slate-800 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-[#111] z-10 rounded-t-3xl">
                      <h3 className="font-bold text-white">Select Style Model</h3>
                      <button onClick={() => setShowStyleModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                  </div>
                  
                  <div className="p-1 border-b border-slate-800 flex overflow-x-auto no-scrollbar">
                       {['All', 'Popular', 'Anime', 'Realistic', '3D'].map(f => (
                           <button key={f} className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${f === 'All' ? 'text-white border-white' : 'text-slate-500 border-transparent hover:text-white'}`}>{f}</button>
                       ))}
                  </div>

                  <div className="p-5 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 custom-scrollbar">
                      {VIDEO_STYLES.map(style => (
                          <div 
                            key={style.id}
                            onClick={() => { setSelectedStyle(style); setShowStyleModal(false); }}
                            className={`group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedStyle.id === style.id ? 'border-[#22c55e]' : 'border-transparent hover:border-slate-600'}`}
                          >
                              <img src={style.thumbnail} alt={style.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                                  <h4 className="text-white font-bold text-sm leading-tight mb-0.5">{style.name}</h4>
                                  <p className="text-[10px] text-slate-400 line-clamp-1">{style.description}</p>
                              </div>
                              {selectedStyle.id === style.id && (
                                  <div className="absolute top-2 right-2 bg-[#22c55e] rounded-full p-1 text-black shadow-lg">
                                      <CheckCircle size={14} fill="currentColor" />
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Mobile Task Drawer */}
      {showTasks && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowTasks(false)}>
              <div className="absolute bottom-0 left-0 right-0 bg-[#111] rounded-t-3xl p-5 max-h-[60vh] overflow-y-auto border-t border-slate-800 animate-in slide-in-from-bottom-10 duration-300" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-white flex items-center gap-2"><History size={18} /> Task History</h3>
                      <button onClick={() => setShowTasks(false)}><X size={20} className="text-slate-400" /></button>
                  </div>
                  <div className="space-y-4">
                     {activeJobs.map(job => (
                         <div key={job.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 flex gap-3">
                             <div className="w-16 h-20 bg-black rounded-lg overflow-hidden shrink-0 border border-slate-800">
                                {job.status === GenerationStatus.COMPLETED ? (
                                    <video src={job.outputVideoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                             </div>
                             <div className="flex-1">
                                 <div className="flex justify-between">
                                     <span className="text-sm font-bold text-white">Generation</span>
                                     <span className="text-xs text-slate-500">{job.progress}%</span>
                                 </div>
                                 <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 mb-2">
                                     <div className="bg-[#22c55e] h-full rounded-full transition-all" style={{width: `${job.progress}%`}}></div>
                                 </div>
                                 {job.status === GenerationStatus.COMPLETED && (
                                     <a href={job.outputVideoUrl} target="_blank" rel="noreferrer" className="text-xs text-[#22c55e] hover:underline">Download Video</a>
                                 )}
                             </div>
                         </div>
                     ))}
                     {activeJobs.length === 0 && <p className="text-slate-500 text-center py-4">No recent tasks</p>}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};