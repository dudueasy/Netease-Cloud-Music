{
  let view = {
    el: 'aside .songList-container',
    template:`
    <ul class='songList'>
    </ul>
    `,
    // render 的参数来源是 model.data, model.data 的数据来源是 LeanCloud 数据库
    render(data){
      let {songs, selectedSongId} = data
      // generate <li> according to  data.songs[index]
      
      console.log('songs:',songs)

      let liList = songs.map((song)=> { 
        let $li =   $('<li></li>').text(song.name).attr('data-song-id',song.id)
        if(song.id === data.selectedSongId){
          $li.addClass('active')
        }
        return $li
      }) 

      console.log('liList: ',liList)

      // empty <li> container (ul)
      let $el = $(this.el)
      $el.find('ul').empty()
      $(this.el).html(this.template)

      liList.map((liElement)=>{
        $el.find('ul').append(liElement)
      })

    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: [
        //example: {id:'', name:'', singer:'', url:''}
      ],
      selectedSongId:''
    },
    find(){
      var query = new AV.Query('Song')
      return query.find().then((songs)=>{
        console.log(songs)
        this.data.songs = songs.map((song)=>{
          return {id:song.id, ...song.attributes}
        })
        return songs
      }, function (error) {
        console.log('something wrong')
      })
    }
  }

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEventHub()
      this.bindEvents()
      this.getAllSongs()
    },
    getAllSongs(){
      return this.model.find().then(()=>{
        return this.view.render(this.model.data)
      }).then(()=>{
        console.log('this.model.data')
        console.log(this.model.data)
      })
    }
    ,
    bindEvents(){
      $(this.view.el).on('click', 'li', (e)=>{
        let songId = $(e.currentTarget).attr('data-song-id')
        this.model.data.selectedSongId = songId
        this.view.render(this.model.data)

        
        // 获取被点击歌曲的信息, 并发布 select 事件
        let songInfo = this.model.data.songs.filter(song => song.id === songId)[0]
        //深拷贝 songInfo 变量以避免传递引用的潜在问题 (变量在一个模块中被修改后, 将会影响到依赖它的另一个模块)
        window.eventHub.emit('select',JSON.parse(JSON.stringify(songInfo)))
      })
    },
    bindEventHub(){
      window.eventHub.on('new', ()=>{
        this.view.clearActive()
      })
      window.eventHub.on('create',(data)=>{
        console.log(data)
        this.model.data.songs.push(data) 
        this.view.render(this.model.data)
      })
      window.eventHub.on('update',(data)=>{
        console.log('update')
        console.log('newdata', data)
        let songs = this.model.data.songs

        for(let i =0; i<songs.length; i++){
          if(songs[i].id === data.id){
            songs[i] = data
          }
        }
        // 更新this.model.data.songs
        this.model.data.songs = songs      
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
  console.log(`${view.el} is rendered by song-list.js`)
}
