{
  let view = {
    el:'section.songs',
    template:`<li>
      <h3>songName</h3>
      <p>
        <svg class="icon icon-sq">
          <use xlink:href="#icon-sq"></use>
        </svg>
       singer 
      </p>
      <a class="playButton" href="#">
        <svg class="icon icon-play">
          <use xlink:href="#icon-play"></use>
        </svg>
      </a>
    </li>`
    ,
    init(){
      this.$el = $(this.el) 
    }
    ,
    render(songsArray){
      console.log('render is called')
      console.log('songsArray:',songsArray)
      songsArray.map((song)=>{
        let template = this.template 
        console.log('template: ',template)
        template = template.replace('songName', song.name)
        template = template.replace('singer', song.singer)
        console.log(template)

        let $li = $(template)
        this.$el.find('#songs').append($li)
      })
      console.log('render finished')
    }
  }
  let model = {
    data:{
      songs:[]
    },
    find(){

      console.log('model.find() is called')

      var query = new AV.Query('Song')
      return query.find().then((songs)=>{
        this.data.songs = songs.map((song)=>{
          return {id:song.id, ...song.attributes}
        })
        return songs
        console.log(`this.model.data: `,this.model.data)
      }, function (error) {
        console.log('something wrong')
      })
    } 
  }

  let controller = {
    init (){
      this.view = view
      this.view.init()
      this.model = model
      this.model.find()
        .then(()=>{
          this.view.render(this.model.data.songs)
        }) 
      console.log(this.model.data)
    },
    bindEvents(){

    }
  }
  controller.init()
}
