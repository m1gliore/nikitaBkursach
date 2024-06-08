export const convertStatus = <T extends string>(
    status: string,
    enumObj: { [key: string]: T }
): T => {
    const lowerCaseStatus = status.toLowerCase();
    const matchedKey = Object.keys(enumObj).find(
        key => key.toLowerCase() === lowerCaseStatus
    )
    if (matchedKey) {
        return enumObj[matchedKey]
    } else {
        throw new Error(`Unknown status: ${status}`)
    }
}
