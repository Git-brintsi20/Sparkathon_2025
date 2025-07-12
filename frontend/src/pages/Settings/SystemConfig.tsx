import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/components/lib/utils';

interface SystemConfigProps {
  className?: string;
}

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  settings: ConfigSetting[];
}

interface ConfigSetting {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  value: string | number | boolean;
  options?: { value: string; label: string; }[];
  description?: string;
  required?: boolean;
}

const SystemConfig: React.FC<SystemConfigProps> = ({ className }) => {
  const [configs, setConfigs] = useState<ConfigSection[]>([
    {
      id: 'api',
      title: 'API Configuration',
      description: 'Configure API endpoints and authentication settings',
      settings: [
        {
          id: 'apiBaseUrl',
          label: 'API Base URL',
          type: 'text',
          value: 'https://api.smartvendor.com',
          description: 'Base URL for all API calls',
          required: true
        },
        {
          id: 'apiTimeout',
          label: 'API Timeout (seconds)',
          type: 'number',
          value: 30,
          description: 'Request timeout in seconds'
        },
        {
          id: 'apiRetryCount',
          label: 'Retry Count',
          type: 'number',
          value: 3,
          description: 'Number of retries for failed requests'
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance Settings',
      description: 'Configure compliance thresholds and monitoring',
      settings: [
        {
          id: 'complianceThreshold',
          label: 'Compliance Threshold (%)',
          type: 'number',
          value: 85,
          description: 'Minimum compliance percentage required'
        },
        {
          id: 'alertThreshold',
          label: 'Alert Threshold (%)',
          type: 'number',
          value: 70,
          description: 'Threshold for compliance alerts'
        },
        {
          id: 'autoVerification',
          label: 'Auto Verification',
          type: 'boolean',
          value: true,
          description: 'Enable automatic verification for trusted vendors'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Configure system notifications and alerts',
      settings: [
        {
          id: 'emailNotifications',
          label: 'Email Notifications',
          type: 'boolean',
          value: true,
          description: 'Enable email notifications'
        },
        {
          id: 'smsNotifications',
          label: 'SMS Notifications',
          type: 'boolean',
          value: false,
          description: 'Enable SMS notifications'
        },
        {
          id: 'notificationFrequency',
          label: 'Notification Frequency',
          type: 'select',
          value: 'daily',
          options: [
            { value: 'immediate', label: 'Immediate' },
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' }
          ],
          description: 'How often to send digest notifications'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Configure security and authentication parameters',
      settings: [
        {
          id: 'sessionTimeout',
          label: 'Session Timeout (minutes)',
          type: 'number',
          value: 60,
          description: 'User session timeout in minutes'
        },
        {
          id: 'passwordExpiry',
          label: 'Password Expiry (days)',
          type: 'number',
          value: 90,
          description: 'Days until password expires'
        },
        {
          id: 'requireTwoFactor',
          label: 'Require Two-Factor Authentication',
          type: 'boolean',
          value: false,
          description: 'Require 2FA for all users'
        }
      ]
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateSetting = (sectionId: string, settingId: string, value: string | number | boolean) => {
    setConfigs(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            settings: section.settings.map(setting =>
              setting.id === settingId ? { ...setting, value } : setting
            )
          }
        : section
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasChanges(false);
      console.log('Configuration saved:', configs);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    setConfigs(prev => prev.map(section => ({
      ...section,
      settings: section.settings.map(setting => ({
        ...setting,
        value: getDefaultValue(setting.type)
      }))
    })));
    setHasChanges(true);
  };

  const getDefaultValue = (type: string): string | number | boolean => {
    switch (type) {
      case 'text': return '';
      case 'number': return 0;
      case 'boolean': return false;
      default: return '';
    }
  };

  const renderSetting = (sectionId: string, setting: ConfigSetting) => {
    const commonProps = {
      id: setting.id,
      required: setting.required
    };

    switch (setting.type) {
      case 'text':
        return (
          <Input
            {...commonProps}
            type="text"
            value={setting.value as string}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            placeholder={setting.label}
          />
        );
      
      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={setting.value as number}
            onChange={(e) => updateSetting(sectionId, setting.id, parseInt(e.target.value) || 0)}
            placeholder={setting.label}
          />
        );
      
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              {...commonProps}
              type="checkbox"
              checked={setting.value as boolean}
              onChange={(e) => updateSetting(sectionId, setting.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
            <span className="text-sm text-gray-600">Enable</span>
          </div>
        );
      
      case 'select':
        return (
          <select
            {...commonProps}
            value={setting.value as string}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-gray-600 mt-1">Configure system settings and parameters</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || loading}
            className="min-w-[120px]"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid gap-6">
        {configs.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {section.title}
                <span className="text-sm font-normal text-gray-500">
                  {section.settings.length} settings
                </span>
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={setting.id}
                        className="text-sm font-medium text-gray-700"
                      >
                        {setting.label}
                        {setting.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    </div>
                    {renderSetting(section.id, setting)}
                    {setting.description && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Bar */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-800">You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfig;