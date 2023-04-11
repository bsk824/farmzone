class DragItem {
  constructor(arg) {
    this.wrap = document.querySelector('.cal_body_date');
    this.dates = this.wrap.querySelectorAll('.item');
    this.item = this.wrap.querySelectorAll('.reg_items');
    this.detailBox = document.querySelector('#detailBox');
    this.dragState = false;
    this.arg = arg;
    this.init();
  }
  init() {
    this.dates.forEach(_this=>{
      _this.addEventListener('click',e=>{
        if(!e.target.closest('.reg_items')) {
          const target = e.target.closest('.item');
          if(!target.classList.contains('disDate')) target.classList.toggle('isSelected');
        }
      });
    })
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
  }
  detailShow(e) {
    if(this.dragState == false) {
      const target = e.target.closest('.reg_items');
      layerOpen(this.detailBox, target);
    }
  }
}

function tabScroll() {
  const tabWrap = document.querySelector('#tabScroll');
  const tabBtn = tabWrap.querySelectorAll('button');
  const tagetBox = document.querySelectorAll('.target-box');
  let scrollState = false;
  let boxPos = [];
  let currentNum = 0;
  tagetBox.forEach(_this=>{
    const top = _this.getBoundingClientRect().top;
    boxPos.push(top + window.scrollY - 110);
  });
  window.addEventListener('resize', ()=>{
    boxPos = [];
    tagetBox.forEach(_this=>{
      const top = _this.getBoundingClientRect().top;
      boxPos.push(top + window.scrollY - 110);
    });
  });
  window.addEventListener('scroll',()=>{
    if(scrollState == false) {
      for(let idx = 0 ; idx < boxPos.length; idx++) {
        if(window.scrollY > boxPos[idx]) {
          let next = (boxPos[idx + 1]) ? boxPos[idx + 1] : document.body.clientHeight;
          console.log(next);
          if(window.scrollY < next) currentNum = idx;
        }
      }
      if(!tabBtn[currentNum].closest('li').classList.contains('on')) {
        tabBtn.forEach(_this => {_this.closest('li').classList.remove('on')})
        tabBtn[currentNum].closest('li').classList.add('on');
      }
    };
  })
  tabBtn.forEach((_this, idx)=>{
    _this.addEventListener('click',()=>{
      scrollState = true;
      window.scrollTo(0, boxPos[idx]);
      tabBtn.forEach(_this => {_this.closest('li').classList.remove('on')})
      tabBtn[idx].closest('li').classList.add('on');
      setTimeout(()=>{scrollState = false;},10);
      
    })
  })
}
function scrollMov(num) {
  const btn = event.target;
  const wrap = btn.closest('.tab');
  const tabs = wrap.querySelectorAll('li');
  tabs.forEach(_this=>{_this.classList.remove('on')})
  btn.closest('li').classList.add('on');
  
  const targets = document.querySelectorAll('.target-box');
  const tops = [];
  targets.forEach(_this=>{
    tops.push(_this.getBoundingClientRect().top + window.scrollY - 110);
  })
  window.scrollTo(0, tops[num - 1]);
}

function toggleTr(_this) {
  _this.closest('tr').classList.toggle('isShow');
}


let layerStateFunc = null;

function layerOpen(layer, target) {
  if(typeof layer === 'string') layer = document.querySelector(layer);
  const rect = target.getBoundingClientRect();
  layer.classList.add('isShow');
  const posTop = rect.top + 20 - (layer.clientHeight / 2);
  const posLeft = rect.left + rect.width + 17;
  layer.style.top = `${posTop}px`;
  layer.style.left = `${posLeft}px`;
}

function layerClose(id) {
  const layer = document.querySelector(id);
  layer.classList.remove('isShow');
}