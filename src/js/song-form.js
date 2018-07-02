{
  let view = {
    el: '.page > main',
    init(){
      this.$el = $(this.el)
    },
    template: `
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

      console.log('this is render() received data: ', data)

      // 根据接收到的参数来替换模板中的占位符
      placeholders.map((string)=>{
        replacement = data[string] || ''
        html = html.replace(`__${string}__`, replacement)
      })
      $(this.el).html(html)

      // 用于生成 songForm 模块的 <h1> , <h1>.text 取决于data (也就是model.data) 中是否有 id 字段 (该字段仅仅能够从songList 发布的 select 事件获得.)
      if(data.id){
        $(this.el).prepend('<h1>编辑歌曲</h1>' )
      }else{
        $(this.el).prepend('<h1>新建歌曲</h1>' )
      }
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
    // create() 用于向leanCloud 新建数据
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
    },
    // update() 用于向数据库更新一条数据, 接收的参数是 this.model.data
    update(data){

      // 第一个参数是 className，第二个参数是 objectId
      var song = AV.Object.createWithoutData('Song', data.id);

      // 遍历data对象的 key 来修改每一个属性
      // data = { name:'', singer:'', url:'', id:'' }
      Object.keys(data).map((key)=>{song.set(key, data[key])})

      return song.save().then(
        (newSong)=>{
        let {id, attributes } = newSong
        Object.assign(this.data, { id, ...attributes })
      })
    }

  }

  let controller = {
    init(model, view){
      this.model = model
      this.view = view
      this.view.init()
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    getSongData(){
      let needs = ['name', 'singer','url']
      let songData = {}
      needs.map((string)=>{
        songData[string] = this.view.$el.find(`input[name=${string}]`).val()
      }) 
      return songData
    }
    ,
    // create () 用于保存一条新建的歌曲信息
    create(){
      let songData = this.getSongData()

      // this.model.create 用于向数据库保存歌曲信息
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
    }
    ,
    update(){
      let songData = this.getSongData()
      Object.assign(this.model.data, { ...songData } )
      this.model.update(this.model.data)
        .then(()=>{
          // 数据库更新后, 发起 'update' 事件
          let string = JSON.stringify(this.model.data)
          let object  = JSON.parse(string)

          window.eventHub.emit('update', object)
          console.log('update is emited')
        })
    }
    ,
    bindEvents(){
      this.view.$el.on('submit','form',(e)=>{
        e.preventDefault()

        if(this.model.data.id){
          // 如果 id 字段存在, 那么向数据库更新这条数据
          this.update(this.model.data)
        }else{
          // 如果 id 字段不存在, 那么向数据库保存一条新数据
          this.create()
        }
        return 
      })
    },
    bindEventHub(){
      // 'select' 事件在songList模块上的li被点击时触发.
      window.eventHub.on('select',(data)=>{
        console.log('songForm receive: ', data)
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',(data)=>{
        if(this.model.data.id) { 
          this.model.data = { name:'', singer:'', url:'', id:'' }
        }else{
          Object.assign( this.model.data, ...data ) 
        }
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(model, view)
}

