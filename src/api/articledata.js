import request from '../utils/request';
import {
    useTokenStore
} from '@/stores/token.js';

export  function getbyaid(aid) {
    const tokenStore = useTokenStore();
    return request.get('articledata/getbyaid?articleid='+aid, {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export  function gettoday() {
    const tokenStore = useTokenStore();
    return request.get('articledata/gettoday', {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export  function getalldatabyaid(aid) {
    const tokenStore = useTokenStore();
    return request.get('articledata/getalldatabyaid?articleid='+aid, {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function getfollowdata(){
    const tokenStore = useTokenStore();
    return request.get('followdata/getdata', {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function browseplus(articleid){
    const tokenStore = useTokenStore();
    return request.get('articledata/browsedata?articleid='+articleid, {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function followeplus(articleid){
    const tokenStore = useTokenStore();
    return request.get('articledata/followdata?articleid='+articleid, {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function myfollow(){
    const tokenStore = useTokenStore();
    return request.get('followdata/myfollow', {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function gettodaycount(){
    const tokenStore = useTokenStore();
    return request.get('followdata/gettodaycount', {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}


