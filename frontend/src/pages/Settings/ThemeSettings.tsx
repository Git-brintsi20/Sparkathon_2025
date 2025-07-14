import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeName } from '../../config/theme';
import { colorPalettes } from '../../config/theme';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Check, 
  Eye,
  Paintbrush,
  Contrast,
  Sliders,
  RefreshCw,
  Download
} from 'lucide-react';

const ThemeSettings: React.FC = () => {
  const { state, setTheme, toggleDarkMode, getAvailableThemes } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<ThemeName | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const availableThemes = getAvailableThemes();

  const handleThemePreview = (themeName: ThemeName) => {
    setPreviewTheme(themeName);
    setShowPreview(true);
    
    // Apply preview theme temporarily
    const root = document.documentElement;
    const palette = colorPalettes[themeName];
    
    Object.entries(palette).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            root.style.setProperty(`--${key}-${subKey}`, subValue);
          }
        });
      } else if (typeof value === 'string') {
        root.style.setProperty(`--${key}`, value);
      }
    });
    
    // Auto-hide preview after 3 seconds
    setTimeout(() => {
      setShowPreview(false);
      setPreviewTheme(null);
      // Restore original theme
      setTheme(state.currentTheme);
    }, 3000);
  };

  const handleThemeSelect = (themeName: ThemeName) => {
    setTheme(themeName);
    setShowPreview(false);
    setPreviewTheme(null);
  };

  const exportThemeConfig = () => {
    const config = {
      currentTheme: state.currentTheme,
      isDark: state.isDark,
      palette: state.palette,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-config-${state.currentTheme}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ThemeCard = ({ theme, isActive, onSelect, onPreview }: {
    theme: { name: ThemeName; displayName: string };
    isActive: boolean;
    onSelect: () => void;
    onPreview: () => void;
  }) => {
    const palette = colorPalettes[theme.name];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
          isActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onClick={onSelect}
      >
        {/* Theme Colors Preview */}
        <div className="flex items-center space-x-2 mb-3">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: `rgb(${palette.primary.DEFAULT})` }}
          />
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: `rgb(${palette.secondary.DEFAULT})` }}
          />
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: `rgb(${palette.accent.DEFAULT})` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{palette.name}</h3>
            <p className="text-sm text-muted-foreground">
              {theme.name === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Preview Theme"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            {isActive && (
              <div className="p-1 text-primary">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
        
        {/* Mini Preview */}
        <div className="mt-3 p-3 rounded border" style={{ 
          backgroundColor: `rgb(${palette.background})`,
          borderColor: `rgb(${palette.border})`
        }}>
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: `rgb(${palette.primary.DEFAULT})` }}
            />
            <div 
              className="h-2 bg-current rounded flex-1"
              style={{ 
                color: `rgb(${palette.muted})`,
                opacity: 0.5
              }}
            />
          </div>
          <div className="mt-2 space-y-1">
            <div 
              className="h-1 bg-current rounded"
              style={{ 
                color: `rgb(${palette.foreground})`,
                opacity: 0.8
              }}
            />
            <div 
              className="h-1 bg-current rounded w-3/4"
              style={{ 
                color: `rgb(${palette.muted})`,
                opacity: 0.6
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Theme Settings</h1>
          <p className="text-muted-foreground">Customize your interface appearance</p>
        </div>
        <button
          onClick={exportThemeConfig}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Config</span>
        </button>
      </div>

      {/* Preview Banner */}
      {showPreview && previewTheme && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground px-4 py-3 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span className="font-medium">
              Previewing {colorPalettes[previewTheme].name}
            </span>
          </div>
          <span className="text-sm opacity-80">
            Preview will auto-hide in 3 seconds
          </span>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleDarkMode}
          className="p-4 border border-border rounded-lg hover:bg-muted transition-all flex items-center space-x-3"
        >
          {state.isDark ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-blue-500" />
          )}
          <div className="text-left">
            <p className="font-medium text-foreground">
              {state.isDark ? 'Switch to Light' : 'Switch to Dark'}
            </p>
            <p className="text-sm text-muted-foreground">
              Toggle dark/light mode
            </p>
          </div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme('default')}
          className="p-4 border border-border rounded-lg hover:bg-muted transition-all flex items-center space-x-3"
        >
          <Monitor className="w-6 h-6 text-gray-500" />
          <div className="text-left">
            <p className="font-medium text-foreground">Reset to Default</p>
            <p className="text-sm text-muted-foreground">
              Restore default theme
            </p>
          </div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 border border-border rounded-lg hover:bg-muted transition-all flex items-center space-x-3"
        >
          <Contrast className="w-6 h-6 text-purple-500" />
          <div className="text-left">
            <p className="font-medium text-foreground">Auto Contrast</p>
            <p className="text-sm text-muted-foreground">
              System preference
            </p>
          </div>
        </motion.button>
      </div>

      {/* Current Theme Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Current Theme</h3>
            <p className="text-muted-foreground">
              {state.palette.name} • {state.isDark ? 'Dark Mode' : 'Light Mode'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: `rgb(${state.palette.primary.DEFAULT})` }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Primary</p>
              <p className="text-xs text-muted-foreground">rgb({state.palette.primary.DEFAULT})</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: `rgb(${state.palette.secondary.DEFAULT})` }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Secondary</p>
              <p className="text-xs text-muted-foreground">rgb({state.palette.secondary.DEFAULT})</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: `rgb(${state.palette.accent.DEFAULT})` }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Accent</p>
              <p className="text-xs text-muted-foreground">rgb({state.palette.accent.DEFAULT})</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: `rgb(${state.palette.background})` }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Background</p>
              <p className="text-xs text-muted-foreground">rgb({state.palette.background})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Gallery */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Paintbrush className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Available Themes</h3>
          <span className="text-sm text-muted-foreground">
            ({availableThemes.length} themes available)
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableThemes.map((theme) => (
            <ThemeCard
              key={theme.name}
              theme={theme}
              isActive={state.currentTheme === theme.name}
              onSelect={() => handleThemeSelect(theme.name)}
              onPreview={() => handleThemePreview(theme.name)}
            />
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Advanced Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Follow System Theme</p>
              <p className="text-sm text-muted-foreground">
                Automatically switch between light and dark mode
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Reduce Motion</p>
              <p className="text-sm text-muted-foreground">
                Minimize animations for better performance
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">High Contrast</p>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better accessibility
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Reset Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Reset All Settings</h3>
            <p className="text-sm text-muted-foreground">
              This will restore all theme settings to their default values
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme('default')}
            className="flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Default</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeSettings;