import axios from 'axios';

const getCoreAPI = () => {
    const CORE_API = {
        global: {
            production: 'https://napi.zepeto.io',
            development: 'http://dev-zepeto-global-server-ncl.nfra.io'
        },
        zaizai: {
            production: 'https://napi.zepeto.cn',
            development: 'http://dev-zepeto-server-ncl.nfra.io'
        }
    };
    let env = '';
    if((process.env.MODE == 'pre') || (process.env.MODE == 'pro')){
        env = 'production'
    }else{
        env = 'development'
    }
    return CORE_API['zaizai'][env];
};

export  async function setFollowing(Zepeto, hashCode) {

    const BASE_URL = getCoreAPI();
    const callUrl = `${BASE_URL}/set/following`;

    const headers = Zepeto.userInfo ? {
        authtoken: Zepeto.userInfo.authToken,
        'X-ZEPETO-CLIENT-UA': Zepeto.userAgent,
        'X-ZEPETO-DUID': Zepeto.duid,
        'X-ZZZ-UA': 'zepeto.service.zzz.crew/1.0.0'
    } : {};
    console.log(headers);
    const config = {
        timeout: 5000,
        headers: headers
    };
    const data = {
        hashCode,
    };
    try {
        const rsp = await axios.post(callUrl, data, config);
        return rsp;
    } catch (e) {
        const message = e.response && e.response.data ? e.response.data.message : 'default';
        throw new Error(message);
    }
};
// 服务端代码
// exports.setFollowing = async (clientHeaders, targetId) => {
//     try {
//
//         const BASE_URL = `${getCoreAPI()}/FollowRequest_v2`;
//
//         const data = {
//             followUserId: targetId
//         };
//
//         // const config = {headers: setAuthorization(authToken)};
//
//         const config = {headers: setCoreAPIHeaders(clientHeaders)};
//
//         const response = await axios.post(BASE_URL, data, config);
//
//         return response.data;
//
//     } catch (e) {
//         throw e;
//     }
// };

// export const setFollowing = async (userInfo, hashCode) => {
//
//     const BASE_URL = API_BASE_URL;
//     const callUrl = `${BASE_URL}/set/following`;
//
//     const headers = userInfo ? {
//         authtoken: userInfo.authToken,
//         'X-ZEPETO-CLIENT-UA': userInfo.userAgent,
//         'X-ZEPETO-DUID': userInfo.duid,
//         'X-ZZZ-UA': 'zepeto.service.zzz.crew/1.0.0'
//     } : {};
//
//     const config = {
//         timeout: 5000,
//         headers: headers
//     };
//     const data = {
//         hashCode,
//     };
//     try {
//         const rsp = await axios.post(callUrl, data, config);
//         return rsp;
//     } catch (e) {
//         const message = e.response && e.response.data ? e.response.data.message : 'default';
//         throw new Error(message);
//     }
// };

// exports.setFollowing = async (clientHeaders, targetId) => {
//     try {
//
//         const BASE_URL = `${getCoreAPI()}/FollowRequest_v2`;
//
//         const data = {
//             followUserId: targetId
//         };
//
//         // const config = {headers: setAuthorization(authToken)};
//
//         const config = {headers: setCoreAPIHeaders(clientHeaders)};
//
//         const response = await axios.post(BASE_URL, data, config);
//
//         return response.data;
//
//     } catch (e) {
//         throw e;
//     }
// };
