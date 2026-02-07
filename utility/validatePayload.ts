/**
 * Validates if a payload has the required keys and that those keys are not empty.
 * @param payload - The JSON object to check
 * @param requiredKeys - An array of strings representing the keys that must exist
 * @returns boolean
 */
 const validatePayload = (
    payload: Record<string, any>,
    requiredKeys: string[]
): boolean => {
    // 1. Check if payload exists and is an object
    if (!payload || typeof payload !== 'object') return false;

    // 2. Check every required key
    return requiredKeys.every(key => {
        const value = payload[key];

        // Ensure the key exists and is not null/undefined
        if (value === undefined || value === null) return false;

        // If it's a string, ensure it's not just empty whitespace
        if (typeof value === 'string' && value.trim() === '') return false;

        return true;
    });
};

export default validatePayload;