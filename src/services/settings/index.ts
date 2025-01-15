export interface ExpirySettingsConfig {
  freshProducts: {
    warningDays: number;
    enabled: boolean;
  };
  otherProducts: {
    warningDays: number;
    enabled: boolean;
  };
}

export const getExpirySettings = async (): Promise<ExpirySettingsConfig> => {
  const db = await initSettingsDB();
  const settings = await db.get('settings', 'expirySettings');
  return settings || {
    freshProducts: { warningDays: 2, enabled: true },
    otherProducts: { warningDays: 7, enabled: true }
  };
};

export const updateExpirySettings = async (settings: ExpirySettingsConfig): Promise<void> => {
  const db = await initSettingsDB();
  await db.put('settings', settings, 'expirySettings');
};