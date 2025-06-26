import request from '../utils/request';
import {
    useTokenStore
} from '@/stores/token.js';

export  function showOperator() {
    const tokenStore = useTokenStore();
    return request.get('/operator/show', {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export  function addOperator(categoryData){
    const tokenStore = useTokenStore();
    return request.post('/operator/add',categoryData,
        {
            headers: {
                'Authorization': tokenStore.token,
                'Content-Type': 'application/json'
            }
        }
    );
}

export  function updateOperator(categoryData){
     const tokenStore = useTokenStore();
   return  request.put('/operator/update',categoryData,
    {
        headers: {
            'Authorization': tokenStore.token,
            'Content-Type': 'application/json'
        }
    }
   );
}

export  function deleteOperator(id){
    const tokenStore = useTokenStore();
    return request.get('/operator/delete?id='+id,
        {
            headers: {
                'Authorization': tokenStore.token,
                'Content-Type': 'application/json'
            }
        }
    )
}

export function admincharge(params){
    const tokenStore = useTokenStore();
    return request.get('/charge/all',
        {
            params:params,
            headers: {
                'Authorization': tokenStore.token
                // 'Content-Type': 'application/json'
            }
        },
    )
}

export function addCharge(charge){
    const tokenStore = useTokenStore();
    return request.post('/charge/add',charge,
        {
            headers: {
                'Authorization': tokenStore.token
            }
        },
    )
}


export function updateCharge(chargeData){
    const tokenStore = useTokenStore();
    return  request.post('/charge/update',chargeData,
        {
            headers: {
                'Authorization': tokenStore.token
            }
        }
       );
}

export function deleteCharge(id){
    const tokenStore = useTokenStore();
    return request.get('/charge/delete?id='+id,
        {
            headers: {
                'Authorization': tokenStore.token
            }
        }
    );
}