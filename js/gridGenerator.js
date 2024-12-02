class GridGenerator {
    constructor() {
        this.rows = [];
        this.selectedRowIndex = -1;
        this.isDragging = false;
        this.initializeElements();
        this.setupEventListeners();
        this.setupResizeHandler();
    }

    initializeElements() {
        // 컨테이너 요소들
        this.gridContainer = document.getElementById('gridContainer');
        this.rowList = document.getElementById('rowList');
        this.selectedRowSettings = document.getElementById('selectedRowSettings');
        this.columnList = document.getElementById('columnList');
        this.codePanel = document.getElementById('codePanel');
        this.currentWidth = document.querySelector('.current-width span');

        // 버튼 요소들
        this.addRowBtn = document.getElementById('addRowBtn');
        this.deleteRowBtn = document.getElementById('deleteRowBtn');
        this.addColumnBtn = document.getElementById('addColumnBtn');
        this.removeColumnBtn = document.getElementById('removeColumnBtn');
        this.copyCodeBtn = document.getElementById('copyCode');

        // 설정 요소들
        this.containerType = document.getElementById('containerType');
        this.rowGutter = document.getElementById('rowGutter');
        this.rowJustify = document.getElementById('rowJustify');
        this.rowAlign = document.getElementById('rowAlign');

        // 미리보기 영역
        this.previewArea = document.querySelector('.preview-area');
        this.resizeHandle = document.querySelector('.resize-handle');
    }

    setupEventListeners() {
        // 행 관리 이벤트
        this.addRowBtn.addEventListener('click', () => this.addNewRow());
        this.deleteRowBtn.addEventListener('click', () => this.deleteSelectedRow());

        // 열 관리 이벤트
        this.addColumnBtn.addEventListener('click', () => this.addColumnToSelectedRow());
        this.removeColumnBtn.addEventListener('click', () => this.removeColumnFromSelectedRow());

        // 설정 변경 이벤트
        this.containerType.addEventListener('change', () => this.updatePreview());
        this.rowGutter.addEventListener('change', () => this.updateSelectedRow());
        this.rowJustify.addEventListener('change', () => this.updateSelectedRow());
        this.rowAlign.addEventListener('change', () => this.updateSelectedRow());

        // 코드 복사 이벤트
        this.copyCodeBtn.addEventListener('click', () => this.copyCode());

        // 브레이크포인트 마크 이벤트
        document.querySelectorAll('.breakpoint-marks .mark').forEach(mark => {
            mark.addEventListener('click', () => {
                const width = mark.dataset.width + 'px';
                this.setPreviewWidth(width);
            });
        });
    }

    setupResizeHandler() {
        let startX;
        let startWidth;

        this.resizeHandle.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            startX = e.clientX;
            startWidth = this.previewArea.offsetWidth;
            this.resizeHandle.classList.add('active');
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const width = startWidth - (e.clientX - startX);
            this.setPreviewWidth(Math.max(300, Math.min(width, this.previewArea.parentElement.offsetWidth)));
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.resizeHandle.classList.remove('active');
            }
        });
    }

    setPreviewWidth(width) {
        const widthValue = typeof width === 'string' ? width : `${width}px`;
        this.previewArea.style.width = widthValue;
        this.currentWidth.textContent = widthValue;

        // 브레이크포인트 마크 업데이트
        const currentWidth = parseInt(width);
        document.querySelectorAll('.breakpoint-marks .mark').forEach(mark => {
            const markWidth = parseInt(mark.dataset.width);
            mark.classList.toggle('active', currentWidth <= markWidth);
        });

        this.updatePreview();
    }

    addNewRow() {
        const newRow = {
            id: Date.now(),
            columns: [
                { size: 12, offset: 0, order: 0, align: '' }
            ],
            gutter: this.rowGutter.value,
            justify: this.rowJustify.value,
            align: this.rowAlign.value
        };

        this.rows.push(newRow);
        this.addRowToList(newRow, this.rows.length - 1);
        this.selectRow(this.rows.length - 1);
        this.updatePreview();
    }

    addRowToList(row, index) {
        const rowElement = document.createElement('div');
        rowElement.className = 'row-item';
        rowElement.dataset.index = index;
        rowElement.innerHTML = `
            <span class="row-number">${index + 1}번 행</span>
            <span class="row-info">${row.columns.length} 열</span>
        `;

        rowElement.addEventListener('click', () => this.selectRow(index));
        this.rowList.appendChild(rowElement);
    }

    selectRow(index) {
        const previousSelected = document.querySelector('.row-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        const rowElement = document.querySelector(`[data-index="${index}"]`);
        if (rowElement) {
            rowElement.classList.add('selected');
        }

        this.selectedRowIndex = index;
        this.selectedRowSettings.style.display = 'block';
        this.loadRowSettings(this.rows[index]);
    }

    loadRowSettings(row) {
        document.getElementById('selectedRowNumber').textContent = this.selectedRowIndex + 1;
        this.rowGutter.value = row.gutter;
        this.rowJustify.value = row.justify;
        this.rowAlign.value = row.align;

        this.updateColumnList(row);
    }

    updateColumnList(row) {
        this.columnList.innerHTML = '';
        row.columns.forEach((column, index) => {
            const columnElement = this.createColumnElement(column, index);
            this.columnList.appendChild(columnElement);
        });
    }

    createColumnElement(column, index) {
        const div = document.createElement('div');
        div.className = 'column-item';
        div.innerHTML = `
            <div class="column-header">
                <strong>열 ${index + 1}</strong>
            </div>
            <div class="column-settings">
                <div class="style-input">
                    <label>크기</label>
                    <select class="column-size" data-index="${index}">
                        ${this.generateColumnOptions(column.size)}
                    </select>
                </div>
                <div class="style-input">
                    <label>Offset</label>
                    <select class="column-offset" data-index="${index}">
                        ${this.generateOffsetOptions(column.offset)}
                    </select>
                </div>
                <div class="style-input">
                    <label>Order</label>
                    <select class="column-order" data-index="${index}">
                        ${this.generateOrderOptions(column.order)}
                    </select>
                </div>
                <div class="style-input">
                    <label>정렬</label>
                    <select class="column-align" data-index="${index}">
                        ${this.generateAlignOptions(column.align)}
                    </select>
                </div>
            </div>
        `;

        // 열 설정 변경 이벤트
        div.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', () => this.updateColumnSettings(index));
        });

        return div;
    }

    generateColumnOptions(selected) {
        let options = '';
        for (let i = 1; i <= 12; i++) {
            options += `<option value="${i}" ${i === selected ? 'selected' : ''}>col-${i}</option>`;
        }
        return options;
    }

    generateOffsetOptions(selected) {
        let options = '<option value="0">없음</option>';
        for (let i = 1; i <= 11; i++) {
            options += `<option value="${i}" ${i === selected ? 'selected' : ''}>offset-${i}</option>`;
        }
        return options;
    }

    generateOrderOptions(selected) {
        let options = '<option value="0">기본</option>';
        for (let i = 1; i <= 5; i++) {
            options += `<option value="${i}" ${i === selected ? 'selected' : ''}>order-${i}</option>`;
        }
        return options;
    }

    generateAlignOptions(selected) {
        return `
            <option value="" ${!selected ? 'selected' : ''}>기본</option>
            <option value="align-self-start" ${selected === 'align-self-start' ? 'selected' : ''}>시작</option>
            <option value="align-self-center" ${selected === 'align-self-center' ? 'selected' : ''}>가운데</option>
            <option value="align-self-end" ${selected === 'align-self-end' ? 'selected' : ''}>끝</option>
        `;
    }

    updateColumnSettings(index) {
        const row = this.rows[this.selectedRowIndex];
        const column = row.columns[index];
        const columnElement = this.columnList.children[index];

        column.size = parseInt(columnElement.querySelector('.column-size').value);
        column.offset = parseInt(columnElement.querySelector('.column-offset').value);
        column.order = parseInt(columnElement.querySelector('.column-order').value);
        column.align = columnElement.querySelector('.column-align').value;

        this.updatePreview();
    }

    updateSelectedRow() {
        if (this.selectedRowIndex === -1) return;

        const row = this.rows[this.selectedRowIndex];
        row.gutter = this.rowGutter.value;
        row.justify = this.rowJustify.value;
        row.align = this.rowAlign.value;

        this.updatePreview();
    }

    updatePreview() {
        const containerClass = this.containerType.value;
        let html = `<div class="${containerClass}">`;
        
        this.rows.forEach(row => {
            const rowClasses = ['row', row.gutter];
            if (row.justify) rowClasses.push(row.justify);
            if (row.align) rowClasses.push(row.align);

            html += `\n  <div class="${rowClasses.join(' ')}">`;

            row.columns.forEach(col => {
                const colClasses = [`col-${col.size}`];
                if (col.offset) colClasses.push(`offset-${col.offset}`);
                if (col.order) colClasses.push(`order-${col.order}`);
                if (col.align) colClasses.push(col.align);

                html += `\n    <div class="${colClasses.join(' ')}">${colClasses.join(' ')}</div>`;
            });

            html += '\n  </div>';
        });

        html += '\n</div>';

        this.gridContainer.innerHTML = html;
        this.codePanel.textContent = html;
    }

    copyCode() {
        navigator.clipboard.writeText(this.codePanel.textContent)
            .then(() => alert('코드가 복사되었습니다!'))
            .catch(err => console.error('복사 실패:', err));
    }

    addColumnToSelectedRow() {
        if (this.selectedRowIndex === -1) return;

        const row = this.rows[this.selectedRowIndex];
        const totalColumns = row.columns.reduce((sum, col) => sum + col.size, 0);
        
        if (totalColumns >= 12) {
            alert('더 이상 열을 추가할 수 없습니다. (최대 12칸)');
            return;
        }

        const availableSpace = 12 - totalColumns;
        row.columns.push({
            size: Math.min(availableSpace, 6),
            offset: 0,
            order: 0,
            align: ''
        });

        this.loadRowSettings(row);
        this.updatePreview();
    }

    removeColumnFromSelectedRow() {
        if (this.selectedRowIndex === -1) return;

        const row = this.rows[this.selectedRowIndex];
        if (row.columns.length > 1) {
            row.columns.pop();
            this.loadRowSettings(row);
            this.updatePreview();
        }
    }

    deleteSelectedRow() {
        if (this.selectedRowIndex === -1) return;

        this.rows.splice(this.selectedRowIndex, 1);
        this.rowList.innerHTML = '';
        this.rows.forEach((row, index) => this.addRowToList(row, index));
        
        this.selectedRowIndex = -1;
        this.selectedRowSettings.style.display = 'none';
        this.updatePreview();
    }
}

// 제너레이터 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    window.gridGenerator = new GridGenerator();
});