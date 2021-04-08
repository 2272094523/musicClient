<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="medium" @click="insertDialogVisible=true">添加歌手</el-button>
                <el-button type="danger" size="medium" @click="delAllRow" >批量删除</el-button>
                <el-input placeholder="搜索歌手(名字)" clearable
                          style="width: 200px;margin-left: 40px; display:inline-block" v-model="fuzzyName"></el-input>
            </div>
        </div>
        <el-table size="mini" border style="width: 100%" height="700px" :data="data" @selection-change="handleSelectionDelete">
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column label="歌手图片" width="110px" align="center">
                <template slot-scope="scope">
                    <div class="singer-img">
                        <img :src="getImgUrl(scope.row.singer_img)" style="width: 100%">
                    </div>
                    <el-upload :action="updateSingerImg(scope.row.singer_id)" :on-success="uploadSuccess"
                               :before-upload="beforeUpload">
                        <el-button size="mini">上传</el-button>
                    </el-upload>
                </template>
            </el-table-column>

            <el-table-column prop="singer_name" width="120px" align="center" label="歌手"></el-table-column>
            <el-table-column prop="singer_sex" label="性别" align="center" width="50px"></el-table-column>
            <el-table-column prop="singer_birth" label="生日" align="center" width="100px">
                <template slot-scope="scope">{{changeTimeFormat(scope.row.singer_birth)}}</template>
            </el-table-column>
            <el-table-column prop="singer_location" label="地区" align="center" width="150px"></el-table-column>
            <el-table-column prop="singer_introduction" label="简介">
                <template slot-scope="scope">
                    <p style="height: 100px;overflow: scroll">{{scope.row.singer_introduction}}</p>
                </template>
            </el-table-column>
            <el-table-column label="歌曲" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="songEdit(scope.row.singer_id,scope.row.singer_name)">歌曲管理</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="changeSinger(scope.row)" type="primary">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column label="删除" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" @click="handleDelete(scope.row.singer_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageNation">
            <el-pagination background layout="total,prev,pager,next"
                :current-page="currentPage" :total="ListSinger.length" :page-size="pageSize" @current-change="getCurrentPageData"></el-pagination>
        </div>
        <el-dialog title="添加歌手" :visible.sync="insertDialogVisible" width="400px" center>
            <el-form :model="addSinger" ref="addSingerForm" label-width="80px" :rules="formRules">
                <el-form-item prop="Singer_name" label="歌手名" size="mini">
                    <el-input v-model="addSinger.Singer_name" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini" prop="Singer_sex">
                    <el-radio-group v-model="addSinger.Singer_sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="Singer_birth" label="生日" size="mini">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addSinger.Singer_birth"
                                    style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="Singer_location" label="地区" size="mini">
                    <el-input v-model="addSinger.Singer_location" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="Singer_introduction" label="简介" size="mini">
                    <el-input v-model="addSinger.Singer_introduction" placeholder="个人介绍" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="insertDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="insertSingerPage('addSingerForm')">增加</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="400px" center>
            <el-form :model="editSinger" ref="editSingerForm" label-width="80px" :rules="formRules">
                <el-form-item prop="Singer_id" label="歌手id" size="mini">
                    <el-input v-model="editSinger.Singer_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item prop="Singer_name" label="歌手名" size="mini">
                    <el-input v-model="editSinger.Singer_name" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini" prop="Singer_sex">
                    <el-radio-group v-model="editSinger.Singer_sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="Singer_birth" label="生日" size="mini">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editSinger.Singer_birth"
                                    style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="Singer_location" label="地区" size="mini">
                    <el-input v-model="editSinger.Singer_location" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="Singer_introduction" label="简介" size="mini">
                    <el-input v-model="editSinger.Singer_introduction" placeholder="个人介绍" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="editSingerPage('editSingerForm')">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog title="删除歌手" :visible.sync="delDialogVisible" width="300px" center>
            <div align="center">是否确认删除歌手，该操作不可恢复</div>
            <span slot="footer">
                <el-button size="mini" @click="delDialogVisible=false">取消</el-button>
                <el-button type="danger" size="mini" @click="delRow()">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import {insertSinger, selectAllSinger,editSinger,deleteSinger} from '../api'
  import {mixin} from '../mixins'

  export default {
    mixins: [mixin],
    name: 'SingerPage',
    data () {
      return {
        //添加弹窗显示
        insertDialogVisible: false,
        //编辑弹窗显示
        editDialogVisible:false,
        //删除痰喘提示
        delDialogVisible:false,
        addSinger: {
          Singer_name: '',
          Singer_sex: '',
          Singer_birth: '',
          Singer_location: '',
          Singer_introduction: '',
          Singer_img: '',
        },
        editSinger:{
          Singer_id:'',
          Singer_name: '',
          Singer_sex: '',
          Singer_birth: '',
          Singer_location: '',
          Singer_introduction: '',
          Singer_img: '',
        },
        formRules: {
          Singer_name: [
            {required: true, message: '请输入歌手名', trigger: 'blur'},
            {min: 1, max: 10, message: '名字在10个字符以内', trigger: 'blur'},
          ],
          Singer_sex: [
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
          Singer_birth: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ],
          Singer_location: [
            {required: true, message: '请输入地区', trigger: 'blur'}
          ],
          Singer_introduction: [
            {required: true, message: '请输入简介', trigger: 'blur'},
            {min: 1, max: 100, message: '简介不得超过100个字符', trigger: 'change'}
          ]
        },
        ListSinger: [],//根据全部中的名字匹配将符合的放入到table展示，为空默认展示全部
        tempList: [],//查询全部
        fuzzyName: '',//名字查询
        pageSize: 5,
        currentPage: 1,
        multipleSelection:[],//哪行已经打勾，批量删除

      }
    },
    computed: {
      //计算当前搜索表里的数据
      data () {
        return this.ListSinger.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
      }
    },
    methods: {
      insertSingerPage (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let temp = this.addSinger.Singer_birth
            let birth = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
            let params = new URLSearchParams()
            params.append('Singer_name', this.addSinger.Singer_name)
            params.append('Singer_sex', this.addSinger.Singer_sex)
            params.append('Singer_location', this.addSinger.Singer_location)
            params.append('Singer_introduction', this.addSinger.Singer_introduction)
            params.append('Singer_birth', birth)
            params.append('Singer_img', '/singerImg/init.png')
            insertSinger(params).then(res => {
              if (res.data.code == 200) {
                this.notify('添加歌手成功', 'success')
              } else {
                this.notify('添加歌手失败', 'error')
              }
            }).catch(err => {
              alert(err)
            }).finally(()=>{
              this.insertDialogVisible = false
              this.selectAll();
            })

          } else {
            this.notify('请将歌手信息填写完整', 'error')
          }
        })
      },
      selectAll () {
        this.ListSinger = []
        this.tempList = []
        selectAllSinger().then(res => {
          this.ListSinger = res.data.data
          this.tempList = res.data.data
        })
      },
      updateSingerImg (Singer_id) {
        return `${this.$store.state.Host}/singer/updateSingerImg?Singer_id=${Singer_id}`
      },
      getCurrentPageData(currentPage){
        this.currentPage=currentPage;
      },
      //弹出编辑页面
      changeSinger(row){
        this.editDialogVisible=true;
        this.editSinger={
          Singer_id:row.singer_id,
          Singer_name:row.singer_name,
          Singer_sex:row.singer_sex,
          Singer_birth:row.singer_birth,
          Singer_location:row.singer_location,
          Singer_introduction:row.singer_introduction,
        };
      },
      //保存编辑页面修改的数据，传输到后端
      editSingerPage(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            let temp = new Date(this.editSinger.Singer_birth);
            let birth = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
            let params = new URLSearchParams();
            params.append("Singer_id",this.editSinger.Singer_id);
            params.append('Singer_name', this.editSinger.Singer_name);
            params.append('Singer_sex', this.editSinger.Singer_sex);
            params.append('Singer_location', this.editSinger.Singer_location);
            params.append('Singer_introduction', this.editSinger.Singer_introduction);
            params.append('Singer_birth', birth),
            editSinger(params).then(res => {
              if (res.data.code == 200) {
                this.notify('修改成功', 'success')
              } else {
                this.notify('修改失败', 'error')
              }
            }).catch(err => {
              this.notify("服务器错误，修改失败，请报告管理员（Vx:13612413078）","error")
            })

            this.editDialogVisible = false
            location.reload();

          } else {
            this.notify('请将歌手信息填写完整', 'error')
          }
        })

      },
      delRow(){
        let params=new URLSearchParams();
        params.append("Singer_id",this.delId);
        deleteSinger(params).then(res=>{
          if (res.data.code==200){
            this.notify("删除成功","success");
          }else{
            this.notify("删除失败",`error`);
          }
        }).catch(err=>{
          this.notify("删除失败，服务器内部错误，请联系管理员（VX:13612413078）")
        }).finally(()=>{
          this.delId='';
          this.delDialogVisible=false;
          this.selectAll();
        })
      },
      delAllRow(){
        if (this.multipleSelection==''){
          this.notify("请选择需要删除的歌手",'warning')
        }else{
          this.$confirm("确认删除歌手？警告：该操作一旦执行不可恢复","提示",{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            for (let item of this.multipleSelection){
              this.delId=item.singer_id;
              this.delRow();
            }
          }).catch(()=>{
            this.$message({
              type:'info',
              message:'已取消删除'
            })
          })
        }
      },
      songEdit(singer_id,singer_name){
        this.$router.push({path:`/Song`,query:{singer_id,singer_name}})
      }
    },
    created () {
      this.selectAll()
    },
    watch: {
      fuzzyName: function () {
        if (this.fuzzyName == '') {
          this.ListSinger = this.tempList
        } else {
          this.ListSinger = []
          for (let item of this.tempList) {
            if (item.singer_name.includes(this.fuzzyName)) {
              this.ListSinger.push(item)
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

    .singer-img {
        width: 100%;
        height: 80px;
        border-radius: 5px;
        margin-bottom: 5px;
        overflow: hidden;
    }
    .pageNation{
        display: flex;
        justify-content: center;
    }
</style>
