export function utcToLocal(utc_date: string) {
    let date = new Date(utc_date);
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString();
}

export function localToUTC(local_date: string) {
    let date = new Date(local_date);
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() + offset * 60 * 1000);
    return date.toISOString();
}
