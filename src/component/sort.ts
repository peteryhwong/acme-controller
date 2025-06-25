export function byDatetime<T extends { datetime: Date }>(lhs: T, rhs: T) {
    return lhs.datetime.getTime() - rhs.datetime.getTime();
}
