declare var STYLE: string;
declare var HTML: string;
customElements.define('ux-select', class extends HTMLElement {
    private optionSlot: HTMLSlotElement;
    private viewSlot: HTMLSlotElement;
    private options: Node[];
    private val: any;
    //   private panels: Node[];
    get value() {
        return this.val
    }
    set value(value:string) {
        const slot = this.viewSlot as HTMLElement;
        if (value === '') {
            slot.dataset.label = '선택해주세요';
        } else {
            const el = this.findEl(value),
                label = el.dataset.label || el.innerText,
                ex = this.options.find((el: Node) => {
                    const hl = el as HTMLElement;
                    return hl.getAttribute('ux') !== null;
                }) as HTMLElement;
            (ex) && (ex.removeAttribute('ux'));
            el.setAttribute('ux', '');
            this.val = value;
            slot.dataset.value = value;
            slot.dataset.label = label;
        }
        this.close();
    }
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
          ${STYLE}
        </style>
        ${HTML}
      `;
        this.viewSlot = this.shadowRoot!.getElementById('viewSlot') as HTMLSlotElement;
        this.optionSlot = this.shadowRoot!.getElementById('optionsSlot') as HTMLSlotElement;
        this.options = this.optionSlot!.assignedNodes({ flatten: true }).filter(el => {
            return el.nodeType === Node.ELEMENT_NODE;
        });
    }
    private __findUx() {
        return this.options.find((el: Node) => {
            const hl = el as HTMLElement;
            return hl.getAttribute('ux') !== null;
        }) as HTMLElement;
    }
    private findEl(value: string) {
        return this.options.find((el: Node) => {
            const hl = el as HTMLElement;
            return hl.dataset.value === value;
        }) as HTMLElement;
    }
    public toggle() {
        if (this.viewSlot.classList.contains('ux')) {
            this.close()
        } else {
            this.open();
        }
    }
    public open() {
        this.viewSlot.classList.add('ux');
        this.optionSlot.classList.add('ux');
    }
    public close() {
        this.viewSlot.classList.remove('ux');
            this.optionSlot.classList.remove('ux');
    }
    private clickHandler(event: MouseEvent): void {
        event.stopPropagation();
        const target = event.target as HTMLElement,
            value = target.dataset.value;
        if (target.getAttribute('slot') === 'option' && target.getAttribute('ux') === null) {
            this.value = value!;
        }
        if(target.id === 'viewSlot') {
            this.toggle();
        }
    }
    private connectedCallback() {
        const activeEl = this.__findUx();
        let val = '';
        if (activeEl) {
            val = activeEl.dataset.value || '';
        }
        this.value = val;
        this.viewSlot!.onclick = this.clickHandler.bind(this);
        this.optionSlot!.onclick = this.clickHandler.bind(this);
    }
    private disconnectedCallback() {
        this.viewSlot!.onclick = null;
        this.optionSlot!.onclick = null;
    }
});