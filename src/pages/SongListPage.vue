<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="medium" @click="insertDialogVisible=true">添加歌单</el-button>
        <el-button type="danger" size="medium" @click="delAllRow">批量删除</el-button>
        <el-input placeholder="搜索歌单(名字或者风格)" clearable
                  style="width: 200px;margin-left: 40px; display:inline-block" v-model="fuzzyName"></el-input>

      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="700px" :data="data"
              @selection-change="handleSelectionDelete">
      <el-table-column type="selection" width="40px"></el-table-column>
      <el-table-column label="图片" width="110px" align="center">
        <template slot-scope="scope">
          <div class="songList-img">
            <img :src="getImgUrl(scope.row.songList_img)" style="width: 100%">
          </div>
          <el-upload :action="updateSongListImg(scope.row.songList_id)" :on-success="uploadSuccess"
                     :before-upload="beforeUpload">
            <el-button size="mini">上传</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="songList_title" width="120px" align="center" label="名字"></el-table-column>
      <el-table-column prop="songList_introduction" label="简介">
        <template slot-scope="scope">
          <p style="height: 100px;overflow: scroll">{{scope.row.songList_introduction}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="songList_style" width="120px" align="center" label="风格"></el-table-column>
      <el-table-column label="查看歌曲" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="medium" @click="songListEdit(scope.row.songList_id)">歌曲管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="歌单信息" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="medium" @click="changeSongList(scope.row)" type="primary">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.row.songList_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNation">
      <el-pagination background layout="total,prev,pager,next"
                     :current-page="currentPage" :total="myList.length" :page-size="pageSize"
                     @current-change="getCurrentPageData"></el-pagination>
    </div>
    <el-dialog title="添加歌单" :visible.sync="insertDialogVisible" width="400px" center>
      <el-form :model="addSongList" ref="addSongListForm" label-width="80px" :rules="formRules">
        <el-form-item prop="songList_title" label="名字" size="mini">
          <el-input v-model="addSongList.songList_title" placeholder="歌单名字"></el-input>
        </el-form-item>
        <el-form-item prop="songList_style" label="风格" size="mini">
          <el-input v-model="addSongList.songList_style" placeholder="歌单风格"></el-input>
        </el-form-item>
        <el-form-item prop="songList_introduction" label="简介" size="mini">
          <el-input v-model="addSongList.songList_introduction" placeholder="歌单介绍" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button size="mini" @click="insertDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="insertSongListPage('addSongListForm')">增加</el-button>
            </span>
    </el-dialog>
    <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="400px" center>
      <el-form :model="editSongList" ref="editSongListForm" label-width="80px" :rules="formRules">
        <el-form-item prop="songList_id" label="Id" size="mini">
          <el-input v-model="editSongList.songList_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="songList_title" label="名字" size="mini">
          <el-input v-model="editSongList.songList_title" placeholder="歌单名字"></el-input>
        </el-form-item>

        <el-form-item prop="songList_style" label="风格" size="mini">
          <el-input v-model="editSongList.songList_style" placeholder="歌单风格"></el-input>
        </el-form-item>
        <el-form-item prop="songList_introduction" label="简介" size="mini">
          <el-input v-model="editSongList.songList_introduction" placeholder="歌单介绍" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button size="mini" @click="editDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="editSongListPage('editSongListForm')">保存</el-button>
            </span>
    </el-dialog>
    <el-dialog title="删除歌单" :visible.sync="delDialogVisible" width="300px" center>
      <div align="center">是否确认删除该歌单，该操作不可恢复</div>
      <span slot="footer">
                <el-button size="mini" @click="delDialogVisible=false">取消</el-button>
                <el-button type="danger" size="mini" @click="delRow()">确认</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import {insertSongList, selectAllSongList, updateSongList, deleteSongList} from '../api'
import {mixin} from '../mixins'

export default {
  mixins: [mixin],
  name: 'SongListPage',
  data () {
    return {
      // 添加弹窗显示
      insertDialogVisible: false,
      // 编辑弹窗显示
      editDialogVisible: false,
      // 删除弹窗提示
      delDialogVisible: false,
      addSongList: {
        songList_title: '',
        songList_style: '',
        songList_introduction: ''
      },
      editSongList: {
        songList_id: '',
        songList_title: '',
        songList_style: '',
        songList_introduction: ''
      },
      formRules: {
        songList_title: [
          {required: true, message: '请输入歌单名字', trigger: 'blur'},
          {min: 1, max: 10, message: '歌单名字过长', trigger: 'change'}
        ],
        songList_style: [
          {required: true, message: '请输入歌单风格', trigger: 'blur'},
          {min: 1, max: 10, message: '歌单风格过长', trigger: 'change'}
        ],
        songList_introduction: [
          {required: true, message: '请输入歌单介绍', trigger: 'blur'}
        ]

      },
      myList: [], // 根据全部中的名字匹配将符合的放入到table展示，为空默认展示全部
      tempList: [], // 查询全部
      fuzzyName: '', // 名字查询
      pageSize: 5,
      currentPage: 1,
      multipleSelection: [], // 哪行已经打勾，批量删除
      delId: ''// 删除id

    }
  },
  computed: {
    // 计算当前搜索表里的数据
    data () {
      return this.myList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },

  methods: {
    insertSongListPage (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('SongList_title', this.addSongList.songList_title)
          params.append('SongList_style', this.addSongList.songList_style)
          params.append('SongList_introduction', this.addSongList.songList_introduction)
          params.append('SongList_img', '/songListImg/init.jpg')
          insertSongList(params).then(res => {
            if (res.data.code === 200) {
              this.notify(res.data.msg, 'success')
            } else {
              this.notify(res .data.msg, 'error')
            }
          }).catch(err => {
            alert(err)
          }).finally(() => {
            this.insertDialogVisible = false
            this.selectAll()
          })
        } else {
          this.notify('请将歌单信息补充完整', 'info')
        }
      })
    },
    selectAll () {
      this.myList = []
      this.tempList = []
      selectAllSongList().then(res => {
        this.myList = res.data.data
        this.tempList = res.data.data
      })
    },
    updateSongListImg (SongList_id) {
      return `${this.$store.state.Host}/songlist/updateSongListImg?SongList_id=${SongList_id}`
    },
    getCurrentPageData (currentPage) {
      this.currentPage = currentPage
    },
    // 弹出编辑页面
    changeSongList (row) {
      this.editDialogVisible = true
      this.editSongList = {
        songList_id: row.songList_id,
        songList_title: row.songList_title,
        songList_style: row.songList_style,
        songList_introduction: row.songList_introduction
      }
    },
    // 保存编辑页面修改的数据，传输到后端
    editSongListPage (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('SongList_id', this.editSongList.songList_id)
          params.append('SongList_title', this.editSongList.songList_title)
          params.append('SongList_introduction', this.editSongList.songList_introduction)
          params.append('SongList_style', this.editSongList.songList_style)
          updateSongList(params).then(res => {
            if (res.data.code == 200) {
              this.notify('修改成功', 'success')
            } else {
              this.notify('修改失败', 'error')
            }
          }).catch(err => {
            this.notify('服务器错误，修改失败，请报告管理员（Vx:13612413078）', 'error')
          })
          this.editDialogVisible = false
          location.reload()
        } else {
          this.notify('请将歌手信息填写完整', 'error')
        }
      })
    },
    delRow () {
      let params = new URLSearchParams()
      params.append('SongList_id', this.delId)
      deleteSongList(params).then(res => {
        if (res.data.code == 200) {
          this.notify('删除成功', 'success')
        } else {
          this.notify('删除失败', `error`)
        }
      }).catch(err => {
        this.notify('删除失败，服务器内部错误，请联系管理员（VX:13612413078）')
      }).finally(() => {
        this.delId = ''
        this.delDialogVisible = false
        this.selectAll()
      })
    },
    delAllRow () {
      if (this.multipleSelection == '') {
        this.notify('请选择需要删除的歌单', 'warning')
      } else {
        this.$confirm('确认删除选中歌单？警告：该操作一旦执行不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let item of this.multipleSelection) {
            this.delId = item.songList_id
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
    songEdit (singer_id, singer_name) {
      this.$router.push({path: `/Song`, query: {singer_id, singer_name}})
    }
  },
  created () {
    this.selectAll()
  },
  watch: {
    fuzzyName: function () {
      if (this.fuzzyName == '') {
        this.myList = this.tempList
      } else {
        this.myList = []
        for (let item of this.tempList) {
          if (item.songList_title.includes(this.fuzzyName)) {
            this.myList.push(item)
          }
        }
      }
    }
  }
}
</script>

<style scoped>

  .handle-box {
    margin-bottom: 20px;
  }

  .songList-img {
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
</style>
