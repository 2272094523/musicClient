<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>歌曲信息
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="medium" @click="insertSongDialog">添加歌曲</el-button>
        <el-button type="danger" size="medium" @click="delAllRow">批量删除</el-button>
        <el-input placeholder="搜索歌曲" clearable
                  style="width: 200px;margin-left: 40px; display:inline-block" v-model="fuzzyName"></el-input>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="700px" :data="data"
              @selection-change="handleSelectionDelete">
      <el-table-column type="selection" width="40px"></el-table-column>
      <el-table-column label="歌曲图片" width="110px" align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getImgUrl(scope.row.songImg)" style="width: 100%">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="songName" width="120px" align="center" label="歌名"></el-table-column>
      <el-table-column prop="singer.singerName" label="唱作者" align="center" width="100px"></el-table-column>
      <el-table-column prop="songIntroduction" label="专辑" align="center" width="150px"></el-table-column>
      <el-table-column prop="songLyric" label="歌词" align="center">
        <template slot-scope="scope">
          <ul style="height: 100px;overflow: scroll">
            <li v-for="(item,index) in changeLyricFormat(scope.row.songLyric)" :key="index">
              {{item}}
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.row.songId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNation">
      <el-pagination background layout="total,prev,pager,next"
                     :current-page="currentPage" :total="list.length" :page-size="pageSize"
                     @current-change="getCurrentPageData"></el-pagination>
    </div>
    <el-dialog title="删除歌曲" :visible.sync="delDialogVisible" width="300px" center>
      <div align="center">是否确认删除该歌单中的歌曲，该操作不可恢复(歌曲文件不会被删除)</div>
      <span slot="footer">
                <el-button size="mini" @click="delDialogVisible=false">取消</el-button>
                <el-button type="danger" size="mini" @click="delRow()">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加歌曲到当前歌单" :visible.sync="insertDialogVisible"  width="650px" center>
      <el-button type="primary" @click="addAllRow">批量添加</el-button>
      <el-input placeholder="搜索歌曲" clearable
                style="width: 200px;margin-left: 40px; display:inline-block" v-model="anotherFuzzyName"></el-input>
      <br/>
      <el-table size="mini" border style="width:100%" height="600px" :data="data2"   @selection-change="handleSelectionAdd">
        <el-table-column type="selection" width="40px" ></el-table-column>
        <el-table-column prop="songId" width="80px" align="center" label="歌曲Id"></el-table-column>
        <el-table-column prop="songName" width="120px" align="center" label="歌名"></el-table-column>
        <el-table-column prop="singer.singerName" label="唱作者" align="center" width="100px"></el-table-column>
        <el-table-column prop="songIntroduction" label="专辑" align="center" width="160px"></el-table-column>
        <el-table-column label="添加" width="100%" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="insertSongToListSong(scope.row.songId)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageNation">
        <el-pagination background layout="total,prev,pager,next"
                       :current-page="anotherCurrentPage" :total="allList.length" :page-size="anotherPageSize"
                       @current-change="getAnotherCurrentPageData"></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mixin} from '../mixins'
  import {selectSongOfListSong,deleteSongFromListSong,selectSongNoInCurrentListSong,insertSongToCurrentList} from '../api/index'
  import {mapGetters} from 'vuex'
  export default {
    mixins:[mixin],
    name: "ListSong",
    data(){
      return{
        songListId:'',
        fuzzyName:'',
        list:[],
        tempList:[],
        allList:[],
        tempAllList:[],
        insertDialogVisible:false,
        delDialogVisible:false,
        currentPage:1,
        anotherCurrentPage:1,
        pageSize:5,
        anotherPageSize:12,
        delId: '',
        multipleSelection: [],//哪行已经打勾，批量删除
        anotherFuzzyName:'',
      }
    },
    computed:{
      data() {
        return this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },
      data2(){
        return this.allList.slice((this.anotherCurrentPage-1)*this.anotherPageSize,this.anotherCurrentPage*this.anotherPageSize)
      }
    },

    methods:{
      getCurrentPageData(currentPage) {
        this.currentPage = currentPage
      },
      getAnotherCurrentPageData(currentPage){
        this.anotherCurrentPage = currentPage;
      },
      selectAll(songListId){
        this.list=this.tempList=[];
        selectSongOfListSong(songListId).then(res => {
          if (res.data.code==200){
            this.list=this.tempList=res.data.data;
            console.log("selectAll"+this.list)
          }
        }).catch(err=>{
          this.$message.error("服务器错误，请联系管理员，vx:13612413078");
        })
      },
      delRow(){
        let params=new URLSearchParams()
        params.append('songId',this.delId)
        params.append('songListId',this.songListId)
        deleteSongFromListSong(params).then(res=>{
          if (res.data.code==200){
            this.$message.success("删除成功")
          }
        }).catch(err=>{
          this.$message.error("删除失败，服务器内部错误，请联系管理员，vx:13612413078")
        }).finally(()=>{
          this.delId=''
          this.delDialogVisible=false;
          this.selectAll(this.songListId)
        })
      },
      delAllRow(){
        if (this.multipleSelection.length==0) {
          this.notify('请选择需要删除的歌曲', 'warning')
        } else {
          this.$confirm('确认删除选中歌曲？警告：该操作一旦执行不可恢复', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (let item of this.multipleSelection) {
              this.delId = item.songId
              this.delRow()
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      changeLyricFormat(songLyric) {
        let lines = songLyric.split('\n')
        let pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g
        let result = []
        for (let item of lines) {
          let value = item.replace(pattern, '')
          result.push(value)
        }
        return result
      },
      insertSongDialog() {
        this.insertDialogVisible = true;
        selectSongNoInCurrentListSong(this.songListId).then(res => {
          if (res.data.code == 200) {
            this.allList = this.tempAllList = res.data.data;
          }
        }).catch(err => {
          this.$message.error("服务器内部错误，请联系管理员，vx:13612413078");
        })
      },
      insertSongToListSong(songId){
        let params=new URLSearchParams();
        params.append("songId",songId);
        params.append("songListId",this.songListId);
        insertSongToCurrentList(params).then(res => {
          if (res.data.code == 200) {
            this.$message.success("添加成功")
            selectSongNoInCurrentListSong(this.songListId).then(res2=>{
              this.allList=[],
              this.allList = this.tempAllList = res2.data.data;
            });
            this.selectAll(this.songListId);
          }
        }).catch(err=>{
          this.$message.error("服务器错误，请联系管理员,vx:13612413078")
        })
      },
      addAllRow(){
        if (this.multipleSelection.length==0){
          this.$message.info("请选择需要添加的歌曲");
        }else if (this.multipleSelection>10){
          this.$message.error("一次性最多添加10条歌曲")
        }else{
          for (let item of this.multipleSelection){
            this.insertSongToListSong(item.songId)
          }
        }
      }
    },
    watch:{
      fuzzyName:function () {
        this.list=mixin.methods.fuzzySelect(this.fuzzyName,this.list,this.tempList);
      },
      anotherFuzzyName:function () {
        this.allList=mixin.methods.fuzzySelect(this.anotherFuzzyName,this.allList,this.tempAllList)
      }
    },
    created() {
      this.songListId=this.$route.query.songListId;
      this.selectAll(this.songListId);
    },
  }
</script>

<style scoped>
  .pageNation {
    display: flex;
    justify-content: center;
  }

</style>
