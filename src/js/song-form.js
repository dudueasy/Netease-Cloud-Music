{
  let view = {
    el: '.page > main',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <h1>新建歌曲</h1>
      <form class='form' action="">
        <div class='row'>
          <label>
            歌名
          </label>
          <input type="text" name='name' value='__name__'>
        </div>
        <div class='row'>
          <label>歌手
          </label>
          <input type="text" name='singer' value='__singer__'>
        </div>
        <div class='row'>
          <label>外链
          </label>
          <input type="text" name='url' value='__url__'>
        </div>
        <div class="row actions"><button type="submit" >保存</button></div>
      </form>
    `,
    render(data={}){
      let placeholders = ['name','url', 'singer','id']
      let html = this.template
      window.template = this.template

      // 根据接收到的参数来替换模板中的占位符
      placeholders.map((string)=>{
        replacement = data[string] || ''
        html = html.replace(`__${string}__`, replacement)
      })
      $(this.el).html(html)
    },
    reset(){
      this.render({})
    }
  }

  let model  = {
    data:{
      name:'',
      singer:'',
      url:'',
      id:''
    },
    // create() 用于向leanCloud 提交数据
    create(data){
      // define leanCloud database table(Class) to use.
      let song = AV.Object.extend('Song');
      
      // 新建对象(数据行)
      song = new song();
     
      // 定义字段的值 
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);
     
      // 在leanCloud 的回调函数中, 将响应对象的 attributes(数据库保存的信息) 分别赋值给 model.data
      // 返回 leanCloud 的数据对象 (Promise), 用于给 this.model.create() 提供后续的.then()操作
      return song.save().then(
        (newSong) => { 
          let {id, attributes } = newSong
          Object.assign(this.data, { id, ...attributes })
          // this.data = {id, ...attributes}
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  let controller = {
    init(model, view){
      this.model = model
      this.view = view
      this.view.init()
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('upload', (data)=>{
        console.log('song-form模块得到了数据')
        console.log(data)
        this.view.render(data)
      })
    },
    bindEvents(){
      this.view.$el.on('submit','form',(e)=>{
        e.preventDefault()
        let needs = ['name', 'singer','url']
        let songData = {}
        needs.map((string)=>{
          songData[string] = this.view.$el.find(`input[name=${string}]`).val()
          window[string] = this.view.$el.find(`input[name=${string}]`)
        })
        this.model.create(songData)
          .then(()=>{
            // 歌曲保存后, 清空songForm 中的数据.
            this.view.reset()

            // 获取 this.model.data 的深拷贝数据(避免异常)
            let string = JSON.stringify(this.model.data)
            let object  = JSON.parse(string)

            // 向事件中心发布'create' 事件
             window.eventHub.emit('create', object)
          })
      })
    }
  }

  controller.init(model, view)
  console.log(`${view.el} is rendered by song-form.js`)
}

