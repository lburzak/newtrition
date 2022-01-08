export function convertJsonToFormData(obj) {
    const data = new FormData()

    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            data.append(key, JSON.stringify(obj[key]))
            continue;
        }
        data.append(key, obj[key])
    }

    return data
}