{
  let view = {
    el:"#app"
    ,
    render(songData){
      $(this.el).css({'background-image': `url(${ songData .cover})`})
      $(this.el).find('img.cover').attr('src',songData.cover)
      $(this.el).find('audio').attr('src', songData.url)
    },
    play(){
      $(this.el).find('.disc-container').addClass('playing')
      $(this.el).find('audio')[0].play()
      $(this.el).find('.icon-play').css({display:'none'})
      
      
    },
    pause(){
      $(this.el).find('.disc-container').removeClass('playing')
      $(this.el).find('audio')[0].pause()
      $(this.el).find('.icon-play').css({display:'block'})
      
    }
  }

  let model = {
    data:{
      song:{
        id:'',
        name:'',
        singer:'',
        url:'',
        cover:''
      },
      status: 'paused'
    },
    getSongIdFromUrl(){
      let search = window.location.search
      if( search.indexOf('?') === 0){
        search = search.substr(1) }
      search = search.split("&").filter(v => v)  //如果 v 非空(falsy值) , 就通过filter, 避免查询参数中出现 && 的情况
      let songId='' // 为 songId 定义一个初始值

      // 解析每一对键值对
      let queryObjs = search.map((item)=>{  
        let keyValueArray = item.split('=')
        if(keyValueArray[0] === 'id'){ songId = keyValueArray[1]}
      })
      return songId
    } 
    ,
    // get songInfo
    get(songId){
      var query = new AV.Query('Song')
      return query.get(songId).then((song)=>{
        Object.assign(this.data.song ,{id: songId, ...song.attributes })
        return song
      })
    }
  }

  let controller ={
    init(){
      this.view = view
      this.model = model
      let songId = this.model.getSongIdFromUrl()
      this.model.get(songId).then(()=>{
        this.view.render(this.model.data.song)
      })
      this.bindEvents()
    },
    bindEvents(){
      $(this.view.el).on('click',()=>{
        if(this.model.data.status === 'paused') {
          this.view.play() 
          this.model.data.status  = 'playing'
          console.log(this.model.data.status)
          
        }else if(this.model.data.status === 'playing') {
          this.view.pause()
          this.model.data.status  = 'paused'
          console.log(this.model.data.status)
        }
      })
    }
  }

  controller.init()
}
