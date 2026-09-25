import assert from "node:assert/strict"
import test from "node:test"
import { Children, isValidElement, type ReactNode } from "react"
import { MemberActionsMenu } from "../components/member-actions-menu"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

function items(node: ReactNode): Array<{ children?: ReactNode; disabled?: boolean; onSelect?: () => void }> {
    return Children.toArray(node).flatMap(child => {
        if (!isValidElement<{ children?: ReactNode; disabled?: boolean; onSelect?: () => void }>(child)) return []
        return child.type === DropdownMenuItem ? [child.props] : items(child.props.children)
    })
}
function label(children: ReactNode) {
    return Children.toArray(children).filter(child => typeof child === "string").join("").trim()
}

test("directory menu offers transfer and soft-delete callbacks for the selected member", () => {
    const calls: string[] = []
    const menu = MemberActionsMenu({ memberName: "Test Member", canManage: true,
        onTransfer: () => calls.push("transfer"), onEdit: () => calls.push("edit"), onDelete: () => calls.push("delete"),
    })
    const actions = items(menu)
    assert.deepEqual(actions.map(action => label(action.children)), ["Transfer member", "Edit member", "Delete member"])
    actions[0].onSelect?.()
    actions[2].onSelect?.()
    assert.deepEqual(calls, ["transfer", "delete"])
})

test("deletion is available without management roles but respects pending saves", () => {
    const actions = items(MemberActionsMenu({ memberName: "Test Member", canManage: false, onTransfer() {}, onDelete() {} }))
    assert.deepEqual(actions.map(action => label(action.children)), ["Transfer member", "Delete member"])
    assert.ok(!actions[0].disabled)
    assert.equal(actions[1].disabled, false)
    const pending = items(MemberActionsMenu({ memberName: "Test Member", canManage: true, deleting: true, onTransfer() {}, onDelete() {} }))
    assert.equal(pending[1].disabled, true)
})

test("menu clicks do not bubble into the directory row selection handler", () => {
    const menu = MemberActionsMenu({ memberName: "Test Member", canManage: true, onTransfer() {} })
    let stopped = false
    menu.props.onClick({ stopPropagation() { stopped = true } })
    assert.equal(stopped, true)
})
