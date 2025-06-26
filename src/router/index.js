    import {createRouter,createWebHistory} from 'vue-router'

    import login from '@/views/Login.vue'
    import layout from '@/views/Layout.vue'

    import ArticleCategory from '@/views/article/ArticleCategory.vue'
    import ArticleManage from '@/views/article/ArticleManage.vue'
    import UserAvatar from '@/views/user/UserAvatar.vue'
    import UserInfo from '@/views/user/UserInfo.vue'
    import UserResetPassword from '@/views/user/UserResetPassword.vue'
    import ArticleStatistic from '@/views/article/ArticleStatistic.vue'
    import ArticleHotStatistic from '@/views/article/ArticleHotStatistic.vue'
    import ArticleTimeHotStatistic from '@/views/article/ArticleTimeHotStatistic.vue'
    import AdminArticle from '@/views/admin/AdminArticle.vue'
    import AdminStatistic from '@/views/admin/AdminStatistic.vue'
    import AdminUser from '@/views/admin/AdminUser.vue'
    import Welcome from '@/views/Welcome.vue'
    import AdminStatisticData from '@/views/admin/AdminStatisticData.vue'
    import Browse from '@/views/normal/Browse.vue'
    import ArticleDetail from '@/views/normal/ArticleDetail.vue'
    import Adminadmin from '@/views/admin/Adminadmin.vue'
    import UserAno from '@/views/user/UserAno.vue'
    import Adminano from '@/views/admin/Adminano.vue'
    import SuperAdminano from '@/views/admin/SuperAdminano.vue'
import OperatorManage from '@/views/operator/AdminOperator.vue'
import AdminOperator from '@/views/operator/AdminOperator.vue'
import AdminCharge from '@/charge/AdminCharge.vue'
import ChargeView from '@/client/ChargeView.vue'

    const routes=[
        {path:'/login',component:login},
        { 
            path:'/',
            component:layout,
            redirect:'/welcome',
            children:[
                {path:'/article/category',component:ArticleCategory},
                {path:'/article/manage',component:ArticleManage},
                {path:'/user/info',component:UserInfo},
                {path:'/user/avatar',component:UserAvatar},
                {path:'/user/resetpassword',component:UserResetPassword},
                {path:'/article/statistic',component:ArticleStatistic},
                {path:'/article/hotstatistic',component:ArticleHotStatistic},
                {path:'/admin/article',component:AdminArticle},
                {path:'/admin/user',component:AdminUser},
                {path:'/admin/statistic',component:AdminStatistic},
                {path:'/admin/statisticdata',component:AdminStatisticData},
                {path:'/welcome',component:Welcome},
                {path:'/normal/browse',component:Browse},
                {path:'/normal/ArticleDetail/:id',component:ArticleDetail},
                {path:'/admin/adminadmin',component:Adminadmin},
                {path:'/user/userano',component:UserAno},
                {path:'/admin/adminano',component:Adminano},
                {path:'/admin/superadminano',component:SuperAdminano},
                {path:'/charge/operator',component:AdminOperator},
                {path:'/charge/charge',component:AdminCharge},
                {path:'/charge/client',component:ChargeView},
            ]
        }
    ]

    const router=createRouter({
        history:createWebHistory(),
        routes:routes
    })

    export default router