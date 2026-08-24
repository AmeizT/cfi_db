import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const locales = ["en", "fr", "pt", "sw", "af"]

test("every supported locale contains the password reset namespaces", async () => {
    for (const locale of locales) {
        const messages = JSON.parse(await readFile(`src/i18n/messages/${locale}.json`, "utf8"))
        assert.equal(typeof messages.Password?.action, "string", `${locale} Password.action`)
        assert.equal(typeof messages.Reset?.input, "string", `${locale} Reset.input`)
        assert.equal(typeof messages.Reset?.["input-2"], "string", `${locale} Reset.input-2`)
        assert.equal(typeof messages.PasswordUpdated?.action, "string", `${locale} PasswordUpdated.action`)
    }
})

test("password recovery success navigation is idempotent and locale-preserving", async () => {
    const source = await readFile("src/features/auth/iforgot/PasswordRecovery.tsx", "utf8")
    assert.match(source, /if \(!formState\.success \|\| isRecoveryInitialized\) return/)
    assert.match(source, /router\.replace\(`\$\{pathname\}\?\$\{params\.toString\(\)\}`\)/)
    assert.doesNotMatch(source, /router\.push\(`\/en\/auth\/password\/recover/)
})

test("password reset success navigation is idempotent and locale-preserving", async () => {
    const source = await readFile("src/features/auth/iforgot/PasswordReset.tsx", "utf8")
    assert.match(source, /if \(!formState\.success \|\| isPasswordUpdated\) return/)
    assert.match(source, /router\.replace\(`\$\{pathname\}\?\$\{params\.toString\(\)\}`\)/)
    assert.doesNotMatch(source, /router\.push\(`\/en\/auth\/password\/reset/)
})
