<template>
  <!-- vuex 控制 -->
  <div class="component-rule-mask" v-show="ruleContent.flag">
    <div class="component-rule">

      <header class="component-rule-header">
        <h3>榜单规则</h3>
        <span class="closeRule" @click="handleCloseRule">
          <img src="../assets/img/rule/ex_popup@3x.png" alt="">
        </span>
      </header>
      
      <pre v-if="ruleContent.type === 1">
        <p class="component-rule-content">1、上榜规则
根据崽崽爱豆捏脸大赛成绩，共计20名明星崽入围安利榜；

2、榜单周期
打榜周期为2020.09.30 - 2020.10.11；
活动结束后，数据经反垃圾筛查，将于10月12日公布榜单最终排名；

3、排名规则
榜单热度值由投票热度、关注热度和作品热度合计组成；
∙ 投票热度：每人每天30票，可为喜爱的明星崽投票，1票记为1热度，数据实时更新；
∙ 关注热度：关注明星崽账号，每新增1个关注数记为1热度值，重复关注无效，取关后分值作废，数据每日11点汇总后更新1次；
∙ 作品热度：在明星崽的对应话题下发布作品，每发布1个作品记为5热度值，作品删除后分值作废，数据每日11点汇总后更新1次；

注：若平台发现存在恶意刷榜等违规操作，将做删除垃圾数据或下榜处理；
        </p>
      </pre>

      <pre v-else>
        <p class="component-rule-content">1、超级大奖：两颗星球命名权
说明：榜单热度最高的明星崽及其粉丝团获得两个星球的命名权
备注：星球命名权由Name A Star Live提供

2、最受欢迎Idol大奖：崽崽开屏3天
说明：榜单热度最高的明星崽将得到崽崽开屏权益3天
备注：对该明星崽热度贡献最高的3位用户将获得和Idol共上开屏的机会

3、最受欢迎作品奖：现金1000元 共计10人
说明：活动相关话题下的作品点赞数最高的10条作品，对应作者将获得1000元奖金
备注：如相同作者多条视频入围，名额顺延

4、热度贡献top20：现金500元 共计20人
说明：活动过程中热度贡献总量前20名用户获奖

获奖用户公布时间：10月13日

注：若平台发现存在恶意刷榜等违规操作，将做取消获奖处理
        </p>
      </pre>
      
      <footer class="component-rule-footer" @click="handleCloseRule">
        我知道了
      </footer>

    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions} from 'vuex'
import { mapGetters} from 'vuex'

export default {
  name: "Rule",
  computed: {
    ...mapGetters([
      'ruleContent'
    ])
  },
  methods: {
    // ...mapActions([
    //   'SetRule'
    // ]),
    handleCloseRule() {
      this.$store.commit('SET_RULE', {flag: 0})
      // this.SetRule({status:0, txt:''})
      // this.looseBody()
    },
    looseBody() {
      let body = document.body
      body.style.position = ''
      let top = body.style.top
      document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
      body.style.top = ''
    },
  }
};
</script>

<style lang='scss' scoped>
.component-rule-mask{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  .component-rule{
    width: 630px;
    height: 900px;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    border-radius: 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    .component-rule-header{
      height: 100px;
      line-height: 100px;
      position: relative;
      padding: 0 32px;
      box-sizing: border-box;
      h3{
        font-size: 30px;
        text-align: center;
        color: #000;
        font-weight: bold;
      }
      .closeRule{
        position: absolute;
        top: 0;
        right: 32px;
        width: 44px;
        height: 100px;
        img{
          width: 36px;
          height: 36px;
          margin-left: 4px;
        }
      }
    }
    
    pre {
      flex: 1;
      font-size: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      padding: 0 32px;
      box-sizing: border-box;
      .component-rule-content {
        font-size: 26px;
        line-height: 42px;
        color: #686675;
        white-space: pre-wrap;
        text-align: left;
      }
    }
    .component-rule-footer {
      border-top: 1px solid #E5E5E9;
      height: 112px;
      color: #5C46FF;
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      line-height: 112px;
    }
  }
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
