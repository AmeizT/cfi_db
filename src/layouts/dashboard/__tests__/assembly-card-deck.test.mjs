import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import vm from "node:vm"
import ts from "typescript"

// Exercise the component's actual event handlers with a small hook/DOM harness.
// Browser layout and CSS animation still need visual verification.
function harness(count, mobile = false) {
    const slots = []
    const listeners = new Map()
    let cursor = 0
    let effects = []
    let cleanups = []
    let focused = false
    const nodes = {
        root: { contains: target => target === "inside", getBoundingClientRect: () => ({ left: 16, top: 20 }) },
        deck: { scrollLeft: 0, querySelector: () => ({ focus: () => { focused = true } }) },
        trigger: { focus: () => { focused = true } },
    }
    const React = {
        createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat() }),
        useState(initial) {
            const index = cursor++
            if (!(index in slots)) slots[index] = initial
            return [slots[index], value => { slots[index] = value }]
        },
        useRef() {
            const index = cursor++
            return slots[index] ?? (slots[index] = { current: nodes[["root", "deck", "trigger"][index]] })
        },
        useId: () => "chooser",
        useEffect: effect => effects.push(effect),
    }
    const document = {
        addEventListener: (name, fn) => listeners.set(name, fn),
        removeEventListener: name => listeners.delete(name),
    }
    const loaded = { exports: {} }
    const compiled = ts.transpileModule(readFileSync("src/layouts/dashboard/AssemblyCardDeck.tsx", "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
    }).outputText
    vm.runInNewContext(compiled, {
        module: loaded, exports: loaded.exports,
        require: name => name === "react" ? React : name.endsWith(".css")
            ? { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) }
            : name.endsWith("use-mobile") ? { useIsMobile: () => mobile }
            : new Proxy({}, { get: (_, key) => String(key) }),
        document, window: { ...document, innerWidth: 400 }, requestAnimationFrame: fn => fn(),
    })
    const assemblies = Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Assembly ${i + 1}` }))
    const selected = []
    const props = { assemblies, activeAssembly: assemblies[0], loading: false, pending: false, variant: "sidebar", onSelect: a => selected.push(a.id) }
    let tree
    function render() {
        cleanups.forEach(fn => fn?.())
        cursor = 0
        effects = []
        tree = loaded.exports.AssemblyCardDeck(props)
        cleanups = effects.map(fn => fn())
        return tree
    }
    function all(node = tree) {
        return [node, ...node.children.filter(c => c && typeof c === "object").flatMap(all)]
    }
    render()
    return {
        props, nodes, selected, render, all,
        get root() { return tree },
        get focused() { return focused },
        event: (name, event) => listeners.get(name)?.(event),
        cards: () => all().filter(n => n.props.className === "card"),
        trigger: () => all().find(n => n.props.className === "trigger"),
    }
}

test("one assembly is an identity card with no switch control or fake layers", () => {
    const h = harness(1)
    assert.equal(h.cards().length, 1)
    assert.equal(h.cards()[0].type, "div")
    assert.equal(h.trigger(), undefined)
    h.root.props.onPointerEnter({ pointerType: "mouse" })
    assert.equal(h.render().props["data-expanded"], false)
})

for (const count of [2, 4, 6, 40]) {
    test(`${count} assemblies: hover unfolds, leave collapses, click pins, selection closes`, () => {
        const h = harness(count)
        assert.equal(h.cards().length, count)
        assert.equal(h.cards().filter(n => !n.props["data-hidden"]).length, Math.min(count, 4))
        h.root.props.onPointerEnter({ pointerType: "mouse" })
        assert.equal(h.render().props["data-expanded"], true)
        h.root.props.onPointerLeave()
        assert.equal(h.render().props["data-expanded"], false)
        h.trigger().props.onClick()
        h.render()
        h.root.props.onPointerLeave()
        assert.equal(h.render().props["data-expanded"], true)
        h.cards()[1].props.onClick()
        assert.equal(h.render().props["data-expanded"], false)
        assert.deepEqual(h.selected, [2])
        h.props.activeAssembly = h.props.assemblies[1]
        h.render()
        assert.match(h.cards()[0].props["aria-label"], /Current assembly: Assembly 2/)
    })
}

test("outside click and Escape dismiss; inside interaction stays open", () => {
    const h = harness(4)
    h.trigger().props.onClick()
    h.render()
    h.event("pointerdown", { target: "inside" })
    assert.equal(h.render().props["data-expanded"], true)
    h.nodes.deck.scrollLeft = 104
    h.event("pointerdown", { target: "outside" })
    assert.equal(h.render().props["data-expanded"], false)
    assert.equal(h.nodes.deck.scrollLeft, 0)
    h.trigger().props.onClick()
    h.render()
    h.event("keydown", { key: "Escape" })
    assert.equal(h.render().props["data-expanded"], false)
    assert.equal(h.focused, true)
})

test("touch opens on tap, keyboard opens and focuses, pending blocks selection", () => {
    const h = harness(4)
    h.root.props.onPointerEnter({ pointerType: "touch" })
    assert.equal(h.render().props["data-expanded"], false)
    h.trigger().props.onClick()
    assert.equal(h.render().props["data-expanded"], true)
    h.event("keydown", { key: "Escape" })
    h.render()
    h.trigger().props.onKeyDown({ key: "ArrowRight", preventDefault() {} })
    assert.equal(h.render().props["data-expanded"], true)
    assert.equal(h.focused, true)
    h.props.pending = true
    h.render()
    h.cards()[1].props.onClick()
    assert.deepEqual(h.selected, [])
})

test("expanded row declares bounded horizontal scrolling and snap; narrow and reduced-motion styles exist", () => {
    const css = readFileSync("src/layouts/dashboard/AssemblyCardDeck.module.css", "utf8")
    assert.match(css, /overflow-x: auto/)
    assert.match(css, /scroll-snap-type: x mandatory/)
    assert.match(css, /scroll-snap-align: start/)
    assert.match(css, /scrollbar-width: none/)
    assert.match(css, /max-width: 100%/)
    assert.doesNotMatch(css, /position: fixed/)
    assert.match(css, /flex-shrink: 0/)
    assert.match(css, /data-collapsible="icon"/)
    assert.match(css, /prefers-reduced-motion: reduce/)
})


test("mobile tap opens the grid picker, selecting updates assembly and closes it", () => {
    const h = harness(6, true)
    h.root.props.onPointerEnter({ pointerType: "mouse" })
    assert.equal(h.render().props["data-expanded"], false)
    h.trigger().props.onClick()
    h.render()
    const dialog = () => h.all().find(n => n.type === "Drawer")
    assert.equal(dialog().props.open, true)
    assert.equal(h.root.props["data-expanded"], false)
    const items = h.all().filter(n => n.props.className === "mobileItem")
    assert.equal(items.length, 6)
    assert.equal(items[0].props["aria-current"], "true")
    items[2].props.onClick()
    h.render()
    assert.equal(dialog().props.open, false)
    assert.deepEqual(h.selected, [3])
})

test("single assembly never opens a mobile picker", () => {
    const h = harness(1, true)
    assert.equal(h.trigger(), undefined)
    assert.equal(h.all().find(n => n.type === "Drawer"), undefined)
})

test("desktop tooltips expose full long names, with no name label inside cards", () => {
    const h = harness(2)
    h.props.assemblies[1].name = "Francistown Central Assembly with a very long name"
    h.root.props.onPointerEnter({ pointerType: "mouse" })
    h.render()
    const tips = h.all().filter(n => n.type === "TooltipContent")
    assert.equal(tips[1].children[0], h.props.assemblies[1].name)
    assert.equal(h.cards()[1].props.tabIndex, 0)
    assert.equal(h.cards()[1].children.length, 1)
})

test("card dimensions are declared once across collapsed and expanded states", () => {
    const css = readFileSync("src/layouts/dashboard/AssemblyCardDeck.module.css", "utf8")
    const expandedCard = css.match(/\.deck\[data-expanded="true"\] \.card \{([^}]+)\}/)[1]
    assert.doesNotMatch(expandedCard, /(?:width|height|scale):/)
    assert.match(expandedCard, /transform: translate\(0, 0\) rotate\(0deg\)/)
    assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)
    assert.match(css, /\.mobileName \{[^}]*text-overflow: ellipsis/)
    assert.match(css, /transition-delay: 120ms/)
})


test("touch on a wide viewport opens the picker without unfolding the rail", () => {
    const h = harness(4)
    h.trigger().props.onClick({ nativeEvent: { pointerType: "touch" } })
    h.render()
    assert.equal(h.root.props["data-expanded"], false)
    assert.equal(h.all().find(n => n.type === "Dialog").props.open, true)
})

test("cards expose actionable names and tooltips use a restrained delay", () => {
    const h = harness(4)
    h.root.props.onPointerEnter({ pointerType: "mouse" })
    h.render()
    assert.equal(h.cards()[1].props["aria-label"], "Switch to Assembly 2 assembly")
    assert.ok(h.all().filter(n => n.type === "Tooltip").every(n => n.props.delayDuration === 250))
    const source = readFileSync("src/layouts/dashboard/AssemblyCardDeck.tsx", "utf8")
    assert.match(source, /background: color/)
    assert.doesNotMatch(source, /oklchLinearGradient/)
    assert.match(source, /applySidebarForeground\(node, color\)/)
})


test("very short assembly names remain available in the identity label", () => {
    const h = harness(1)
    h.props.activeAssembly.name = "O"
    h.render()
    assert.equal(h.root.props["aria-label"], "Current assembly: O")
})
