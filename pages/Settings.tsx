import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Bell, Lock, Eye, Monitor, Shield, Trash2, Mail, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Manage your account preferences and security.</p>
      </div>

      {/* Account Settings */}
      <Card title="Account Information">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
               <input 
                 type="text" 
                 defaultValue={user?.name} 
                 className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
               <div className="relative">
                  <Mail size={16} className="absolute top-3 left-3 text-slate-500" />
                  <input 
                    type="email" 
                    value={user?.email} 
                    disabled 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-400 cursor-not-allowed"
                  />
               </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="flex items-center gap-2"><Save size={16} /> Save Changes</Button>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card title="Preferences">
        <div className="divide-y divide-slate-700/50">
           <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Bell size={20} /></div>
                 <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-sm text-slate-400">Receive emails about your generation status.</p>
                 </div>
              </div>
              <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
           </div>

           <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Monitor size={20} /></div>
                 <div>
                    <h4 className="text-white font-medium">Marketing Emails</h4>
                    <p className="text-sm text-slate-400">Receive news about new features and prompts.</p>
                 </div>
              </div>
              <Toggle checked={marketingEmails} onChange={setMarketingEmails} />
           </div>

           <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Eye size={20} /></div>
                 <div>
                    <h4 className="text-white font-medium">High Contrast Mode</h4>
                    <p className="text-sm text-slate-400">Increase contrast for better visibility.</p>
                 </div>
              </div>
              <Toggle checked={highContrast} onChange={setHighContrast} />
           </div>
        </div>
      </Card>

      {/* Security */}
      <Card title="Security">
        <div className="space-y-4">
           <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-slate-800 text-slate-300"><Lock size={20} /></div>
                 <div>
                    <h4 className="text-white font-medium">Password</h4>
                    <p className="text-sm text-slate-400">Last changed 3 months ago</p>
                 </div>
              </div>
              <Button variant="secondary" className="text-xs">Change Password</Button>
           </div>

           <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-slate-800 text-slate-300"><Shield size={20} /></div>
                 <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-400">Add an extra layer of security.</p>
                 </div>
              </div>
              <Button variant="secondary" className="text-xs">Enable 2FA</Button>
           </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="border border-red-900/30 bg-red-900/5 rounded-2xl overflow-hidden">
         <div className="px-6 py-4 border-b border-red-900/30 bg-red-900/10">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2"><Trash2 size={18} /> Danger Zone</h3>
         </div>
         <div className="p-6">
            <p className="text-slate-300 mb-4 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="danger">Delete Account</Button>
         </div>
      </div>
    </div>
  );
};

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-violet-600' : 'bg-slate-700'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);