{
    let view = {
        el: "#app"
        ,
        init() {
            this.$el = $(this.el)
        }
        ,
        render(songData) {
            this.$el.find('.background').css({'background-image': `url(${songData.background})`})
            this.$el.find('img.cover').attr('src', songData.cover)
            let audio = this.$el.find('audio').attr('src', songData.url)[0]

            //监听媒体事件
            audio.onended = () => {
                this.pause()
            }
            audio.ontimeupdate = () => {
                this.showLyric(audio.currentTime)
            }

            // 插入歌曲名
            this.$el.find('.song-description>h1').html(songData.name)

            let {lyrics} = songData
            //  处理 model 中的歌词数据
            let array = lyrics.split("\n").map((item) => {
                // 新建一个 <p>
                let $p = $(`<p></p>`)

                // 定义用来分割时间戳和歌词的正则表达式
                let regex = /\[([\d\.:]+)\](.*)/
                let stringArray = item.match(regex)
                if (stringArray) {
                    let timestamp = stringArray[1]
                    let lyric = stringArray[2]

                    // 将时间戳转化为秒数
                    let parts = timestamp.split(':')
                    let minutes = parseFloat(parts[0])
                    let seconds = parseFloat(parts[1])
                    let totalSeconds = minutes * 60 + seconds

                    $p.text(lyric)
                    $p.attr('data-time', totalSeconds)
                    this.$el.find('.lyric > .lines').append($p)
                } else {
                    $p.text(item)
                }
            })
            this.$el.find('.lyric > .lines').append(array)
        }
        ,
        // 展示歌词
        // 找到当前播放时间对应的歌词

        showLyric
            (songCurrentTime) {

            let allLyrics = this.$el.find('.lyric>.lines>p')
            let currentLyric

            for (let i = 0; i < allLyrics.length; i++) {
                // 迭代到最后一行的时候(播放到最后一行歌词之后), 始终显示最后一页
                if (i === allLyrics.length - 1) {
                    console.log('这是最后一行歌词')
                    currentLyric = allLyrics[i]
                }
                else {
                    // 获取当前歌词和下一条歌词的 $() 对象
                    currentLyricTime = $(allLyrics[i]).attr('data-time')

                    nextLyricTime = $(allLyrics[i + 1]).attr('data-time')

                    if (currentLyricTime <= songCurrentTime && songCurrentTime < nextLyricTime) {
                        currentLyric = allLyrics[i]
                        break
                    }
                }
            }

            //进行位移
            let height = currentLyric.offsetTop
            this.$el.find('.lyric>.lines').css({transform: `translateY( ${-height + 24}px)`})
            $(currentLyric).addClass('active').siblings().removeClass('active')

        }
        ,
        // 歌曲的播放和暂停
        play() {
            this.$el.find('.disc-container').addClass('playing')
            return this.$el.find('audio')[0].play()
        }
        ,
        pause() {
            this.$el.find('.disc-container').removeClass('playing')
            this.$el.find('audio')[0].pause()
        }
    }

    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: '',
                cover: ''
            },
            status: 'paused'
        },
        getSongIdFromUrl() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substr(1)
            }
            search = search.split("&").filter(v => v)  //如果 v 非空(falsy值) , 就通过filter, 避免查询参数中出现 && 的情况
            let songId = '' // 为 songId 定义一个初始值

            // 解析每一对键值对
            let queryObjs = search.map((item) => {
                let keyValueArray = item.split('=')
                if (keyValueArray[0] === 'id') {
                    songId = keyValueArray[1]
                }
            })
            return songId
        }
        ,
        // getSongData songData
        getSongData(songId) {
            var query = new AV.Query('Song')
            return query.get(songId).then((song) => {
                Object.assign(this.data.song, {id: songId, ...song.attributes})
            })
        }
    }

    let controller = {
        init() {
            this.view = view
            this.view.init()
            this.model = model
            let songId = this.model.getSongIdFromUrl()
            this.model.getSongData(songId).then(() => {
                this.view.render(this.model.data.song)
            })
            this.bindEvents()
        },
        bindEvents() {

            function playPause() {

                if (this.model.data.status === 'paused') {
                    this.view.play()
                        .then(
                            () => {
                                this.model.data.status = 'playing'
                                this.view.$el.find('.icon-play').css({display: 'none'})
                            }
                        )
                } else if (this.model.data.status === 'playing') {
                    this.view.pause()
                    this.model.data.status = 'paused'
                    this.view.$el.find('.icon-play').css({display: 'block'})
                }

            }

            // 全局的点击事件监听, 实现歌曲的播放暂停, 已经相应的动画
            if (document.body.ontouchstart !== undefined) {
                //使用触摸事件处理器.
                $(this.view.el).on('touchstart', () => {
                    playPause.call(controller)
                })

            } else {
                //使用鼠标事件处理器.
                $(this.view.el).on('click', () => {
                    playPause.call(controller)
                })

            }

        }
    }

    controller.init()
}
