{
  let view = {
    el: 'aside .songList-container',
    template:`
    <ul class='songList'>
    </ul>
    `,
    render(data){
      let {songs} = data
      console.log(songs)
      // generate <li> according to  data.songs[index]
      let liList = songs.map((song)=> $('<li></li>').text(song.name) )

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
        this.view.render(this.model.data)
      })
    }
    ,
    bindEvents(){
      $(this.view.el).on('click', 'li', (e)=>{
      this.view.activeItem(e.currentTarget)
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
