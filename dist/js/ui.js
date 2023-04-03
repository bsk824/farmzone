class DragItem {
  constructor(arg) {
    this.wrap = document.querySelector('.cal_body_date');
    this.item = this.wrap.querySelectorAll('.reg_items');
    this.detailBox = document.querySelector('.detail_box');
    this.dragState = false;
    this.arg = arg;
    this.init();
  }
  init() {
    let dragTimer = null;
    let delta = {
      target: null,
      moveTarget: null,
      left: 0,
      top: 0,
      x: 0,
      y: 0,
    }
    let movTarget = null;
    const resetState = () => {
      if(delta.target != null) {
        delta.target.style = null
        delta.target.classList.remove('isDragging');
        delta = {
          target: null,
          moveTarget: null,
          left: 0,
          top: 0,
          x: 0,
          y: 0,
        }
        movTarget = null;
        setTimeout(()=>{
          this.dragState = false;
        }, 100);
        
        window.removeEventListener('mousemove', mov);
        window.removeEventListener('mouseup', movEnd);
      }
    }
    const mov = (e) => {
      clearTimeout(dragTimer);
      if(delta.target != null) {
        const movX = e.pageX;
        const movY = e.pageY;
        const currentX = movX - delta.x;
        const currentY = movY - delta.y;
        delta.target.style.top = delta.top + currentY + 'px';
        delta.target.style.left = delta.left + currentX + 'px';
        delta.target.style.display = 'none';
        movTarget = document.elementFromPoint(e.clientX, e.clientY).closest('.item');
        delta.target.style.display = 'flex';
      }
    }
    const movEnd = (e) => {
      clearTimeout(dragTimer);
      if(delta.target != null && movTarget != delta.moveTarget && !movTarget.classList.contains('disDate')) {
        movTarget.insertAdjacentElement('beforeend', delta.target);
        resetState();
        if(this.arg.callBack) this.arg.callBack();
      } else {
        resetState();
      }
    }
    const movStart = (e) => {
      dragTimer = setTimeout(()=>{
        this.dragState = true;
        delta.target = e.target.closest('.reg_items');
        delta.moveTarget = delta.target.closest('.item');
        movTarget = delta.target.closest('.item');
        let rect = delta.target.getBoundingClientRect();
        delta.target.style.width = rect.width + 'px';
        delta.target.style.height = rect.height + 'px';
        delta.target.style.left = rect.left + 'px';
        delta.target.style.top = rect.top + 'px';
        delta.left = rect.left;
        delta.top = rect.top;
        delta.x = e.pageX;
        delta.y = e.pageY;
        delta.target.classList.add('isDragging');
        this.detailBox.classList.remove('isShow');
      }, 100);
      window.addEventListener('mousemove', mov);
      window.addEventListener('mouseup', movEnd);
    }
    for(let idx = 0; idx < this.item.length; idx++) {
      this.item[idx].addEventListener('mousedown', movStart);
      this.item[idx].querySelector('.reg_items_txt').addEventListener('click', e => {
        this.detailShow(e);
      });
    }
    this.detailBox.addEventListener('mouseleave', ()=>{
      this.detailBox.classList.remove('isShow');
    })
  }
  detailShow(e) {
    if(this.dragState == false) {
      const target = e.target.closest('.reg_items');
      const rect = target.getBoundingClientRect();
      this.detailBox.classList.add('isShow');
      const posTop = rect.top + 20 - (this.detailBox.clientHeight / 2);
      const posLeft = rect.left + rect.width + 17;
      this.detailBox.style.cssText = `top:${posTop}px;left:${posLeft}px;`;
    }
  }
}