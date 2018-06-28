{
  let view = {
    el: '.page > main',
    template: `
      <h1>新建歌曲</h1>
      <form class='form' action="">
        <div class='row'>
          <label>
            歌名
          </label>
          <input type="text">
        </div>
        <div class='row'>
          <label>歌手
          </label>
          <input type="text">
        </div>
        <div class='row'>
          <label>外链
          </label>
          <input type="text">
        </div>
        <div class="row actions"><button type="submit" >保存</button></div>
      </form>
    `,
    render(data){
      $(this.el).html(this.template)
    }
  }

  let model  = {

  }

  let controller = {
    init(model, view){
      this.model = model
      this.view = view
      this.view.render(this.model.data)
    }
  }

  controller.init(model, view)
  console.log(`${view.el} is rendered by song-form.js`)
}

