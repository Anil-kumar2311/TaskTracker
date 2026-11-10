import { useEffect, useState } from 'react';
import useStore from '../store/useStore';

export default function SettingsPage() {
  const saveSettings = useStore((state) => state.saveSettings);
  const setTheme = useStore((state) => state.setTheme);
  const user = useStore((state) => state.user);
  const [settings, setSettings] = useState({
    theme: user?.theme || 'light',
    timezone: user?.timezone || 'UTC',
    emailNotifications: true,
  });
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSettings((current) => ({
      ...current,
      theme: user.theme || 'light',
      timezone: user.timezone || 'UTC',
    }));
  }, [user?.theme, user?.timezone]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveError('');
    setSaved(false);
    try {
      await saveSettings(settings);
      setSaved(true);
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Settings could not be saved.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Preferences</p>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="card p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-600">Theme</span>
              <select
                className="input"
                value={settings.theme}
                onChange={(event) => {
                  const theme = event.target.value;
                  setSettings((current) => ({ ...current, theme }));
                  setTheme(theme);
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-600">Timezone</span>
              <select className="input" value={settings.timezone} onChange={(event) => setSettings({ ...settings, timezone: event.target.value })}>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
              </select>
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={settings.emailNotifications} onChange={(event) => setSettings({ ...settings, emailNotifications: event.target.checked })} />
            Enable email notifications for reminders and task updates
          </label>

          <div className="rounded-2xl bg-violet-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Security</p>
            <p className="mt-1">Use secure password reset and OAuth flows to verify access before account recovery.</p>
          </div>

          {saveError && <p role="alert" className="text-sm text-red-600">{saveError}</p>}
          {saved && <p role="status" className="text-sm text-emerald-600">Settings saved.</p>}
          <button type="submit" className="button-primary">Save settings</button>
        </form>
      </div>
    </div>
  );
}
