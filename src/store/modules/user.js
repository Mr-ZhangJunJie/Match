const user = {
    state: {
        info: {
            likeTimes:-1
        }
    },
    mutations: {
        SET_INFO: (state, {finQuest = 0 , head = '', likeTimes = 0 , likedCount = 0 , nickName = '' , signUp = false , todayLike = ''}={}) => {
            // error 的时候直接重置
            state.info = {finQuest,head,likeTimes,likedCount,nickName,signUp,todayLike}
        },
        SET_LIKE_TIMES: (state,status) => {
            state.info.likeTimes = status;
        }
    },
    actions: {
        SetInfo ({ commit }, status) {
            commit('SET_INFO', status)
        },
        SetLikeTimes ({ commit }, status){
            commit('SET_LIKE_TIMES', status)
        }
    }
}

export default user
