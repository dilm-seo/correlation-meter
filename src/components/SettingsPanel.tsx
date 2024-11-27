import React from 'react';
import { Settings } from '../types';
import { Settings as SettingsIcon } from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Configuration</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Clé API OpenAI
          </label>
          <input
            type="password"
            id="apiKey"
            value={settings.apiKey}
            onChange={(e) => onSettingsChange({ ...settings, apiKey: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="sk-..."
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Modèle OpenAI
          </label>
          <select
            id="model"
            value={settings.model}
            onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>
      </div>
    </div>
  );
}