{
  let view = {
    el:'#tabs',
    init(){
      this.$el = $(this.el)
    }
  } 
  let model = { }

  let controller = {
    init(){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    }
    ,bindEvents(){
      this.view.$el.on('click','.tabs-nav > li',(e)=>{
        let $li = $(e.currentTarget)
        $li.addClass('active')
          .siblings().removeClass('active')

        let pageName = $li.attr('data-page-name')
        window.eventHub.emit('selectTab', pageName)
      }) 

    }
  }
  controller.init()
}
