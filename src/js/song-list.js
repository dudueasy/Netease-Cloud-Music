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
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: [
        // {id: 1, name:'1'}, {id: 2, name:'2'}
      ]

    }
  }
  
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
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
