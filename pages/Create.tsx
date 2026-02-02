import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import { DanceMotion, VideoJob, GenerationStatus, VideoConfig, VideoQuality, AspectRatio } from '../types';
import { MOTION_TEMPLATES, GENERATION_COST } from '../constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Upload, Wand2, ArrowRight, PlayCircle, Clock, Smartphone, Monitor, Square } from 'lucide-react';

const steps = ['Upload Image', 'Select Motion', 'Configure', 'Generate'];

export const Create: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Data State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [selectedMotion, setSelectedMotion] = useState<DanceMotion | null>(null);
  const [customMotionFile, setCustomMotionFile] = useState<File | null>(null);
  const [customMotionPreview, setCustomMotionPreview] = useState<string | null>(null);

  const [config, setConfig] = useState<VideoConfig>({
    quality: 'medium',
    duration: 8,
    aspectRatio: '9:16'
  });

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [job, setJob] = useState<VideoJob | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Polling for job status
  useEffect(() => {
    let interval: any;
    if (job && job.status === GenerationStatus.PROCESSING) {
      interval = setInterval(async () => {
        try {
          const updatedJob = await mockApi.checkJobStatus(job.id);
          setJob(updatedJob);
          if (updatedJob.status === GenerationStatus.COMPLETED) {
            clearInterval(interval);
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [job]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const startGeneration = async () => {
    if (!user || !selectedMotion) return;
    if (user.coins < GENERATION_COST) {
      setError('Insufficient coins to generate video.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const newJob = await mockApi.startGeneration(
        user.id, 
        selectedImage, 
        selectedMotion.id,
        config,
        customMotionFile
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
        {/* STEP 1: UPLOAD */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Upload Reference Image</h2>
            <p className="text-slate-400 mb-6">Choose a full-body image of a character or person. Clear backgrounds work best.</p>
            
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                previewUrl ? 'border-violet-500 bg-violet-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />

              {previewUrl ? (
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="max-h-96 rounded-lg shadow-2xl" />
                  <button 
                    onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-lg hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Click to upload or drag & drop</h3>
                  <p className="text-sm text-slate-500">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                disabled={!selectedImage} 
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
                     </button>
                   ))}
                 </div>
                 <p className="text-xs text-slate-500 mt-2">Higher quality takes longer and consumes more resources.</p>
               </div>

               {/* Duration */}
               <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Duration</label>
                    <span className="text-sm font-bold text-violet-400">{config.duration} seconds</span>
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
                  {GENERATION_COST} <span className="text-sm font-normal text-slate-400">Coins</span>
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
                 <h2 className="text-2xl font-bold mb-2 animate-pulse">Synthesizing Motion...</h2>
                 <p className="text-slate-400 mb-8">AI is extracting pose data and rendering frames. This usually takes about 30-60 seconds.</p>
                 
                 <div className="bg-slate-800 rounded-lg p-4 text-left text-sm font-mono text-slate-400 space-y-2">
                   <p className={job?.progress! > 10 ? 'text-green-400' : ''}>[OK] Initializing pipeline ({job?.config?.quality} quality)...</p>
                   <p className={job?.progress! > 30 ? 'text-green-400' : ''}>[OK] Extracting skeletal rig from reference...</p>
                   <p className={job?.progress! > 50 ? 'text-green-400' : ''}>{job?.progress! > 50 ? '[OK]' : '[..]'} Applying ControlNet to {job?.config?.aspectRatio} canvas...</p>
                   <p className={job?.progress! > 80 ? 'text-green-400' : ''}>{job?.progress! > 80 ? '[OK]' : '[..]'} Stitching {job?.config?.duration}s video...</p>
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
                    <Button onClick={() => { setJob(null); setCurrentStep(0); setSelectedImage(null); setPreviewUrl(null); }}>
                      Create Another
                    </Button>
                    <a href={job.outputVideoUrl} download>
                      <Button variant="secondary">
                        Download MP4
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