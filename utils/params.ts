export function valuesToParams(key: string, values?: string[]) {
    const params = new URLSearchParams()

    values?.forEach(value => params.append(
        key, value
    ))

    return params.toString()
}
export function localesToParams(locales?: string[]) {
    return valuesToParams("_locale", locales)
}
