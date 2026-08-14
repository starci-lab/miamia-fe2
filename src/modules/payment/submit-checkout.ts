/** Provider URL and optional signed POST fields. */
export type SubmitCheckoutParams = { readonly checkoutUrl: string; readonly checkoutFields?: string | null }

/** Continue checkout by redirect or signed form POST. */
export const submitCheckout = ({ checkoutUrl, checkoutFields }: SubmitCheckoutParams): void => {
    if (!checkoutFields) {
        window.location.assign(checkoutUrl)
        return
    }
    const fields = JSON.parse(checkoutFields) as Record<string, string | number>
    const form = document.createElement("form")
    form.method = "POST"
    form.action = checkoutUrl
    for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = name
        input.value = String(value)
        form.appendChild(input)
    }
    document.body.appendChild(form)
    form.submit()
}
