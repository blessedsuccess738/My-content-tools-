import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DanceMotion, VideoJob, GenerationStatus, VideoConfig, VideoQuality, AspectRatio } from '../types';
import { MOTION_TEMPLATES, GENERATION_COST } from '../constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Upload, Wand2, ArrowRight, PlayCircle, Clock, Smartphone, Monitor, Square, Sparkles, RefreshCw, Coins } from 'lucide-react';

const steps = ['Input Character', 'Select Motion', 'Configure', 'Generate'];

export const Create: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Data State
  const [inputType, setInputType] = useState<'upload' | 'ai'>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [selectedMotion, setSelectedMotion] = useState<DanceMotion | null>(null);
  const [customMotionFile, setCustomMotionFile] = useState<File | null>(null);
  const [customMotionPreview, setCustomMotionPreview] = useState<string | null>(null);

  const [config, setConfig] = useState<VideoConfig>({
    quality: 'medium',
    duration: 8,
    aspectRatio: '9:16'
  });

  const [currentCost, setCurrentCost] = useState(GENERATION_COST);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [job, setJob] = useState<VideoJob | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Calculate Dynamic Cost
  useEffect(() => {
    let cost = GENERATION_COST;
    // Add 30% for High Quality
    if (config.quality === 'high') {
      cost += Math.ceil(GENERATION_COST * 0.3);
    }
    // Add 30% for Duration > 10s
    if (config.duration > 10) {
      cost += Math.ceil(GENERATION_COST * 0.3);
    }
    setCurrentCost(cost);
  }, [config]);

  // Polling for job status
  useEffect(() => {
    let interval: any;
    if (job && job.status === GenerationStatus.PROCESSING) {
      interval = setInterval(async () => {
        try {
          const updatedJob = await api.checkJobStatus(job.id);
          setJob(updatedJob);
          if (updatedJob.status === GenerationStatus.COMPLETED || updatedJob.status === GenerationStatus.FAILED) {
            clearInterval(interval);
          }
        } catch (e) {
          console.error(e);
        }
      }, 5000); // Poll every 5 seconds for real API
    }
    return () => clearInterval(interval);
  }, [job]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAiGeneratedImageUrl(null);
      setError('');
    }
  };

  const handleGenerateAIImage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingImage(true);
    setError('');
    try {
      const url = await api.generateAIImage(aiPrompt);
      setAiGeneratedImageUrl(url);
      setPreviewUrl(url);
      setSelectedImage(null);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please check API Key.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCustomMotionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setCustomMotionFile(file);
      setCustomMotionPreview(URL.createObjectURL(file));
      setSelectedMotion({
        id: 'custom',
        name: 'Custom Upload',
        category: 'Custom',
        thumbnailUrl: '',
        duration: 0
      });
      setError('');
    }
  };

  const startGeneration = async () => {
    if (!user || !selectedMotion) return;
    if (user.coins < currentCost) {
      setError(`Insufficient coins. You need ${currentCost} coins.`);
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const newJob = await api.startGeneration(
        user.id, 
        selectedImage, 
        selectedMotion.id,
        config,
        customMotionFile,
        aiGeneratedImageUrl || undefined
      );
      setJob(newJob);
      await refreshUser(); // Update coin balance in UI
      setCurrentStep(3); // Wait screen
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
        {steps.map((step, idx) => (
          <div key={idx} className={`flex items-center gap-2 bg-slate-900 px-2 ${idx <= currentStep ? 'text-violet-400' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${idx <= currentStep ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-800'}`}>
              {idx + 1}
            </div>
            <span className="hidden md:block font-medium">{step}</span>
          </div>
        ))}
      </div>

      <div className="min-h-[500px]">
        {/* STEP 1: INPUT */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Input Character</h2>
            <p className="text-slate-400 mb-6">Upload a photo or generate a unique character with AI.</p>
            
            {/* Input Type Tabs */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setInputType('upload')}
                className={`flex-1 py-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${inputType === 'upload' ? 'border-violet-500 bg-violet-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'}`}
              >
                <Upload size={20} /> Upload Photo
              </button>
              <button 
                onClick={() => setInputType('ai')}
                className={`flex-1 py-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${inputType === 'ai' ? 'border-violet-500 bg-violet-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'}`}
              >
                <Sparkles size={20} /> Generate with AI
              </button>
            </div>

            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all min-h-[400px] flex flex-col items-center justify-center ${
                previewUrl ? 'border-violet-500/50 bg-violet-500/5' : 'border-slate-700 bg-slate-900/50'
              }`}>
              
              {inputType === 'upload' ? (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  {previewUrl ? (
                    <div className="relative inline-block animate-in zoom-in duration-300">
                      <img src={previewUrl} alt="Preview" className="max-h-80 rounded-lg shadow-2xl border border-white/10" />
                      <button 
                        onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                        className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1.5 text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                      >
                        <Upload size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 shadow-xl border border-slate-700">
                        <Upload size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Click to Upload</h3>
                      <p className="text-slate-400">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full max-w-md">
                   {previewUrl ? (
                      <div className="relative inline-block animate-in zoom-in duration-300 mb-6">
                        <img src={previewUrl} alt="AI Generated" className="max-h-80 rounded-lg shadow-2xl border border-white/10" />
                        <button 
                          onClick={() => { setPreviewUrl(null); setAiGeneratedImageUrl(null); }}
                          className="absolute -top-3 -right-3 bg-slate-700 rounded-full p-2 text-white shadow-lg hover:bg-slate-600 border border-slate-500"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                   ) : (
                     <div className="flex flex-col items-center w-full">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                           <Wand2 size={32} className="text-white" />
                        </div>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Describe a character... e.g. A futuristic robot dancer with neon blue lights, dark alley background"
                          className="w-full h-32 bg-black/40 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none mb-4 transition-all"
                        />
                        <Button 
                          onClick={handleGenerateAIImage} 
                          disabled={!aiPrompt.trim()} 
                          isLoading={isGeneratingImage}
                          className="w-full py-3"
                        >
                          Generate Character
                        </Button>
                     </div>
                   )}
                </div>
              )}
            </div>

            {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-center text-sm">{error}</div>}

            <div className="mt-6 flex justify-end">
              <Button 
                disabled={!previewUrl} 
                onClick={() => setCurrentStep(1)}
              >
                Next Step <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: MOTION */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Select Dance Motion</h2>
            <p className="text-slate-400 mb-6">Choose a choreography style or upload your own reference video.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Custom Upload Card */}
              <div 
                onClick={() => videoInputRef.current?.click()}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center bg-slate-800/50 p-6 min-h-[12rem] relative group transition-all ${
                   selectedMotion?.id === 'custom' ? 'border-violet-500 ring-2 ring-violet-500/50' : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                 <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={videoInputRef} 
                  onChange={handleCustomMotionUpload} 
                 />
                 
                 {customMotionPreview ? (
                    <video src={customMotionPreview} className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay />
                 ) : (
                   <>
                     <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-4 text-slate-400 group-hover:text-white group-hover:bg-slate-600 transition-colors">
                       <Upload size={24} />
                     </div>
                     <span className="font-bold text-slate-300">Upload Custom</span>
                     <span className="text-xs text-slate-500 mt-1">MP4, MOV up to 30s</span>
                   </>
                 )}
                 {selectedMotion?.id === 'custom' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                       <span className="text-white font-bold flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Selected</span>
                    </div>
                 )}
              </div>

              {/* Template Cards */}
              {MOTION_TEMPLATES.map((motion) => (
                <div 
                  key={motion.id}
                  onClick={() => {
                    setSelectedMotion(motion);
                    setCustomMotionFile(null);
                    setCustomMotionPreview(null);
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative group ${
                    selectedMotion?.id === motion.id ? 'border-violet-500 ring-2 ring-violet-500/50' : 'border-transparent hover:border-slate-600'
                  }`}
                >
                  <img src={motion.thumbnailUrl} alt={motion.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">{motion.category}</span>
                        <h4 className="text-white font-bold">{motion.name}</h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <PlayCircle size={16} fill="currentColor" className="text-white/80" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {motion.duration}s
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
              <Button variant="secondary" onClick={() => setCurrentStep(0)}>Back</Button>
              <Button 
                disabled={!selectedMotion} 
                onClick={() => setCurrentStep(2)}
              >
                Configure Settings <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIGURE */}
        {currentStep === 2 && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold mb-2">Video Settings</h2>
             <p className="text-slate-400 mb-8">Fine-tune your generation output.</p>

             <Card className="space-y-8">
               {/* Aspect Ratio */}
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-3">Aspect Ratio</label>
                 <div className="grid grid-cols-3 gap-4">
                   {[
                     { id: '9:16', label: 'Story', icon: Smartphone },
                     { id: '16:9', label: 'Landscape', icon: Monitor },
                     { id: '1:1', label: 'Square', icon: Square }
                   ].map((ratio) => (
                     <button
                       key={ratio.id}
                       onClick={() => setConfig({...config, aspectRatio: ratio.id as AspectRatio})}
                       className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                         config.aspectRatio === ratio.id 
                           ? 'border-violet-500 bg-violet-500/10 text-white' 
                           : 'border-slate-700 hover:border-slate-600 text-slate-400'
                       }`}
                     >
                       <ratio.icon size={24} className="mb-2" />
                       <span className="text-sm font-medium">{ratio.label}</span>
                       <span className="text-xs opacity-60">{ratio.id}</span>
                     </button>
                   ))}
                 </div>
               </div>

               {/* Quality */}
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-3">Generation Quality</label>
                 <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1 rounded-lg">
                   {['low', 'medium', 'high'].map((q) => (
                     <button
                       key={q}
                       onClick={() => setConfig({...config, quality: q as VideoQuality})}
                       className={`py-2 px-4 rounded-md text-sm font-medium capitalize transition-all ${
                         config.quality === q
                           ? 'bg-slate-700 text-white shadow-sm'
                           : 'text-slate-400 hover:text-slate-200'
                       }`}
                     >
                       {q}
                       {q === 'high' && <span className="ml-1 text-[10px] text-yellow-500 font-bold">+30%</span>}
                     </button>
                   ))}
                 </div>
                 <p className="text-xs text-slate-500 mt-2">Higher quality takes longer and consumes more resources.</p>
               </div>

               {/* Duration */}
               <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Duration</label>
                    <div className="text-right">
                       <span className="text-sm font-bold text-violet-400 block">{config.duration} seconds</span>
                       {config.duration > 10 && <span className="text-[10px] text-yellow-500 font-bold">+30% Cost</span>}
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="15" 
                    step="1"
                    value={config.duration}
                    onChange={(e) => setConfig({...config, duration: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>5s</span>
                    <span>15s</span>
                  </div>
               </div>
             </Card>

             <div className="flex justify-between items-center mt-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div>
                <span className="text-slate-400 text-sm">Estimated Cost</span>
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
                  <Coins size={20} />
                  {currentCost} <span className="text-sm font-normal text-slate-400">Coins</span>
                </div>
              </div>
              <div className="flex gap-4">
                 <Button variant="secondary" onClick={() => setCurrentStep(1)}>Back</Button>
                 <Button 
                   onClick={startGeneration}
                   isLoading={isGenerating}
                 >
                   <Wand2 size={18} /> Generate Video
                 </Button>
              </div>
            </div>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
           </div>
        )}

        {/* STEP 4: PROCESSING / RESULT */}
        {(currentStep === 3 || job) && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-12">
             {job?.status !== GenerationStatus.COMPLETED ? (
               <div className="text-center w-full max-w-md">
                 <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold font-mono">{job?.progress}%</span>
                    </div>
                 </div>
                 <h2 className="text-2xl font-bold mb-2 animate-pulse">Generating with Gemini Veo...</h2>
                 <p className="text-slate-400 mb-8">AI is rendering the video. This can take a minute...</p>
                 
                 <div className="bg-slate-800 rounded-lg p-4 text-left text-sm font-mono text-slate-400 space-y-2">
                   <p className={job?.progress! > 10 ? 'text-green-400' : ''}>[OK] Initializing Veo model...</p>
                   <p className={job?.progress! > 30 ? 'text-green-400' : ''}>{job?.progress! > 30 ? '[OK]' : '[..]'} Processing input character...</p>
                   <p className={job?.progress! > 50 ? 'text-green-400' : ''}>{job?.progress! > 50 ? '[OK]' : '[..]'} Synthesizing {job?.config?.duration}s motion...</p>
                   <p className={job?.progress! > 90 ? 'text-green-400' : ''}>{job?.progress! > 90 ? '[OK]' : '[..]'} Finalizing render...</p>
                 </div>
               </div>
             ) : (
               <div className="w-full max-w-2xl text-center">
                  <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Generation Complete!
                  </div>
                  
                  <div className="relative aspect-[9/16] md:aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 mb-8">
                     <video 
                       src={job.outputVideoUrl} 
                       controls 
                       autoPlay 
                       loop 
                       className="w-full h-full object-contain"
                     ></video>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => { setJob(null); setCurrentStep(0); setSelectedImage(null); setPreviewUrl(null); setAiGeneratedImageUrl(null); }}>
                      Create Another
                    </Button>
                    <a href={job.outputVideoUrl} download target="_blank" rel="noreferrer">
                      <Button variant="secondary">
                        Download Video
                      </Button>
                    </a>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};