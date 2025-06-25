import request from '../utils/request';
import {
    useTokenStore
} from '@/stores/token.js';

export  function showCategory() {
    const tokenStore = useTokenStore();
    return request.get('/category/show', {
        headers: {
            'Authorization': tokenStore.token
        }
    });
}

export  function addCategory(categoryData){
    const tokenStore = useTokenStore();
    return request.post('/category/add',categoryData,
        {
            headers: {
                'Authorization': tokenStore.token,
                'Content-Type': 'application/json'
            }
        }
    );
}

export  function updateCategory(categoryData){
     const tokenStore = useTokenStore();
   return  request.put('/category/update',categoryData,
    {
        headers: {
            'Authorization': tokenStore.token,
            'Content-Type': 'application/json'
        }
    }
   );
}

export  function deleteCategory(id){
    const tokenStore = useTokenStore();
    return request.get('/category/delete?id='+id,
        {
            headers: {
                'Authorization': tokenStore.token,
                'Content-Type': 'application/json'
            }
        }
    )
}

export function getAllArticle (params){
    const tokenStore = useTokenStore();
    return request.get('/article',
        {
            params:params,
            headers: {
                'Authorization': tokenStore.token,
                'Content-Type': 'application/json'
            }
        },
    )
}

export function addArticle(articleData){
    const tokenStore = useTokenStore();
    return request.post('/article',articleData,
        {
            headers: {
                'Authorization': tokenStore.token
            }
        },
    )
}

export function updateArticle(articleData){
    const tokenStore = useTokenStore();
    return  request.post('/article/update',articleData,
        {
            headers: {
                'Authorization': tokenStore.token
            }
        }
       );
}

export function justGetAllArticle (){
    const tokenStore = useTokenStore();
    return request.get('/article/getall',
        {
            headers: {
                'Authorization': tokenStore.token
            }
        }
    );
}

export function deleteArticle(id){
    const tokenStore = useTokenStore();
    return request.get('/article/delete?id='+id,
        {
            headers: {
                'Authorization': tokenStore.token
            }
        }
    );
}

export function admingetarticle(params){
    const tokenStore = useTokenStore();
    return request.get('/article/all',
        {
            params:params,
            headers: {
                'Authorization': tokenStore.token,
                'Content-Type': 'application/json'
            }
        },
    )
}

export function admingetcategory(){
    const tokenStore = useTokenStore();
    return request.get('/category/all',
        {
            headers: {
                'Authorization': tokenStore.token
            }
        }
    );
}

export function getbrowse(){
    const tokenStore = useTokenStore();
    return request.get('/article/browse',
        {
            headers: {
                'Authorization': tokenStore.token
            }
        }
    );
}

export function updateimg(id,url){
    const tokenStore = useTokenStore();
    const params = new URLSearchParams();
    params.append('id',id)
    params.append('url',url)
    return request.patch('/article/updateimg',params,
        {
                headers: {
                    'Authorization': tokenStore.token
                }
            }
        
    )
}