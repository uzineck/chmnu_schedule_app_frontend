/**
 * Compact Ukrainian relative-time formatter for "freshness" indicators
 * (e.g. "оновлено 5 хв тому"). Uses shortened units (хв/год/дн) to sidestep
 * plural-form headaches. Falls back to absolute DD.MM.YYYY HH:mm beyond a week.
 */
export const formatRelativeUa = (iso: string | null | undefined, now: Date = new Date()): string | null => {
    if (!iso) return null;
    const then = new Date(iso);
    if (Number.isNaN(then.getTime())) return null;
    const diffSec = Math.max(0, Math.floor((now.getTime() - then.getTime()) / 1000));

    if (diffSec < 45) return "щойно";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} хв тому`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} год тому`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay} дн тому`;

    const dd = String(then.getDate()).padStart(2, "0");
    const mm = String(then.getMonth() + 1).padStart(2, "0");
    const yyyy = then.getFullYear();
    const hh = String(then.getHours()).padStart(2, "0");
    const mi = String(then.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
};
