import request from '@/utils/request'
import config from '@/config/index'

let obj = {
	// 用户信息上报
	postUsrInfo(params) {
		return request({
			url: `${config.REPORT_URL}`,
			headers:{
				"Content-Type": "application/json",
			},
			data: params,
			method: 'POST',
			timeout: 10000
		})
	},

	// 获取推荐卡片
	getMatchRecommend(params) {
		return request({
			url: `/match/recommend`,
			method: 'get',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 个人页 互相喜欢:1; 喜欢你的:2, 你喜欢的:3
	getLikeList(params) {
		return request({
			url: `/match/likeList?type=${params.type}&pageNum=${params.current}&pageSize=${params.size}`,
			method: 'get',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 点击不喜欢【叉】
	dislikeCard(params) {
		return request({
			url: `/match/dislike?targetId=${params.zzId}`,
			method: 'post',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 点击喜欢【红心】
	likeCard(params) {
		return request({
			url: `/match/like?targetId=${params.zzId}&targetUserId=${params.userId}`,
			method: 'post',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},


	// 匹配成功弹窗卡片，发送消息入库
	getMatchMsg(params) {
		return request({
			url: `/match/matchMsg?targetId=${params.zzId}&targetUserId=${params.userId}&msg=${params.msg}`,
			method: 'post',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 编辑页：获取用户信息-编辑过资料时使用
	getUserInfo(params) {
		return request({
			url: `/user/getUserInfo`,
			contentType:'application/json;charset=utf-8',
			headers:{
				token: params.token
			},
			method: 'get',
			timeout: 50000
		})
	},

	// 编辑页：获取所有标签数据-没有编辑过资料时使用
	getLabelList(params) {
		return request({
			url: `/user/label/list`,
			method: 'get',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 关注 自己的authToken，他的userId
	setFollow(params) {
		return request({
			url: `/user/follow/add_follow?token=${encodeURIComponent(params.authToken)}&followUserId=${params.userId}&duid=${params.duid}&ua=${params.ua}`,
			headers:{
				"Content-Type": "application/json",
			},
			method: 'POST',
			timeout: 50000
		})
	},

	// 获取是否编辑过资料标记及小红点标记
	getUserLogin(params) {
		return request({
			url: `/user/login`,
			method: 'get',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 退出离线
	getUserOffline(params) {
		return request({
			url: `/user/offLine`,
			method: 'get',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	/**
	 * 刷新在线时间
	 * @param {source} params 来源(1.点击喜欢 2.不喜欢 3、点击“个⼈主⻚”按钮
	 * 4.个⼈主⻚内点击⽤户，进⼊【⽤户详情】5.个⼈主⻚内关注⽤户 6.配对资料完成保存)
	 */
	getRefresh(params) {
		return request({
			url: `/user/refresh?source=${params.source}`,
			method: 'get',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 编辑页：保存用户信息
	postUserInfo(params) {
		return request({
			url: `/user/save`,
			method: 'post',
			contentType:'application/json;charset=utf-8',
			headers: {
				"Content-Type": "application/json",
				token: params.token
			},
			data: params.labelList
		})
	},

	// 所有文本框校验-易顿文本检测
	checkUserInfo(params) {
		return request({
			url: `/user/textCheck?content=${params.content}`,
			method: 'post',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			},
		})
	},


	// 渲染多张崽崽图片
	renderMultipleImage({boothIdStr, hashCodes}) {
        let params = {
            "contentIds": boothIdStr.split(','),
            "target": {
                "hashCodes": [
                    hashCodes
                ]
            },
            "width": 750, // 设置图片宽度
            override: { // 关闭崽崽变形
                metadatas: [
                    {
                        Properties: [],
                        BlendShapes: [],
                        Deformations: [
                            {
                                name: "CLEAR",
                            },
                        ],
                    },
                ],
            }
        }

        return request({
            url:`https://render-api-gateway.zepeto.cn/v3/images/zaizai/photos?ttl=day`,
            headers:{
                "accept": "application/json",
                "Content-Type": "application/json",
                "x-cache-ttl": 30,
                "x-cache": true,
				"Authorization": 'Bearer ZAIZAI_MATCH_Wqsl6lcusHFNLd'
            },
            data: params,
            method: 'POST',
            timeout: 50000
        })

		// let params = {
		// 	"type": "booth",
		// 	"ids": boothIdStr.split(','),
		// 	"target": {
		// 		"hashCodes": [
		// 			hashCodes
		// 		]
		// 	},
		// 	width: 768, // 设置图片宽度
		// 	override: { // 关闭崽崽变形
		// 		metadatas: [
		// 			{
		// 				Properties: [],
		// 				BlendShapes: [],
		// 				Deformations: [
		// 					{
		// 						name: "CLEAR",
		// 					},
		// 				],
		// 			},
		// 		],
		// 	},
		// }
		//
		// return request({
		// 	url:`https://render-api.zepeto.cn/v2/graphics/zaizai/booth?cdn=true&cache=true&permanent=true`,
		// 	headers:{
		// 	 "Content-Type": "application/json",
		// 	},
		// 	data: params,
		// 	method: 'POST',
		// 	timeout: 50000
		// })
	},

	// 个人页被喜欢数
	getBeLikeNum(params) {
		return request({
			url: `/match/beLikedNum`,
			method: 'get',
			contentType:'application/json;charset=utf-8',
			headers: {
				token: params.token
			}
		})
	},

	// 渲染单张崽崽个人形象
	renderSingleImage(params) {
		return request({
			url: `https://render-api-gateway.zepeto.cn/v3/images/zaizai/photos/${params.boothId}?ttl=day&redirect=false`,
			// url: `https://render-api-gateway.zepeto.cn/v3/images/zaizai/photos/PHOTOBOOTH_ONE_381?ttl=day&redirect=false`,
			// url: `https://render-api.zepeto.cn/v2/graphics/zaizai/booth/${params.boothId}?cdn=true&cache=true&binary=false&permanent=true`,
			headers:{
                'Content-Type':'application/json',
				"accept": "application/json",
				"x-cache-ttl": 30,
				"x-cache": true,
				"Authorization":'Bearer ZAIZAI_MATCH_Wqsl6lcusHFNLd'
			},
			data: params.data,
			method: 'POST',
			timeout: 50000
		})
	},

}
export default obj
