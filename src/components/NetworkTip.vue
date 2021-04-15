<template>
    <transition name="fade-transform" mode="out-in">
        <div class="request-loading-component" v-show="networkContent.flag">
            <div class="toast">
                <h3><svg-icon icon-class="noNetwork"></svg-icon></h3>
                <!--当前网络不可用<br>请检查网络配置-->
                <p v-html="networkContent.message"></p>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex'
    export default {
        name: 'NetworkTip',
        computed: {
            ...mapGetters([
                'networkContent'
            ])
        },
        methods:{
            ...mapActions(['SetNetwork'])
        },
        mounted(){
            // this.SetNetwork(1)
            // setTimeout(()=>{
            //     this.SetNetwork(0)
            // },3000)
            // setTimeout(()=>{
            //     this.SetNetwork(1)
            // },6000)
        }
    }
</script>

<style lang='scss' scoped>
    .request-loading-component {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: transparent;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        z-index: 999;
        .toast{
            width: 340px;
            height: 264px;
            margin-top: -200px;
            background-color: rgba(0,0,0,0.65);
            border-radius: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 30px;
            box-sizing: border-box;
            p{
                font-size: 30px;
                color: #fff;
            }
        }
        .show{
            animation: dance 1.3s;
            animation-delay: 500s;
        }
        @keyframes dance{
            0% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-60px);
            }
            100% {
                transform: translateY(0px);
            }
        }
    }
</style>
