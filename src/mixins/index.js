/*信息窗口提示的封装*/
export const mixin = {
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    //根据相对地址获取绝对地址的图片
    getImgUrl(imgUrl){
      return `${this.$store.state.Host}${imgUrl}`
    },
    //生日格式改变.去掉最后的时间，分，秒
    changeTimeFormat(Singer_sex){
      if (Singer_sex==null||Singer_sex===''){
        return '暂无';
      }
      return String(Singer_sex).substr(0,10);
    },
    uploadSuccess(res,file){
      let _this=this;
      if (res.data.code==200){
        _this.notify(res.data.msg,"success");
        _this.selectAll();
      }else{
        _this.notify(res.data.msg,"error")
      }
    },
    beforeUpload(file){
      const isJpg=(file.type==='image/jpeg')||(file.type==='image/png')||(file.type==='image/jpg')||(file.type==='image/JPEG')||(file.type==='image/PNG')||(file.type==='image/JPG')
      if (!isJpg){
        this.$message.error('上传的文件非图片格式(jpg,jpeg,png)')
        return false;
      }
      const limitSize=(file.size/1024/1024)<=2;
      if (!limitSize){
        this.$message.error('上传的图片不能超过2M')
        return false;
      }
      return true;
    },
    uploadFileSuccess(res,file){
      let _this=this;
      if (res.data.code==200){
        _this.notify(res.data.msg,"success");
        _this.selectAll();
      }else{
        _this.notify(res.data.msg,"error")
      }
    },
    beforeUploadFile(file){
      const isJpg=(file.type==='audio/mpeg')
      if (!isJpg){
        this.$message.error('上传的文件非mp3格式')
        return false;
      }
      const limitSize=(file.size/1024/1024)<=10;
      if (!limitSize){
        this.$message.error('上传的文件不能超过10M')
        return false;
      }
      return true;
    },
    handleSelectionDelete(val){
      this.multipleSelection=val;
    },
    handleDelete(id){
      this.delId=id;
      this.delDialogVisible=true;
    },
  }
}
