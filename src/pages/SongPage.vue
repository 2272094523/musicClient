<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>歌曲信息
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="medium" @click="insertDialogVisible=true">添加歌曲</el-button>
        <el-button type="danger" size="medium" @click="delAllRow">批量删除</el-button>
        <el-input placeholder="搜索歌曲" clearable
                  style="width: 200px;margin-left: 40px; display:inline-block" v-model="fuzzyName"></el-input>
      </div>
      <div>
        当前歌手：{{this.$route.query.singer_name}}
      </div>
    </div>

    <el-table size="mini" border style="width: 100%" height="700px" :data="data"
              @selection-change="handleSelectionDelete">
      <el-table-column type="selection" width="40px"></el-table-column>
      <el-table-column label="歌曲图片" width="110px" align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getImgUrl(scope.row.song_img)" style="width: 100%">
          </div>
          <div class="play" @click="setSongUrl(scope.row.song_url,scope.row.name)">
            <div v-if="toggle == scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-zanting"></use>
              </svg>
            </div>
            <div v-if="toggle !== scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-bofanganniu"></use>
              </svg>
            </div>
          </div>
          <el-upload :action="uploadSongImg(scope.row.song_id)" :on-success="uploadSuccess"
                     :before-upload="beforeUpload">
            <el-button size="mini">上传</el-button>
          </el-upload>
        </template>
      </el-table-column>

      <el-table-column prop="song_name" width="120px" align="center" label="歌名"></el-table-column>
      <el-table-column prop="singer.singer_name" label="唱作者" align="center" width="100px"></el-table-column>
      <el-table-column prop="song_createTime" label="添加日期" align="center" width="150px">
        <template slot-scope="scope">{{changeTimeFormat(scope.row.song_createTime)}}</template>
      </el-table-column>
      <el-table-column prop="song_updateTime" label="最后一次修改日期" align="center" width="150px">
        <template slot-scope="scope">{{changeTimeFormat(scope.row.song_updateTime)}}</template>
      </el-table-column>
      <el-table-column prop="song_introduction" label="专辑" align="center" width="150px"></el-table-column>
      <el-table-column prop="song_lyric" label="歌词" align="center">
        <template slot-scope="scope">
          <ul style="height: 100px;overflow: scroll">
            <li v-for="(item,index) in changeLyricFormat(scope.row.song_lyric)" :key="index">
              {{item}}
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="信息操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="changeSong(scope.row)" type="primary">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="文件操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-upload :action="uploadSongFile(scope.row.song_id)" :on-success="uploadFileSuccess"
                     :before-upload="beforeUploadFile">
            <el-button size="mini" type="danger">更改文件</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.row.song_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNation">
      <el-pagination background layout="total,prev,pager,next"
                     :current-page="currentPage" :total="ListSong.length" :page-size="pageSize"
                     @current-change="getCurrentPageData"></el-pagination>
    </div>
    <el-dialog title="添加歌曲(文件格式名为 歌手 - 歌名.mp3)" :visible.sync="insertDialogVisible" width="400px" center>
      <el-form :model="addSong" ref="addSongForm" label-width="100px" :rules="formRules">
        <el-form-item prop="song_name" label="歌名" size="mini">
          <el-input v-model="addSong.song_name" placeholder="歌名"></el-input>
        </el-form-item>
        <el-form-item prop="song_singerName" label="唱作者" size="mini">
          <el-input v-model="this.$route.query.singer_name" disabled></el-input>
        </el-form-item>
        <el-form-item prop="song_introduction" label="专辑" size="mini">
          <el-input v-model="addSong.song_introduction" placeholder="专辑"></el-input>
        </el-form-item>
        <el-form-item prop="song_lyric" label="歌词">
          <el-input v-model="addSong.song_lyric" placeholder="歌词" type="textarea"></el-input>
        </el-form-item>
        <input type="file" @change="getFile($event)">
      </el-form>
      <span slot="footer">
                <el-button size="mini" @click="insertDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="insertSongPage('addSongForm',$event)">增加</el-button>
            </span>
    </el-dialog>
    <el-dialog title="编辑歌曲" :visible.sync="editDialogVisible" width="400px" center>
      <el-form :model="editSong" ref="editSongForm" label-width="80px" :rules="formRules">
        <el-form-item prop="song_id" label="歌曲Id" size="mini">
          <el-input v-model="editSong.song_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="song_name" label="歌名" size="mini">
          <el-input v-model="editSong.song_name" placeholder="歌手名"></el-input>
        </el-form-item>
        <el-form-item prop="song_singerName" label="唱作者" size="mini">
          <el-input v-model="editSong.song_singerName" placeholder="唱作者" disabled></el-input>
        </el-form-item>
        <el-form-item prop="song_introduction" label="专辑" size="mini">
          <el-input v-model="editSong.song_introduction" placeholder="专辑"></el-input>
        </el-form-item>
        <el-form-item prop="song_lyric" label="歌词">
          <el-input v-model="editSong.song_lyric" placeholder="歌词" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button size="mini" @click="editDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="editSongPage('editSongForm')">保存</el-button>
            </span>
    </el-dialog>
    <el-dialog title="删除歌曲" :visible.sync="delDialogVisible" width="300px" center>
      <div align="center">是否确认删除歌曲，该操作不可恢复</div>
      <span slot="footer">
                <el-button size="mini" @click="delDialogVisible=false">取消</el-button>
                <el-button type="danger" size="mini" @click="delRow()">确认</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mixin} from '../mixins'
  import {mapGetters} from 'vuex'
  import '@/assets/js/iconfont.js'
  import {selectAllSongBySingerId, insertSong, updateSong, deleteSong} from '../api'


  export default {
    mixins: [mixin],
    name: 'SongPage',
    data() {
      return {
        //添加弹窗显示
        insertDialogVisible: false,
        //编辑弹窗显示
        editDialogVisible: false,
        //删除弹窗提示
        delDialogVisible: false,
        addSong: {
          song_name: '',
          song_singerName: '',
          song_introduction: '',
          song_lyric: '',
        },
        editSong: {
          song_name: '',
          song_singerName: '',
          song_introduction: '',
          song_lyric: '',
          song_id: ''
        },
        formRules: {
          song_name: [
            {required: true, message: '请输入歌曲名', trigger: 'blur'},
            {min: 1, max: 20, message: '歌曲名不能超过20个字符', trigger: 'change'}
          ],
          song_introduction: [
            {required: true, message: '请输入歌曲所属专辑', trigger: 'blur'},
            {min: 1, max: 20, message: '专辑不能超过20个字符', trigger: 'change'}
          ],
        },
        ListSong: [],//根据全部中的名字匹配将符合的放入到table展示，为空默认展示全部
        tempList: [],//查询全部
        fuzzyName: '',//名字查询
        pageSize: 5,
        currentPage: 1,
        multipleSelection: [],//哪行已经打勾，批量删除
        file: '',
        delId: '',
        toggle: false,//播放器的图标显示状态
      }
    },
    computed: {
      //计算当前搜索表里的数据
      data() {
        return this.ListSong.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },
      ...mapGetters([
        'isPlay',
      ])
    },

    methods: {
      getFile(event) {
        this.file = event.target.files[0]
      },
      insertSongPage(formName, event) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            event.preventDefault()
            if (this.file === '') {
              this.notify('请选择上传文件', 'info')
              return
            }
            let fileName = this.file.name
            fileName = fileName.substring(fileName.lastIndexOf('.') + 1)
            if (fileName !== 'mp3') {
              this.notify('文件格式错误，只能为mp3格式')
              return
            }
            let params = new FormData()
            params.append('Song_name', this.addSong.song_name)
            params.append('Singer.Singer_id', this.$route.query.singer_id)
            params.append('Song_introduction', this.addSong.song_introduction)
            if (this.addSong.song_lyric == '') {
              this.addSong.song_lyric = '[00.00.00]暂无歌词'
            }
            params.append('Song_lyric', this.addSong.song_lyric)
            params.append('file', this.file)
            insertSong(params).then(res => {
              if (res.data.code == 200) {
                this.notify(res.data.msg, 'success')
              } else {
                this.notify(res.data.msg, 'error')
              }
            }).finally(() => {
              this.insertDialogVisible = false
              this.selectAll()
            })
          } else {
            this.notify('请将歌手信息补充完整', 'warning')
          }
        })
      },
      selectAll() {
        this.tempList = []
        this.ListSong = []
        selectAllSongBySingerId(this.$route.query.singer_id).then(res => {
          if (res.data.code == 200) {
            this.tempList = this.ListSong = res.data.data
          }
        })
      },
      uploadSongImg(song_id) {
        return `${this.$store.state.Host}/song/updateSongImg?Song_id=${song_id}`
      },
      uploadSongFile(song_id) {
        return `${this.$store.state.Host}/song/updateSongFile?Song_id=${song_id}`
      },
      getCurrentPageData(currentPage) {
        this.currentPage = currentPage
      },
      //弹出编辑页面
      changeSong(row) {
        this.editDialogVisible = true
        this.editSong = {
          song_id: row.song_id,
          song_name: row.song_name,
          song_singerName: row.song_singerName,
          song_introduction: row.song_introduction,
          song_lyric: row.song_lyric
        }
      },
      //保存编辑页面修改的数据，传输到后端
      editSongPage(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = new URLSearchParams()
            params.append('Song_id', this.editSong.song_id)
            params.append('Song_name', this.editSong.song_name)
            params.append('Song_introduction', this.editSong.song_introduction)
            if (this.editSong.song_lyric == '') {
              this.editSong.song_lyric = '[00:00:00]暂无歌词'
            }
            params.append('Song_lyric', this.editSong.song_lyric)
            updateSong(params).then(res => {
              if (res.data.code == 200) {
                this.notify(res.data.msg, 'success')
                return
              }
              this.notify(res.data.msg, 'error')
            }).catch((err) => {
              this.notify('删除失败，服务器内部错误，请联系管理员（VX:13612413078）', 'info')
            }).finally(() => {
              this.editDialogVisible = false
              this.selectAll()
            })
          } else {
            this.notify('请将歌曲信息补充完整', 'info')
          }
        })

      },
      delRow() {
        let params = new URLSearchParams()
        params.append('Song_id', this.delId)
        deleteSong(params).then(res => {
          if (res.data.code == 200) {
            this.notify(res.data.msg, 'success')
          } else {
            this.notify(res.data.msg, `error`)
          }
        }).catch(err => {
          this.notify('删除失败，服务器内部错误，请联系管理员（VX:13612413078）', 'info')
        }).finally(() => {
          this.delId = ''
          this.delDialogVisible = false
          this.selectAll()
        })
      },
      delAllRow() {
        if (this.multipleSelection == '') {
          this.notify('请选择需要删除的歌曲', 'warning')
        } else {
          this.$confirm('确认删除选中歌曲？警告：该操作一旦执行不可恢复', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (let item of this.multipleSelection) {
              this.delId = item.song_id
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
      changeLyricFormat(song_lyric) {
        let lines = song_lyric.split('\n')
        let pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g
        let result = []
        for (let item of lines) {
          let value = item.replace(pattern, '')
          result.push(value)
        }
        return result
      },
      setSongUrl(url, name) {
        this.toggle = name;
        this.$store.commit('setUrl', this.$store.state.Host + url);
        if (this.isPlay) {
          this.$store.commit('setIsPlay', false);
        } else {
          this.$store.commit('setIsPlay', true);
        }
      }
    },
    created() {
      this.selectAll()
    },

    watch: {
      fuzzyName: function () {
        if (this.fuzzyName == ' ') {
          this.ListSong = this.tempList
        } else {
          this.ListSong = []
          for (let item of this.tempList) {
            if (item.song_name.includes(this.fuzzyName)) {
              this.ListSong.push(item)
            }
          }
        }
      }
    },
    destroyed() {
      this.$store.commit('setIsPlay', false);
    }
  }
</script>

<style scoped>

  .handle-box {
    margin-bottom: 20px;
  }

  .song-img {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
  }

  .pageNation {
    display: flex;
    justify-content: center;
  }

  .play {
    position: absolute;
    z-index: 100;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    top: 18px;
    left: 18px;
  }

  .icon {
    width: 2em;
    height: 2em;
    color: #334256;
    fill: currentColor;
    overflow: hidden;
  }
</style>
