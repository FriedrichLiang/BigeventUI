import { defineStore } from "pinia";
import {ref} from "vue";

export const useTokenStore=defineStore('token',
    function (){
        const token=ref('');
        function setToken(newToken){
            token.value=newToken;
        };
        function removeToken(){
            token.value='';
        };
        return {token,setToken,removeToken}; 
    }
);