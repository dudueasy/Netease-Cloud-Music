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
    data:{

    }

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
      // 'click' 事件的回调
      $(this.view.el).on('click',() =>{window.eventHub.emit('new',this.model.data)})
    },
    bindEventHub(){
      window.eventHub.on('new', (data)=>{
        console.log('new event is emited')
        this.active()
      })
      window.eventHub.on('select',(data)=>{
        console.log(data)
        this.deactive()
      })
    }
    ,
    active(){
      console.log('active() is called')
      $(this.view.el).addClass('active')
    }
    ,
    deactive(){
      console.log('deactive is called')
      $(this.view.el).removeClass('active')
    }
  }

  controller.init(view, model)
  console.log(`${view.el} is rendered by new-song.js`)
}
