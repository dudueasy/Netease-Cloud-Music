{
  let script1 = document.createElement('script')
  script1.src = './js/index/page-1-1.js'
  document.body.appendChild(script1)
  script1.onload = function(){
    console.log('模块1加载完成')
  }

  let script2 = document.createElement('script')
  script2.src = './js/index/page-1-2.js'
  document.body.appendChild(script2)
  script2.onload = function(){
    console.log('模块2加载完成')
  }

  let view = {
    el:'.page-1',
    template:'',
    init(){ 
      this.$el = $(this.el)
    } ,
    show(){
      this.$el.addClass('active')
    },
    hide(){
      this.$el.removeClass('active')
    }
  }
  let model = { }
  let controller = { 
    init(){
      this.view = view
      this.view.init()
      this.model = model 
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){ },
    bindEventHub(){
      window.eventHub.on('selectTab', (tabName)=>{
        if(tabName === 'page-1'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }
  }
  controller.init()
}



