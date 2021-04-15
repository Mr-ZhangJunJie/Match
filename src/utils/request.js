import axios from 'axios'
import config from '@/config/index'
import store from '@/store/index'

// 创建axios 实例
console.log('config', config)
const service = axios.create({
	baseURL: config.BASE_URL, // api的base_url
	timeout: 10000 // 请求超时时间
	// timeout: 10 // 请求超时时间
})

// request 拦截器
service.interceptors.request.use(
	config => {
		// 这里可以自定义一些config 配置
		return config
	},
	error => {
		//  这里处理一些请求出错的情况
		Promise.reject(error)
	}
)

// response 拦截器
service.interceptors.response.use(
	response => {
		const res = response.data
		// 这里处理一些response 正常放回时的逻辑
		// console.log('store:::', store.state)
		// console.log('config.REPORT_URL:::', config.REPORT_URL)

		if (res.code === 10005) {
			axios.post(`${config.REPORT_URL}`, store.state.app.usrInfo)
				.then(res => {
					store.state.app.myApp.token = res.data.result
				})
				.catch(error => {
					console.log(error.res)
				});

			// axios.post(`${config.REPORT_URL}`, {
			// 	UA: "zepeto.service.zzz.crew/1.0.0",
			// 	authToken: "6Lj+/pr5rGvf3tRm1/T4dhvUG9wKa2nqQGvTlqXtKRcN0B77DMDRodCYUHspY3Z5f2l0MAhcsGowuzh+xIomYj7zKjw+veOZ9cOO5USL0os=\\1\\Qyyvuh3i0tpEuFpBZ9qruhgEuY4l0tu+CrqBu93K",
			// 	avatar: "https://cdn.zepeto.cn/users/5d10d0d562b11025c8ce0094/profile/5d10d160cc34fc35ef80de9d.png?modified=1582449814000",
			// 	duid: "-",
			// 	fansNum: "1999",
			// 	imToken: "",
			// 	IsLoggedIn: false,
			// 	nickName: "Amy",
			// 	userAgent: "ios.zepeto_cn/2.18.2 (ios; U; iOS 13.4; zh-CN; occ-CN; iPhone8,2)",
			// 	userId: "5d10d0d562b11025c8ce0094",
			// 	zzId: "VLUFUV",
			// })
			// .then(response => {
			// 	console.log(response)
			// })
			// .catch(error => {
			// 	console.log(error.response)
			// });


			// axios({
			// 	url: `${config.REPORT_URL}`,
			// 	method: 'POST',
			// 	headers:{
			// 		"Content-Type": "application/json",
			// 	},
			// 	data: store.usrObj,
			// 	timeout: 1000,
			// }).then((res) => {
			// 	console.log('res::', res)
			// });
		} else {
			return res
		}
		// return res

		// store.dispatch('SetLoading', false)

	},
	error => {
		// 这里处理一些response 出错时的逻辑

		// store.dispatch('SetLoading', false)

		// let msg = error
		// let str = msg.toString()
		// if (str.indexOf('timeout') != -1) {
		// 	str = '网络请求超时，请稍后重试'
		// 	return Promise.reject(str)
		// } else {
		// 	return Promise.reject(error)
		// }
		return Promise.reject('网络请求超时，请稍后重试')
	}
)

export default service
