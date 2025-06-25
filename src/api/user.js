    import request from '@/utils/request.js'
    import {
        useTokenStore
    } from '@/stores/token.js';
    export function userRegister(registerData){
        const param=new URLSearchParams();
        for(let key in registerData){
            param.append(key,registerData[key]);
        }
        return request.post('/user/register',param)
    }

    export function userLogin(registerData){
        const param=new URLSearchParams();
        for(let key in registerData){
            param.append(key,registerData[key]);
        }
        return request.post('/user/login',param)
    }

    export function getuserInfo(){
        const tokenStore = useTokenStore();
        return request.get('/user/userinfo',
            {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        )
    }

    export function admingetusers(params){
        const tokenStore = useTokenStore();
        return request.get('/user/all',
            {
                params:params,
                headers: {
                    'Authorization': tokenStore.token
                }
            },
        )
    }

    export function adminclose(id){
        const tokenStore = useTokenStore();
        return request.get('/user/close?id='+id,
            {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        )
    }

    export function adminunclose(id){
        const tokenStore = useTokenStore();
        return request.get('/user/unclose?id='+id,
            {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        )
    }

    export function getalluser(){
        const tokenStore = useTokenStore();
        return request.get('/user/justall',
            {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        )
    }

    export function getuserbrowse(){
        const tokenStore = useTokenStore();
        return request.get('/user/userbrowse',
            {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        )
    }

    export function getusercount(){
        const tokenStore = useTokenStore();
        return request.get('/user/usercount',
            {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        )
    }

    export function getuserfollow(){
        const tokenStore = useTokenStore();
        return request.get('/user/userfollow',
            {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        )
    }

    export function userAvatarUpdate(avatarUrl){
        const tokenStore = useTokenStore();
        const params = new URLSearchParams();
        params.append('avatarUrl',avatarUrl)
        return request.patch('/user/updateAvatar',params,
            {
                    headers: {
                        'Authorization': tokenStore.token,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            
        )
    }

    export function updatepassword(resetmodel){
        const tokenStore = useTokenStore();
        return request.post('/user/updatePwd',resetmodel,
            {
                    headers: {
                        'Authorization': tokenStore.token,
                    }
                }
            
        )
    }

    export function getalladmin(){
        const tokenStore = useTokenStore();
        return request.get('/user/getalladmin',
            {
                    headers: {
                        'Authorization': tokenStore.token,
                    }
                }
            
        )
    }

    export function createadmin(adminmodel){
        const tokenStore = useTokenStore();
        const param=new URLSearchParams();
        for(let key in adminmodel){
            param.append(key,adminmodel[key]);
        }
        return request.post('/user/createadmin',param,
            {
                headers: {
                    'Authorization': tokenStore.token,
                }
            }
        )
    }

 

    