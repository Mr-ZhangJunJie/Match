import request from '@/utils/request'
export  default  {
    getInfo(data){
        return request({
            url:'/fashionPk/user/info',
            method: 'get',
            params: data
        })
    },
    getLikeList(data){
        return request({
            url:'/fashionPk/like/list',
            method: 'post',
            params: data
        })
    },
    toFlow(data){
       data.duid = data.duid || '-';
       data.ua = data.ua || '-';
       return request({
          url:`/fashionPk/follow/add_follow?duid=${data.duid}&ua=${data.ua}&token=${encodeURIComponent(data.token)}&followUserId=${data.followUserId}`,
          method:'post',
       })
    },
    getFlowFriend(data){
      data.duid = data.duid || '-';
      data.ua = data.ua || '-';
      console.log(data)

      return request({
          // ?duid=${data.duid}&ua=${data.ua}&token=${encodeURIComponent(data.token)}&ids=${data.ids}
          url:`/fashionPk/follow/get_following_ids?duid=${data.duid}&ua=${data.ua}&token=${encodeURIComponent(data.token)}&ids=${data.ids}`,
          method:'post',
          // params:{
          //     duid:encodeURIComponent(data.duid),
          //     ua:encodeURIComponent(data.ua),
          //     token:encodeURIComponent(data.token),
          //     ids: data.ids.join(',')
          // }
      })
    },
    getSortList(data){
        return request({
            url:'/fashionPk/rank',
            method: 'post',
            params: data
        })
    },
    // 获取候选人
    getCandidate(data){
        return request({
            url:'/fashionPk/candidate',
            method: 'post',
            params: data
        })
    },
    // 点赞
    giveLike(data){
        return request({
            url:'/fashionPk/like',
            method: 'post',
            params: data
        })
    },
    // 报名
    toSignUp(data){
        let formData = new FormData();
        for(let attr in data){
            formData.append(attr,data[attr])
        }
        return request({
            url:'/fashionPk/sign/up',
            method: 'post',
            data:formData
        })
    },
    //机器人报名
    robitToSignUp(data){
        let formData = new FormData();
        for(let attr in data){
            formData.append(attr,data[attr])
        }
        return request({
            url:'/fashionPk/robot/sign',
            method: 'post',
            data:formData
        })
    },
    // 更新信息
    toUpdate(data){
        return request({
            url:'/fashionPk/update',
            method: 'post',
            params:data
        })
    },
}
