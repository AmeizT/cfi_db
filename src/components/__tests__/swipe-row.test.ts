/* eslint-disable @typescript-eslint/no-explicit-any -- Isolated event harness for the supplied JavaScript component. */
import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import ts from "typescript"

type Node = { type: unknown; props: Record<string, any> }
// Exercise event callbacks without requiring a browser or changing the supplied component.
function load(path: string) {
    const listeners: Record<string, (event: any) => void> = {}
    const stateUpdates: unknown[] = []
    const react = {
        useId: () => "row", useEffect() {}, useLayoutEffect() {},
        useRef: (current: unknown) => ({ current }),
        useState: (initial: unknown) => [initial, (value: any) => stateUpdates.push(typeof value === "function" ? value(initial) : value)],
    }
    const value = (initial: number) => ({ current: initial, get() { return this.current }, set(next: number) { this.current = next }, stop() {} })
    const motion = {
        motion: { div: "motion.div", button: "motion.button" },
        useMotionValue: value, useReducedMotion: () => false,
        useTransform: (source: any, transform: any) => ({ get: () => transform(Array.isArray(source) ? source.map(v => v.get()) : source.get()) }),
        animate: (target: any, next: number) => { target.set(next); return Promise.resolve() },
    }
    const exports: Record<string, any> = {}
    const source = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText
    runInNewContext(source, {
        exports, performance, setTimeout: (callback: () => void) => { callback(); return 1 }, clearTimeout() {},
        window: { addEventListener: (name: string, fn: any) => { listeners[name] = fn }, removeEventListener() {} },
        require: (name: string) => {
            if (name === "react") return react
            if (name === "react/jsx-runtime") return { jsx: (type: unknown, props: Node["props"]) => ({ type, props }), jsxs: (type: unknown, props: Node["props"]) => ({ type, props }) }
            if (name === "motion/react") return motion
            if (name === "@/components/SwipeRow") return { __esModule: true, default: "SwipeRow" }
            return {}
        },
    })
    return { exports, listeners, stateUpdates }
}
function descendants(node: Node): Node[] {
    return [node, ...[node.props?.children].flat(Infinity).filter(child => child && typeof child === "object").flatMap(descendants)]
}
const actions = [{ id: "delete", label: "Delete", dismiss: true }, { id: "transfer", label: "Transfer" }]

test("action buttons and full swipe call their existing action/commit paths once", async () => {
    const { exports, listeners } = load("src/components/SwipeRow.jsx")
    const calls: string[] = []
    const row = exports.default({ actions, onAction: (a: any) => calls.push(`action:${a.id}`), onCommit: (a: any) => calls.push(`commit:${a.id}`) })
    const nodes = descendants(row)
    const buttons = nodes.filter(node => node.props.className?.startsWith("swipe-row__action"))
    let stopped = 0
    buttons[0].props.onClick({ detail: 1, stopPropagation() { stopped++ } })
    assert.deepEqual(calls, ["action:transfer"])
    buttons[1].props.onClick({ detail: 1, stopPropagation() { stopped++ } })
    await Promise.resolve()
    assert.deepEqual(calls, ["action:transfer", "action:delete", "commit:delete"])
    assert.equal(stopped, 2)
    calls.length = 0
    const surface = nodes.find(node => node.props.className === "swipe-row__surface")!
    surface.props.onPointerDown({ button: 0, pointerId: 1, clientX: 360, clientY: 0, pointerType: "mouse" })
    listeners.pointermove({ isTrusted: true, pointerId: 1, clientX: -100, clientY: 0 })
    listeners.pointerup({ isTrusted: true, pointerId: 1 })
    await Promise.resolve()
    assert.deepEqual(calls, ["commit:delete"])
    let prevented = false
    surface.props.onClickCapture({ detail: 1, preventDefault() { prevented = true }, stopPropagation() {} })
    assert.equal(prevented, true, "drag must not also select the row")
})

test("ordinary clicks keep the existing row and dots-menu pointer targets", () => {
    const { exports } = load("src/components/SwipeRow.jsx")
    const row = exports.default({ actions })
    const surface = descendants(row).find(node => node.props.className === "swipe-row__surface")!
    let captured = false
    surface.props.ref.current = { setPointerCapture() { captured = true } }
    surface.props.onPointerDown({ button: 0, pointerId: 1, clientX: 100, clientY: 0, pointerType: "mouse" })
    assert.equal(captured, false)
    surface.props.onClickCapture({ detail: 1, preventDefault() { assert.fail("ordinary click blocked") } })
})

test("adapter dispatches Delete once and restores a collapsed row even when confirmation is cancelled", () => {
    const { exports, stateUpdates } = load("src/features/people/shared/master-detail/PeopleSwipeRow.tsx")
    const calls: string[] = []
    const row = exports.PeopleSwipeRow({ label: "Member", children: null, onDelete: () => calls.push("confirm"), onTransfer: () => calls.push("transfer") })
    row.props.onAction(actions[0])
    assert.deepEqual(calls, [])
    row.props.onCommit(actions[0])
    assert.deepEqual(calls, ["confirm"])
    assert.deepEqual(stateUpdates, [1])
    row.props.onAction(actions[1])
    assert.deepEqual(calls, ["confirm", "transfer"])
    const pending = exports.PeopleSwipeRow({ label: "Member", pending: true, onDelete: () => assert.fail(), onTransfer: () => assert.fail() })
    assert.equal(pending.props.actions.length, 0)
    pending.props.onCommit(actions[0])
    pending.props.onAction(actions[1])
})


test("cancelled pointer gestures never commit deletion", async () => {
    const { exports, listeners } = load("src/components/SwipeRow.jsx")
    const row = exports.default({ actions, onCommit: () => assert.fail("cancelled gesture committed") })
    const surface = descendants(row).find(node => node.props.className === "swipe-row__surface")!
    surface.props.onPointerDown({ button: 0, pointerId: 1, clientX: 360, clientY: 0, pointerType: "mouse" })
    listeners.pointermove({ isTrusted: true, pointerId: 1, clientX: -100, clientY: 0 })
    listeners.pointercancel({ isTrusted: true, pointerId: 1, type: "pointercancel" })
    await Promise.resolve()
})
