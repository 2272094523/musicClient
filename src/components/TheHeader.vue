<template>
    <div class="header">
        <!--折叠图标-->
        <div class="collapse-btn" @click="collapseChange">
            <i class="el-icon-menu" ></i>
        </div>
        <div class="logo">Music后台管理</div>
        <div class="header-right">
            <div class="btn-fullscreen" @click="handleFullScreen">
                <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                    <i class="el-icon-rank" ></i>
                </el-tooltip>
            </div>
            <div class="admin-avator">
                <img src="../assets/img/user.jpg" >
            </div>
            <el-dropdown class="admin-name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link"> {{adminName}}<i class="el-icon-caret-bottom"></i></span>

                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import bus from "../assets/js/bus"
    import SingerPage from '../pages/SingerPage'
    import {mixin} from '../mixins'
    export default {
    mixins: [mixin],
    name: 'TheHeader',
    components: {SingerPage},
    data(){
      return{
        collapse:false,
        fullscreen:false,
      }
    },
    methods:{
      /*侧边栏折叠*/
      collapseChange(){
        this.collapse=!this.collapse;
        bus.$emit('collapse',this.collapse);
      },
      /*全屏显示*/
      handleFullScreen(){
        if (this.fullscreen){
          /*兼容各种浏览器*/
          if (document.exitFullscreen){
            document.exitFullscreen();
          }else if (document.webkitCancelFullScreen) { //safari.chrome
            document.webkitCancelFullScreen();
          }else if (document.mozCancelFullScreen){
            document.mozCancelFullScreen();             //firefox
          }else if (document.msExitFullScreen){
            document.msExitFullScreen();                //ie
          }
        }else{
          let element=document.documentElement;
          if (element.requestFullscreen){
            element.requestFullscreen();
          }else if (element.webkitRequestFullScreen){
            element.webkitRequestFullScreen();
          }else if (element.mozCancelFullScreen){
            element.mozCancelFullScreen();
          }else if (element.msExitFullScreen){
            element.msExitFullScreen();
          }
        }
        this.fullscreen=!this.fullscreen;
      },
      handleCommand(command){
        if (command==='logout'){
          this.notify("用户"+this.adminName+"已注销","success");
          localStorage.removeItem('Admin_name');
          this.$router.push("/");
        }
      }
    },
    computed:{
        adminName(){
          return localStorage.getItem("Admin_name");
        }
    }
  }
</script>

<style scoped>

    .header{
        position: relative;
        background-color: #253041;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #ffffff;

    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{

        float: left;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        margin-right: 5px;
        font-size: 24px;
        transform: rotate(45deg);
    }
    .admin-avator{
        margin-left: 20px;
    }
    .admin-avator img{
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;

    }
    .admin-name{
        margin-left: 10px;
    }
    .el-dropdown-link{
        color: white;
        cursor: pointer;
    }

</style>
