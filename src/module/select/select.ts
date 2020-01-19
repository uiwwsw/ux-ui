declare var STYLE: string;
declare var HTML: string;
customElements.define('ux-select', class extends HTMLElement {
  private option: HTMLSlotElement;
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
    this.option = this.shadowRoot!.getElementById('optionsSlot') as HTMLSlotElement;
    this.options = this.option!.assignedNodes({ flatten: true }).filter(el => {
        return el.nodeType === Node.ELEMENT_NODE;
    });
  }
  action(index: string) {
    // this.tabs.map((el: any) => el.removeAttribute('selected'));
    // this.panels.map((el: any) => el.removeAttribute('selected'));
    // const tab = this.tabs[Number(index)] as HTMLElement,
    // panel = this.panels[Number(index)] as HTMLElement;
    // tab.setAttribute('selected', "");
    // panel.setAttribute('selected', "");
  }
  clickHandler(event: MouseEvent): void {
    event.stopPropagation();
    const target = event.target as HTMLElement,
      index = target.dataset.index;
    if (target.getAttribute('slot') === 'option' && target.getAttribute('ux') === null) {
      this.action(index!);
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
    const el = this.options[Number(index)].cloneNode(true);
    this.viewSlot.appendChild(el);
    this.option!.onclick = this.clickHandler.bind(this);
  }
  disconnectedCallback() {
    this.option!.onclick = null;
  }
});