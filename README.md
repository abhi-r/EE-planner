# EVE Echoes Planning Tool

A web-based planning tool for EVE Echoes that allows you to create, organize, and track items with ISK values.

## Features

- **Drag and Drop Reordering**: Click and drag items to reorder your list
- **Editable Item Names**: Click on any item name to edit it
- **ISK Tracking**: Add ISK values to each item and see the total automatically
- **Auto-Save**: All changes are automatically saved to your browser's local storage
- **Responsive Design**: Works on desktop and mobile devices
- **EVE-Themed UI**: Dark space theme matching EVE's aesthetic

## Usage

Simply open `index.html` in your web browser. No installation or build process required!

### Adding Items
1. Click the "+ Add Item" button
2. Enter a name for your item
3. Enter the ISK value
4. Items are automatically saved

### Reordering Items
1. Click and hold the drag handle (⋮⋮) on the left side of any item
2. Drag the item up or down to reorder
3. Release to drop it in the new position

### Editing Items
- Click on the item name to edit it
- Click on the ISK value to change it
- All changes are saved automatically

### Deleting Items
- Click the "Delete" button on any item to remove it

### Total ISK
The total ISK value of all items is displayed at the top of the page and updates automatically.

## Technical Details

- Pure vanilla JavaScript (no frameworks required)
- HTML5 Drag and Drop API
- LocalStorage for persistence
- Responsive CSS Grid/Flexbox layout

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Drag and Drop API
- LocalStorage
- ES6 JavaScript

## Future Enhancements

Potential features to add:
- Export/Import functionality
- Multiple lists/categories
- Item templates
- Cost calculations
- Shopping list mode
