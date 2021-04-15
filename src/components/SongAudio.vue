<template>
    <div class="song-audio">
        <audio id="player" :src="url" controls="controls" preload="true" @canplay="startPlay" @ended="ended">
        </audio>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'SongAudio',
    methods: {
      startPlay () {
        let player = document.querySelector('#player')
        //开始播放
        player.play()
      },
      //结束播放
      ended () {
        this.isPlay=false;

      },
      //开始，暂停
      togglePlay(){
        let player=document.querySelector('#player');
        if (this.isPlay){
          player.play();
        }else{
          player.pause();
        }
      }
    },
    computed:{
      ...mapGetters([
        'id',
        'url',
        'isPlay',
      ])
    },
    watch:{
      //监听播放还是暂停
      isPlay:function(){
        this.togglePlay();
      }
    }
  }
</script>

<style>


    .song-audio {
        display: none;

    }
</style>
