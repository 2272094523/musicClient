<template>
  <div>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="grid-num">{{consumerTotals}}</div>
              <div>用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="grid-num">{{songTotals}}</div>
              <div>歌曲</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="grid-num">{{singerTotals}}</div>
              <div>歌手</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="grid-num">{{songListTotals}}</div>
              <div>歌单</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <h2 style="color: #006067">
          用户性别比例
        </h2>
        <div style="background-color: white">
          <ve-pie :data="consumerSex" :theme="options"></ve-pie>
        </div>
      </el-col>
      <el-col :span="12">
        <h2 style="color: #006067">
          歌单类型分布
        </h2>
        <div style="background-color: white">
          <ve-histogram :data="songList_Style"></ve-histogram>
        </div>
      </el-col>
    </el-row>
    <el-col :span="12">
      <h2 style="color: #006067">
        歌手性别比例
      </h2>
      <div style="background-color: white">
        <ve-pie :data="singerSex" :theme="options"></ve-pie>
      </div>
    </el-col>
  </div>
</template>

<script>
  import {selectAllSong, selectAllTotals} from '../api/index'

  export default {
    name: "InfoPage",
    data() {
      return {
        consumerTotals: 0,
        songTotals: 0,
        singerTotals: 0,
        songListTotals: 0,
        consumerLists: [],
        singerLists: [],
        songList_Lists: [],
        songLists: [],
        consumerSex: {
          columns: ['性别', '总数'],
          rows: [
            {'性别': '男', '总数': 0},
            {'性别': '女', '总数': 0},

          ],
        },
        songList_Style: {
          columns: ['style', 'numbs'],
          rows: [],
        },
        singerSex: {
          columns: ['性别', '总数'],
          rows: [
            {'性别': '男', '总数': 0},
            {'性别': '女', '总数': 0},
            {'性别': '组合', '总数': 0}
          ]
        },
        options: {
          color: ['#5ba1fa', '#ff4343','#00939b']
        }
      }
    },
    methods: {
      selectAll() {
        selectAllTotals().then(res => {
          if (res.data.code == 200) {
            this.consumerTotals = res.data.data.consumerTotals;
            this.songTotals = res.data.data.songTotals;
            this.singerTotals = res.data.data.singerTotals;
            this.songListTotals = res.data.data.songListTotals;
            this.consumerLists = res.data.data.consumerLists;
            this.singerLists = res.data.data.singerLists;
            this.songList_Lists = res.data.data.songList_Lists;
            this.songLists = res.data.data.songLists;
          }
        }).catch(err => {
          this.$message.error("服务器内部错误，请联系管理员,vx:13612413078");
        }).finally(() => {
          this.statisticAnalyses();
        });
      },
      statisticAnalyses() {
        //统计男女用户比例
        this.consumerSex.rows[0]['总数'] = this.getConsumerBySex(1, this.consumerLists);
        this.consumerSex.rows[1]['总数'] = this.consumerTotals-this.consumerSex.rows[0]['总数'];

        //统计男女歌手比例
        this.singerSex.rows[0]['总数'] = this.getBySingerSex(1, this.singerLists);
        this.singerSex.rows[1]['总数'] = this.getBySingerSex(0, this.singerLists);
        this.singerSex.rows[2]['总数'] = this.singerTotals - this.singerSex.rows[0]['总数']-this.singerSex.rows[1]['总数'];
        //统计多少种歌单风格
        let count = 0;
        let flag = false;
        for (let item of this.songList_Lists) {
          if (this.songList_Style.rows.length == 0) {
            let type = {style: item.songListStyle, numbs: 1}
            this.songList_Style.rows.push(type);
          } else {
            for (let anotherItem of this.songList_Style.rows) {
              if (anotherItem.style.includes(item.songListStyle)) {
                anotherItem.numbs++;
                flag = true;
                break;
              }
            }
            if (flag == false) {
              let type = {style: item.songListStyle, numbs: 1}
              this.songList_Style.rows.push(type);
            }
          }
        }
      },
      getConsumerBySex(sex, consumerLists) {
        let counts = 0;
        for (let item of consumerLists) {
          if (item.consumerSex == sex) {
            counts++;
          }
        }
        return counts;
      },
      getBySingerSex(sex, singerLists) {
        let counts = 0;
        for (let item of singerLists) {
          if (item.singerSex == sex) {
            counts++;
          }
        }
        return counts;
      },
    }
    ,
    created() {
      this.selectAll();
    }
  }
</script>

<style scoped>
  .grid-content {
    display: flex;
    algin-items: center;
    height: 50px;
  }

  .grid-content-center {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: darkgray;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }
</style>
