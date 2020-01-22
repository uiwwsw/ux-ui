declare var STYLE: string;
declare var HTML: string;
customElements.define('ux-select', class extends HTMLElement {
  private optionSlot: HTMLSlotElement;
  private viewSlot: HTMLSlotElement;
  private options: Node[];
//   private panels: Node[];
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
  toggle() {
      if(this.viewSlot.classList.contains('ux')) {
        this.viewSlot.classList.remove('ux');
        this.optionSlot.classList.remove('ux');
      } else {
        this.viewSlot.classList.add('ux');
        this.optionSlot.classList.add('ux');
      }
    
  }
  action(index: string) {
    const el = this.options[Number(index)] as HTMLElement,
    value = el.innerText,
    img = el.dataset.img,
    desc = el.dataset.desc,
    slot = this.viewSlot as HTMLElement;
    const ex = this.options.find((el:Node)=>{
        const hl = el as HTMLElement;
        return hl.getAttribute('ux') !== null;
    }) as HTMLElement;
    ex.removeAttribute('ux');
    el.setAttribute('ux', '');
    (value)&&(slot.dataset.value = value);
    (img)&&(slot.dataset.img = img);
    (desc)&&(slot.dataset.desc = desc);
  }
  clickHandler(event: MouseEvent): void {
    event.stopPropagation();
    const target = event.target as HTMLElement,
      index = target.dataset.index;
    if (target.getAttribute('slot') === 'option' && target.getAttribute('ux') === null) {
      this.action(index!);
    }
    if(target.id === 'viewSlot') {
    this.toggle();
    }
  }
  connectedCallback() {
    let index = '';
    this.options.map((el: any, i: number) => {
      if (el.getAttribute('ux') !== null) {
        index = i.toString();
      }
      el.setAttribute('data-index', i.toString());
    });
    this.action(index);
    this.viewSlot!.onclick = this.clickHandler.bind(this);
    this.optionSlot!.onclick = this.clickHandler.bind(this);
  }
  disconnectedCallback() {
    this.viewSlot!.onclick = null;
    this.optionSlot!.onclick = null;
  }
});