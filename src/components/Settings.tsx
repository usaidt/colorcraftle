import React from "react";
import { Link } from "react-router-dom";

interface SettingsProps {
  settings: {
    timeLimit: number;
    maxActions: number;
    accuracyThreshold: number;
  };
  onSettingsChange: (key: string, value: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
  return (
    <div className="settings space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Game Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time Limit (seconds):
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={settings.timeLimit}
            onChange={(e) =>
              onSettingsChange("timeLimit", parseInt(e.target.value, 10))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Actions:
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={settings.maxActions}
            onChange={(e) =>
              onSettingsChange("maxActions", parseInt(e.target.value, 10))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Accuracy Threshold (%):
          </label>
          <input
            type="number"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={settings.accuracyThreshold}
            onChange={(e) =>
              onSettingsChange("accuracyThreshold", parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <Link
        to="/"
        className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Save and Return
      </Link>
    </div>
  );
};

export default Settings;

