import React from 'react'
import { Label } from '@/components/ui/label'
import {
    Checkbox,
    type CheckboxProps,
} from '@/components/animate-ui/components/radix/checkbox'

interface AnimatedCheckboxProps {
    checked: boolean | 'indeterminate'
    variant: CheckboxProps['variant']
    size: CheckboxProps['size'];
}

export const AnimatedCheckbox = ({
    checked,
    variant,
    size
}: AnimatedCheckboxProps) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? false);

    return (
        <Label className="flex items-center gap-x-3">
            <Checkbox
                checked={isChecked}
                onCheckedChange={setIsChecked}
                variant={variant}
                size={size}
            />
        </Label>
    )
}
