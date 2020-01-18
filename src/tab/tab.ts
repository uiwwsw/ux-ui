// customElements.define('fancy-tabs', class extends HTMLElement {
//     constructor() {
//       super();
//       let shadowRoot = this.attachShadow({mode: 'open'});
//       shadowRoot.innerHTML = `
//         <style>
//           ${STYLE}
//         </style>
//         <div id="tabs">
//           <slot id="tabsSlot" name="title"></slot>
//         </div>
//         <div id="panels">
//           <slot id="panelsSlot"></slot>
//         </div> 
//       `;
//     }
//   });
declare var STYLE:string;
declare var HTML:string;
customElements.define('ux-tab', class extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.innerHTML = `
        <style>
          ${STYLE}
        </style>
        ${HTML}
      `;
    }
  });