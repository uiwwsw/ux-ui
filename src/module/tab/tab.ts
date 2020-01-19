declare var STYLE: string;
declare var HTML: string;
customElements.define('ux-tab', class extends HTMLElement {
  private tab: HTMLSlotElement;
  private panel: HTMLSlotElement;
  private tabs: Node[];
  private panels: Node[];
  constructor() { 
    super();
    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
        <style>
          ${STYLE}
        </style>
        ${HTML}
      `;
    this.tab = this.shadowRoot!.getElementById('tabsSlot') as HTMLSlotElement;
    this.panel = this.shadowRoot!.getElementById('panelsSlot') as HTMLSlotElement;
    this.tabs = this.tab!.assignedNodes({ flatten: true });
    this.panels = this.panel!.assignedNodes({ flatten: true }).filter(el => {
      return el.nodeType === Node.ELEMENT_NODE;
    });
  }
  action(index: string) {
    this.tabs.map((el: any) => el.removeAttribute('ux'));
    this.panels.map((el: any) => el.removeAttribute('ux'));
    const tab = this.tabs[Number(index)] as HTMLElement,
    panel = this.panels[Number(index)] as HTMLElement;
    tab.setAttribute('ux', "");
    panel.setAttribute('ux', "");
  }

  clickHandler(event: MouseEvent): void {
    event.stopPropagation();
    const target = event.target as HTMLElement,
      index = target.dataset.index;
    if (target.getAttribute('slot') === 'tab' && target.getAttribute('ux') === null) {
      this.action(index!);
    }
  }
  connectedCallback() {
    let index = '';
    this.tabs.map((el: any, i: number) => {
      if (el.getAttribute('ux') !== null) {
        index = i.toString();
      }
      el.setAttribute('data-index', i.toString());
    });
    this.panels!.map((el: any, i: number) => {
      if (i === Number(index)) {
        el.setAttribute('ux', '');
      }
      el.setAttribute('data-index', i.toString());
    });
    this.tab!.onclick = this.clickHandler.bind(this);
  }
  disconnectedCallback() {
    this.tab!.onclick = null;
  }
});