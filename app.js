class PlanningTool {
    constructor() {
        this.items = [];
        this.draggedElement = null;
        this.init();
    }

    init() {
        this.addItemBtn = document.getElementById('addItem');
        this.planningList = document.getElementById('planningList');
        this.totalIskElement = document.getElementById('totalIsk');
        this.emptyState = document.getElementById('emptyState');

        this.addItemBtn.addEventListener('click', () => this.addItem());

        // Load saved items from localStorage
        this.loadItems();

        // Add initial item if empty
        if (this.items.length === 0) {
            this.addItem();
        }
    }

    addItem(name = 'New Item', isk = 0) {
        const id = Date.now() + Math.random();
        const item = { id, name, isk };
        this.items.push(item);
        this.renderItem(item);
        this.updateTotal();
        this.updateEmptyState();
        this.saveItems();
    }

    renderItem(item) {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.draggable = true;
        li.dataset.id = item.id;

        li.innerHTML = `
            <div class="drag-handle">⋮⋮</div>
            <div class="item-content">
                <input
                    type="text"
                    class="item-name"
                    value="${this.escapeHtml(item.name)}"
                    placeholder="Item name"
                >
                <div class="item-isk-group">
                    <span class="isk-label">ISK:</span>
                    <input
                        type="number"
                        class="item-isk"
                        value="${item.isk}"
                        min="0"
                        step="1000"
                        placeholder="0"
                    >
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger delete-btn">Delete</button>
            </div>
        `;

        // Event listeners
        const nameInput = li.querySelector('.item-name');
        const iskInput = li.querySelector('.item-isk');
        const deleteBtn = li.querySelector('.delete-btn');

        nameInput.addEventListener('input', (e) => {
            item.name = e.target.value;
            this.saveItems();
        });

        iskInput.addEventListener('input', (e) => {
            item.isk = parseFloat(e.target.value) || 0;
            this.updateTotal();
            this.saveItems();
        });

        deleteBtn.addEventListener('click', () => this.deleteItem(item.id));

        // Drag events
        li.addEventListener('dragstart', (e) => this.handleDragStart(e, li));
        li.addEventListener('dragend', (e) => this.handleDragEnd(e, li));
        li.addEventListener('dragover', (e) => this.handleDragOver(e, li));
        li.addEventListener('drop', (e) => this.handleDrop(e, li));
        li.addEventListener('dragleave', (e) => this.handleDragLeave(e, li));

        this.planningList.appendChild(li);
    }

    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.remove();
        }
        this.updateTotal();
        this.updateEmptyState();
        this.saveItems();
    }

    handleDragStart(e, element) {
        this.draggedElement = element;
        element.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.innerHTML);
    }

    handleDragEnd(e, element) {
        element.classList.remove('dragging');
        this.draggedElement = null;

        // Remove all drag-over classes
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }

    handleDragOver(e, element) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        if (this.draggedElement && this.draggedElement !== element) {
            element.classList.add('drag-over');
        }

        return false;
    }

    handleDragLeave(e, element) {
        element.classList.remove('drag-over');
    }

    handleDrop(e, element) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        element.classList.remove('drag-over');

        if (this.draggedElement && this.draggedElement !== element) {
            // Get the positions
            const draggedId = this.draggedElement.dataset.id;
            const targetId = element.dataset.id;

            // Find indices in items array
            const draggedIndex = this.items.findIndex(item => item.id == draggedId);
            const targetIndex = this.items.findIndex(item => item.id == targetId);

            // Reorder items array
            const [draggedItem] = this.items.splice(draggedIndex, 1);
            this.items.splice(targetIndex, 0, draggedItem);

            // Reorder DOM
            const parent = element.parentNode;
            const draggedRect = this.draggedElement.getBoundingClientRect();
            const targetRect = element.getBoundingClientRect();

            if (draggedRect.top < targetRect.top) {
                parent.insertBefore(this.draggedElement, element.nextSibling);
            } else {
                parent.insertBefore(this.draggedElement, element);
            }

            this.saveItems();
        }

        return false;
    }

    updateTotal() {
        const total = this.items.reduce((sum, item) => sum + (item.isk || 0), 0);
        this.totalIskElement.textContent = this.formatNumber(total);
    }

    updateEmptyState() {
        if (this.items.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.planningList.style.display = 'none';
        } else {
            this.emptyState.classList.add('hidden');
            this.planningList.style.display = 'block';
        }
    }

    formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveItems() {
        localStorage.setItem('eeplannerItems', JSON.stringify(this.items));
    }

    loadItems() {
        const saved = localStorage.getItem('eeplannerItems');
        if (saved) {
            try {
                this.items = JSON.parse(saved);
                this.items.forEach(item => this.renderItem(item));
                this.updateTotal();
                this.updateEmptyState();
            } catch (e) {
                console.error('Failed to load saved items:', e);
            }
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PlanningTool();
});
