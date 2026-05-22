const INACTIVITY_MS = 60 * 60 * 1000;

interface ExpiringEntry {
    value: string;
    timestamp: number;
    epoch: string;
}

export const readExpiringEntry = (key: string, currentEpoch: string): string | null => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const entry = JSON.parse(raw) as ExpiringEntry;
        if (
            typeof entry !== "object" ||
            entry === null ||
            entry.epoch !== currentEpoch ||
            typeof entry.timestamp !== "number" ||
            Date.now() - entry.timestamp > INACTIVITY_MS
        ) {
            localStorage.removeItem(key);
            return null;
        }
        return entry.value;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
};

export const writeExpiringEntry = (key: string, value: string, currentEpoch: string): void => {
    const entry: ExpiringEntry = { value, timestamp: Date.now(), epoch: currentEpoch };
    localStorage.setItem(key, JSON.stringify(entry));
};

export const todayEpoch = (): string => {
    const d = new Date();
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${day}`;
};
