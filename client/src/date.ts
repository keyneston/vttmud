export function subDate(date: Date, days: number): Date {
    if (isNaN(days)) {
        days = 1;
    }

    var d2 = new Date(date);

    d2.setDate(d2.getDate() - (days - 1));

    return d2;
}

export function formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}
