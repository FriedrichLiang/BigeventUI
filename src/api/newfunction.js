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