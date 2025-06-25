export function getDateStringForResponse(date: string): Date {
    return date as unknown as Date;
}

export function getDateForResponse(date: Date): Date {
    return getDateStringForResponse(getLocalDate(date).toISOString());
}

export function getLocalDate(date = new Date()): Date {
    const localISOTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localISOTime;
}

// GMT iso string to HKT iso string
export function getHKTISODateString(date: string): string {
    return getLocalDate(new Date(date)).toISOString();
}

export function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}
