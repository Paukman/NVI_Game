## Usage

Provide callbalcks for dragging, editign and deleting columns.
This is an example:

```
<CustomizableTable
    expandCollapePlacement={-1}
    subHeaders={state?.subHeaders}
    items={state?.listingData}
    editable={state?.edit}
    isPaginated={false}
    hasStripes={true}
    onDragColumn={onDragColumn}
    onEditColumn={onEditColumn}
    onDeleteColumn={onDeleteColumn}
/>
```
