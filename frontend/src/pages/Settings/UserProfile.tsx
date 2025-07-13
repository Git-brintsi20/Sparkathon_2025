import React, { useState, useEffect } from 'react'; // Added useEffect
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User, Shield, Camera, Save, Edit3 } from 'lucide-react';
// ADDED: Import the useLayout hook
import { useLayout } from '@/contexts/LayoutContext';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    emailAlerts: boolean;
    darkMode: boolean;
    language: string;
  };
}

const UserProfile: React.FC = () => {
  // ADDED: Call the useLayout hook
  const { setLayoutData } = useLayout();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [userData, setUserData] = useState<UserProfileData>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    role: 'Compliance Manager',
    avatar: 'https://placehold.co/150x150/E0E0E0/616161?text=JD', // Placeholder image
    preferences: {
      notifications: true,
      emailAlerts: true,
      darkMode: false,
      language: 'en'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setUserData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsLoading(false);
    // In a real app, you might show a toast notification here
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Replaced alert with console.error as per instructions
      console.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
    setIsLoading(false);
    // In a real app, you might show a toast notification here
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Define breadcrumbs and header actions for the layout context
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'User Profile', isActive: true }
  ];

  const headerActions = (
    <Button
      onClick={() => setIsEditing(!isEditing)}
      variant={isEditing ? "outline" : "default"}
      className="gap-2"
    >
      <Edit3 size={16} />
      {isEditing ? 'Cancel' : 'Edit Profile'}
    </Button>
  );

  // ADDED: useEffect hook to set and clear layout data
  useEffect(() => {
    setLayoutData({
      pageTitle: "User Profile",
      pageDescription: "Manage your account settings and preferences",
      breadcrumbs: breadcrumbs,
      headerActions: headerActions
    });

    // Return a cleanup function
    return () => setLayoutData({});
  }, [setLayoutData, isEditing]); // Added isEditing to dependencies for headerActions to update correctly

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* REMOVED: The header section (h1, p, and Edit button) */}
        {/* Profile Information */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera size={14} />
                  </Button>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <Input
                      value={userData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={16} />
                  <span>Role: {userData.role}</span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-2">
                <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                  <Save size={16} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Password Section */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                Change Password
              </Button>
            </div>

            {showPasswordForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePasswordUpdate} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for important updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userData.preferences.emailAlerts}
                  onChange={(e) => handlePreferenceChange('emailAlerts', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Push Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive push notifications in your browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userData.preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-500">
                    Enable dark mode for better viewing in low light
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userData.preferences.darkMode}
                  onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <p className="text-sm text-gray-500">
                    Choose your preferred language
                  </p>
                </div>
                <select
                  value={userData.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="rounded-md border-gray-300 text-sm focus:border-primary focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
