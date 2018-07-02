{
  let view = {
    el:'.page-3',
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
        if(tabName === 'page-3'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }
  }
  controller.init()
}



