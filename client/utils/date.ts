export function subDate(date: Date, days: number): Date {
    if (isNaN(days)) {
        days = 0;
    }

    var d2 = new Date(date);

    d2.setDate(d2.getDate() - days);

    return d2;
}

export function formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}
