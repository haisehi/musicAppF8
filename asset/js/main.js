/*
1.render songs -> ok
2.scroll top -> ok
3.play /pause /seek -> ok
4.cd rotate -> ok
5.next / previous -> ok
6.random -> ok
7.next / repeat when ended -> ok
8.active song -> ok
9.scroll active song into view -> ok
10.play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')

const playlist = $('.playlist')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('#progress')
const player =$('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-toggle-play')
const app = {
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    //danh sách bài hát
    songs : [
        {
            name: 'Any song',
            singer:'Zico',
            path:'./asset/music/AnySong.mp3',
            image: './asset/img/anysong.jpg'
        },
        {
            name: 'Ditto',
            singer:'NewJeans',
            path:'./asset/music/Ditto-NewJeans.mp3',
            image: './asset/img/ditto.jpg'
        },
        {
            name: 'Dù cho mai về sau',
            singer:'Bùi Trương Linh',
            path:'./asset/music/DuChoMaiVeSau-buitruonglinh-6818907.mp3',
            image: './asset/img/duchomaivesau.jpg'
        },
        {
            name: 'OMG',
            singer:'NewJeans',
            path:'./asset/music/Omg-NewJeans-8497239.mp3',
            image: './asset/img/OMG.jpg'
        },
        {
            name: 'Pink Venom',
            singer:'BlackPink',
            path:'./asset/music/PinkVenom-BLACKPINK-7802564.mp3',
            image: './asset/img/pinkVenom.jpg'
        },
        {
            name: 'Solo',
            singer:'Jennie',
            path:'./asset/music/Solo-JennieBlackPink-5738971.mp3',
            image: './asset/img/Solo.png'
        },
        {
            name: 'Yêu anh đi mẹ anh bán bánh mì',
            singer:'zico',
            path:'./asset/music/YeuAnhDiMeAnhBanBanhMi-PhucDu-8698703.mp3',
            image: './asset/img/yeu-anh-di-me-anh-ban-banh-my.jpg'
        },
    ],
    //hiển thị bài hát ở playlist
    render:function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' :""}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    //
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    //
    handleEvent:function(){
        const cdWidth = cd.offsetWidth
        const _this = this
        //xử lý cd quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],
        {
            duration:10000, //10s
            iterations:Infinity,
        })
        // console.log([cdThumbAnimate])
        cdThumbAnimate.pause()


        //xử lý phóng to hoặc thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth>0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                _this.isPlaying =false
                audio.pause()
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }else{
                _this.isPlaying =true
                audio.play()
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            // if(audio.paused){
            //     audio.play()
            //     player.classList.add('playing')
            //     cdThumbAnimate.play()
            // }else{
            //     audio.pause()
            //     player.classList.remove('playing')
            //     cdThumbAnimate.pause()
            // }
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //xử lý khi tua xong
        progress.onchange = function(e){
            const seekTime = audio.duration / 100* e.target.value
            audio.currentTime = seekTime
        }
        //khi next bài hát
        nextBtn.onclick =function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.NextSong()
                audio.play()
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            _this.render()
            _this.ScrollToActiveSong()
        }
        //khi prev bài hát
        prevBtn.onclick =function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
                audio.play()
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            _this.render()
            _this.ScrollToActiveSong()
        }
        //khi random bài hát
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        //xử lý phát lại lời bài hát
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
            
        }
        //xử lý next song khi audio ended
        audio.onended =function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        //lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songElement = e.target.closest('.song:not(.active)')
            if(songElement || e.target.closest('.option')){
                // console.log(e.target)
                //xử lý khi click vào song
                if(songElement){
                    // console.log(songElement.dataset.index)
                    _this.currentIndex = Number(songElement.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    player.classList.add('playing')
                    cdThumbAnimate.play()
                }
            }
        }
    },
    loadCurrentSong:function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        // console.log(heading,cdThumb,audio)
    },
    NextSong:function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong:function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong:function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    ScrollToActiveSong:function(){
        if(this.nextBtn){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior:'smooth',
                    block:'nearest',
                })
            },300)
        }else{
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior:'smooth',
                    block:'end',
                })
            },300)
        }
    },
    start:function(){
        //định nghĩa các thuộc tính cho object
        this.defineProperties()
        //Lắng nghe / xử lý các sự kiện (DOM event)
        this.handleEvent()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        //render playlist
        this.render()
    }
}
app.start()
