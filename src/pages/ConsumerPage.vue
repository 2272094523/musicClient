<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>用户信息
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input placeholder="搜索用户" clearable
                  style="width: 200px; display:inline-block" v-model="fuzzyName"></el-input>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="680px" :data="data" >
      <el-table-column prop="consumerId" style="width: 50px" align="center" label="ID"></el-table-column>
      <el-table-column prop="consumerImg" label="头像" align="center"  style="width: 120px;height: 200px" >
        <template slot-scope="scope">
          <div class="consumer-img">
            <img :src="getImgUrl(scope.row.consumerImg)" style="width: 100%;height: 100%" >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="consumerNickName" style="width: 15%" align="center" label="昵称"></el-table-column>
      <el-table-column prop="consumerSex" label="性别" align="center" style="width: 5%">
        <template slot-scope="scope">{{forMatSex(scope.row.consumerSex)}}</template>
      </el-table-column>
      <el-table-column prop="consumerBirth" label="生日" align="center"  style="width: 10%">
        <template slot-scope="scope">{{changeTimeFormat(scope.row.consumerBirth)}}</template>
      </el-table-column>
      <el-table-column prop="consumerIntroduction" label="自我介绍" align="center"  width="250px">
        <template slot-scope="scope">
          <p style="height: 100px;overflow: scroll">{{scope.row.consumerIntroduction}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="consumerUserName" label="账号" align="center" width="120px"></el-table-column>
      <el-table-column prop="consumerPhone" label="手机" align="center"  width="150px"></el-table-column>
      <el-table-column prop="consumerEmail" label="邮箱" align="center"  width="150px"></el-table-column>
      <el-table-column prop="consumerLocation" label="地址" align="center"  width="120px"></el-table-column>
      <el-table-column prop="consumerCreateTime" label="创建时间" align="center"  width="170px">
        <template slot-scope="scope">{{changeTimeFormat(scope.row.consumerCreateTime)}}</template>
      </el-table-column>
      <el-table-column prop="consumerUpdateTime" label="最近一次更新" align="center"  style="width: 100%">
        <template slot-scope="scope">{{changeTimeFormat(scope.row.consumerUpdateTime)}}</template>
      </el-table-column>
    </el-table>
    <div class="pageNation">
      <el-pagination background layout="total,prev,pager,next"
                     :current-page="currentPage" :total="list.length" :page-size="pageSize"
                     @current-change="getCurrentPageData"></el-pagination>
    </div>
  </div>
</template>

<script>
  import {mixin} from '../mixins'
  import {selectAllConsumer} from "../api/index";

  export default {
    mixins:[mixin],
    name: "ConsumerPage",
    data() {
      return{
        fuzzyName:'',
        currentPage:1,
        pageSize:5,
        list:[],
        tempList:[],
      }
    },
    methods:{
      getCurrentPageData(currentPage){
        this.currentPage =currentPage;
      },
      selectAll(){
        this.list = this.tempList=[];
        selectAllConsumer().then(res=>{
          if (res.data.code==200){
            this.$message.success("查询成功")
            this.list=this.tempList=res.data.data;
          }
        }).catch(err=>{
          this.$message.error("服务器错误，请联系管理员,vx:13612413078")
        })
      }
    },
    created() {
      this.selectAll();
    },
    watch:{
      fuzzyName:function () {
        if (this.fuzzyName==''){
          this.list=this.tempList;
        }else{
          this.list=[];
          for (let item of this.tempList){
            if (item.consumerNickName.includes(this.fuzzyName)){
              this.list.push(item);
            }
          }
        }
      }
    },
    computed:{
      data(){
        return this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }
    }
  }
</script>

<style scoped>
  .consumer-img {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
  }
  .handle-box {
    margin-bottom: 20px;
  }
  .pageNation{
    display: flex;
    justify-content: center;
  }
</style>
