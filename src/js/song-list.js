{
  let view = {
    el: 'aside .songList-container',
    template:`
    <ul class='songList'>
    </ul>
    `,
    // render 的参数来源是 model.data, model.data 的数据来源是 LeanCloud 数据库
    render(data){
      let {songs} = data
      console.log(songs)
      // generate <li> according to  data.songs[index]
      let liList = songs.map((song)=> $('<li></li>').text(song.name).attr('data-song-id',song.id))

      // empty <li> container (ul)
      let $el = $(this.el)
      $el.find('ul').empty()
      $(this.el).html(this.template)

      liList.map((liElement)=>{
        $el.find('ul').append(liElement)
      })

    },
    activeItem(li){
      let $li = $(li)
      $li.addClass('active').
        siblings('.active').removeClass('active')
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: [
        //example: {id:'', name:'', singer:'', url:''}
      ]
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
        this.view.activeItem(e.currentTarget)
        let songId = $(e.currentTarget).attr('data-song-id')
        window.eventHub.emit('select',{id:songId})
      })
    },
    bindEventHub(){
      window.eventHub.on('upload', ()=>{
        this.view.clearActive()
      })
      window.eventHub.on('create',(data)=>{
        console.log(data)
        this.model.data.songs.push(data) 
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
  console.log(`${view.el} is rendered by song-list.js`)
}
