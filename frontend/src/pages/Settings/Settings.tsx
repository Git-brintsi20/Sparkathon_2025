import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { ThemeSettings } from './ThemeSettings';
import { 
  Settings as  
  User, 
  Bell, 
  Database, 
  Mail, 
  Globe, 
  Smartphone,
  Save,
  RotateCcw
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  deliveryAlerts: boolean;
  complianceAlerts: boolean;
  systemUpdates: boolean;
}

interface SystemSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  autoSave: boolean;
  dataRetention: number;
}

 const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    deliveryAlerts: true,
    complianceAlerts: true,
    systemUpdates: false
  });
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    autoSave: true,
    dataRetention: 365
  });

  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Compliance Officer',
    department: 'Supply Chain',
    phone: '+1 (555) 123-4567'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      sms: false,
      push: true,
      deliveryAlerts: true,
      complianceAlerts: true,
      systemUpdates: false
    });
    setSystemSettings({
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      autoSave: true,
      dataRetention: 365
    });
  };

  const ProfileSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={userProfile.name}
            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Role
          </label>
          <select
            value={userProfile.role}
            onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Compliance Officer">Compliance Officer</option>
            <option value="Supply Chain Manager">Supply Chain Manager</option>
            <option value="Procurement Manager">Procurement Manager</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Department
          </label>
          <input
            type="text"
            value={userProfile.department}
            onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={userProfile.phone}
            onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </motion.div>
  );

  const NotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Notification Channels</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <Smartphone className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">SMS</p>
              <p className="text-sm text-muted-foreground">Receive text messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <Bell className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Push</p>
              <p className="text-sm text-muted-foreground">Browser notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Alert Types</h3>
        
        <div className="space-y-3">
          {[
            { key: 'deliveryAlerts', label: 'Delivery Alerts', description: 'Notifications for delivery updates and issues' },
            { key: 'complianceAlerts', label: 'Compliance Alerts', description: 'Critical compliance violations and warnings' },
            { key: 'systemUpdates', label: 'System Updates', description: 'Application updates and maintenance notices' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof NotificationSettings] as boolean}
                  onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const SystemConfiguration = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Language
          </label>
          <select
            value={systemSettings.language}
            onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Timezone
          </label>
          <select
            value={systemSettings.timezone}
            onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="GMT">Greenwich Mean Time</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date Format
          </label>
          <select
            value={systemSettings.dateFormat}
            onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Currency
          </label>
          <select
            value={systemSettings.currency}
            onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Data Retention (days)
          </label>
          <input
            type="number"
            value={systemSettings.dataRetention}
            onChange={(e) => setSystemSettings({...systemSettings, dataRetention: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={systemSettings.autoSave}
              onChange={(e) => setSystemSettings({...systemSettings, autoSave: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <div>
            <p className="font-medium text-foreground">Auto-save</p>
            <p className="text-sm text-muted-foreground">Automatically save changes</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const sections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'User Profile',
      icon: <User className="w-5 h-5" />,
      component: <ProfileSettings />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      component: <NotificationSettings />
    },
    {
      id: 'system',
      title: 'System',
      icon: <Database className="w-5 h-5" />,
      component: <SystemConfiguration />
    },
    {
      id: 'theme',
      title: 'Theme & Appearance',
      icon: <Globe className="w-5 h-5" />,
      component: <ThemeSettings />
    }
  ];

  return (
    <Layout
      pageTitle="Settings"
      pageDescription="Configure your account, notifications, and system preferences"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', isActive: true }
      ]}
    >
      <div className="flex h-full bg-background">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h1>
                  <p className="text-muted-foreground">
                    Configure your preferences and system settings
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleResetSettings}
                    className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                {sections.find(s => s.id === activeSection)?.component}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Settings;