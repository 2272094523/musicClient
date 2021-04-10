<template>
  <div>
    aaa
  </div>
</template>

<script>
  import {selectSongOfListSong} from '../api/index'
  import {mixin} from '../mixins'
  export default {
    name: "ListSong",
    data(){
      return{
        songListId:'',
      }
    },
    methods:{
      selectAll(songListId){
        selectSongOfListSong(this.$route.query.songListId).then(res => {
          if (res.status.code==200){
            this.$message.success(res.status.msg)
          }else{
            this.$message.error(res.status.msg)
          }
        }).catch(()=>{
          this.$message.error("服务器内部错误")
        })
      },
    },
    created() {
      this.songListId=this.$route.query(songList_id);
      this.selectAll(this.songListId);
    }
  }
</script>

<style scoped>

</style>
