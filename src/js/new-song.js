{
  let view = {
    el:'aside .newSong',
    template:`
    新建歌曲
    `,
    render(data){
      $(this.el).html(this.template)
    }
  }

  let model = {

  }

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.active()
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      // 'click' 事件的回调调用 this.active 时不传数据, 清空 songForm 的model数据
      $(this.view.el).on('click',this.active.bind(this))
    },
    bindEventHub(){
      window.eventHub.on('upload', (data)=>{
        this.active(data)
      })
      window.eventHub.on('select',(data)=>{
        console.log(data)
        this.deactive()
      })
    }
    ,
    active(data){
      $(this.view.el).addClass('active')
      window.eventHub.emit('new',data)
    },
    deactive(){
      console.log('deactive is called')
      $(this.view.el).removeClass('active')
    }
  }

  controller.init(view, model)
  console.log(`${view.el} is rendered by new-song.js`)
}
