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
                        <img :src="getImgUrl(scope.row.singerImg)" style="width: 100%">
                    </div>
                    <el-upload :action="updateSingerImg(scope.row.singerId)" :on-success="uploadSuccess"
                               :before-upload="beforeUpload">
                        <el-button size="mini">上传</el-button>
                    </el-upload>
                </template>
            </el-table-column>

            <el-table-column prop="singerName" width="120px" align="center" label="歌手"></el-table-column>
            <el-table-column prop="singerSex" label="性别" align="center" width="50px">
              <template slot-scope="scope">
                {{forMatSex(scope.row.singerSex)}}
              </template>
            </el-table-column>
            <el-table-column prop="singerBirth" label="生日" align="center" width="100px">
                <template slot-scope="scope">{{changeTimeFormat(scope.row.singerBirth)}}</template>
            </el-table-column>
            <el-table-column prop="singerLocation" label="地区" align="center" width="150px"></el-table-column>
            <el-table-column prop="singerIntroduction" label="简介">
                <template slot-scope="scope">
                    <p style="height: 100px;overflow: scroll">{{scope.row.singerIntroduction}}</p>
                </template>
            </el-table-column>
            <el-table-column label="歌曲" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="songEdit(scope.row.singerId,scope.row.singerName)">歌曲管理</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="changeSinger(scope.row)" type="primary">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column label="删除" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" @click="handleDelete(scope.row.singerId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageNation">
            <el-pagination background layout="total,prev,pager,next"
                :current-page="currentPage" :total="ListSinger.length" :page-size="pageSize" @current-change="getCurrentPageData"></el-pagination>
        </div>
        <el-dialog title="添加歌手" :visible.sync="insertDialogVisible" width="400px" center>
            <el-form :model="addSinger" ref="addSingerForm" label-width="80px" :rules="formRules">
                <el-form-item prop="singerName" label="歌手名" size="mini">
                    <el-input v-model="addSinger.singerName" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini" prop="singerSex">
                    <el-radio-group v-model="addSinger.singerSex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="2">组合</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="singerBirth" label="生日" size="mini">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addSinger.singerBirth"
                                    style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="singerLocation" label="地区" size="mini">
                    <el-input v-model="addSinger.singerLocation" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="singerIntroduction" label="歌手简介" size="mini">
                    <el-input v-model="addSinger.singerIntroduction" placeholder="个人介绍" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="insertDialogVisible=false">取消</el-button>
                <el-button size="mini" @click="insertSingerPage('addSingerForm')">增加</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="400px" center>
            <el-form :model="editSinger" ref="editSingerForm" label-width="80px" :rules="formRules">
                <el-form-item prop="singerId" label="歌手id" size="mini">
                    <el-input v-model="editSinger.singerId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item prop="singerName" label="歌手名" size="mini">
                    <el-input v-model="editSinger.singerName" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini" prop="singerSex">
                    <el-radio-group v-model="editSinger.singerSex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="2">组合</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="singerBirth" label="生日" size="mini">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editSinger.singerBirth"
                                    style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="singerLocation" label="地区" size="mini">
                    <el-input v-model="editSinger.singerLocation" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="singerIntroduction" label="简介" size="mini">
                    <el-input v-model="editSinger.singerIntroduction" placeholder="个人介绍" type="textarea"></el-input>
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
          singerName: '',
          singerSex: '',
          singerBirth: '',
          singerLocation: '',
          singerIntroduction: '',
          singerImg: '',
        },
        editSinger:{
          singerId:'',
          singerName: '',
          singerSex: '',
          singerBirth: '',
          singerLocation: '',
          singerIntroduction: '',
          singerImg: '',
        },
        formRules: {
          singerName: [
            {required: true, message: '请输入歌手名', trigger: 'blur'},
            {min: 1, max: 10, message: '名字在10个字符以内', trigger: 'blur'},
          ],
          singerSex: [
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
          singerBirth: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ],
          singerLocation: [
            {required: true, message: '请输入地区', trigger: 'blur'}
          ],
          singerIntroduction: [
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
            let temp = this.addSinger.singerBirth
            let birth = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
            let params = new URLSearchParams()
            params.append('singerName', this.addSinger.singerName)
            params.append('singerSex', this.addSinger.singerSex)
            params.append('singerLocation', this.addSinger.singerLocation)
            params.append('singerIntroduction', this.addSinger.singerIntroduction)
            params.append('singerBirth', birth)
            params.append('singerImg', '/singerImg/init.png')
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
      updateSingerImg (singerId) {
        return `${this.$store.state.Host}/singer/updateSingerImg?singerId=${singerId}`
      },
      getCurrentPageData(currentPage){
        this.currentPage=currentPage;
      },
      //弹出编辑页面
      changeSinger(row){
        this.editDialogVisible=true;
        this.editSinger={
          singerId:row.singerId,
          singerName:row.singerName,
          singerSex:row.singerSex,
          singerBirth:row.singerBirth,
          singerLocation:row.singerLocation,
          singerIntroduction:row.singerIntroduction,
        };
      },
      //保存编辑页面修改的数据，传输到后端
      editSingerPage(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            let temp = new Date(this.editSinger.singerBirth);
            let birth = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate()
            let params = new URLSearchParams();
            params.append("singerId",this.editSinger.singerId);
            params.append('singerName', this.editSinger.singerName);
            params.append('singerSex', this.editSinger.singerSex);
            params.append('singerLocation', this.editSinger.singerLocation);
            params.append('singerIntroduction', this.editSinger.singerIntroduction);
            params.append('singerBirth', birth),
            editSinger(params).then(res => {
              if (res.data.code == 200) {
                this.notify('修改成功', 'success')
              } else {
                this.notify('修改失败', 'error')
              }
            }).catch(err => {
              this.notify("服务器错误，修改失败，请报告管理员（Vx:13612413078）","error")
            }).finally(()=>{
              this.editDialogVisible = false;
              this.selectAll();
            })
          } else {
            this.notify('请将歌手信息填写完整', 'error')
          }
        })
      },
      delRow(){
        let params=new URLSearchParams();
        params.append("singerId",this.delId);
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
              this.delId=item.singerId;
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
      songEdit(singerId,singerName){
        this.$router.push({path:`/Song`,query:{singerId,singerName}})
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
            if (item.singerName.includes(this.fuzzyName)) {
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

    .consumer-img {
        width: 50px;
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
