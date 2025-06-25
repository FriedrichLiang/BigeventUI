import request from '../utils/request';
import {
    useTokenStore
} from '@/stores/token.js';

export function addannounce(anodata){
    const tokenStore = useTokenStore();
    return request.post('/announcements/add',anodata,
        {
        headers: {
            'Authorization': tokenStore.token,
             'Content-Type': 'application/json'
        }
    });
}

export function deleteannounce(id){
    const tokenStore = useTokenStore();
    return request.delete('/announcements/delete?id='+id, {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function updateannounce(anodata){
    const tokenStore = useTokenStore();
    return request.patch('/announcements/update',anodata,
         {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function getallano(){
    const tokenStore = useTokenStore();
    return request.get('/announcements/getall',
         {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export function justgetallano(scope){
    const tokenStore = useTokenStore();
    return request.get('/announcements/justgetall?id='+scope,
         {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}