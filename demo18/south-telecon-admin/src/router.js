import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [{
            path: '/',
            redirect: {
                name: 'login'
            },
            component: () =>
                import ('../src/views/login.vue')
        },
        // 登陆
        {
            path: '/login',
            name: 'login',
            meta: {
                title: '市南电信后台管理系统'
            },
            component: () =>
                import ('../src/views/login.vue')
        },
        // 产品信息列表
        {
            path: '/productList',
            name: 'productList',
            meta: {
                title: '产品信息管理'
            },
            component: () =>
                import ('../src/views/productList.vue')
        },
        // 产品信息修改
        {
            path: '/modifyProductInfo',
            name: 'modifyProductInfo',
            meta: {
                title: '产品信息管理'
            },
            component: () =>
                import ('../src/views/modifyProductInfo.vue')
        },

        {
            path: '/serviceChargeManagement',
            name: 'serviceChargeManagement',
            meta: {
                title: '服务费管理'
            },
            component: () =>
                import ('../src/views/serviceChargeManagement.vue')
        },
        // 产品价格
        {
            path: '/productPrice',
            name: 'productPrice',
            meta: {
                title: '产品价格'
            },
            component: () =>
                import ('../src/views/productPrice.vue')
        },
        // 楼宇管理
        {
            path: '/buildingInformation',
            name: 'buildingInformation',
            meta: {
                title: '楼宇信息管理'
            },
            component: () =>
                import ('../src/views/buildingInformation.vue')
        },
        // 楼宇信息
        {
            path: '/buildingInfo',
            name: 'buildingInfo',
            meta: {
                title: '楼宇信息'
            },
            component: () =>
                import ('../src/views/buildingInfo.vue')
        },
        // 楼宇价格
        {
            path: '/buildingPrice',
            name: 'buildingPrice',
            meta: {
                title: '楼宇价格'
            },
            component: () =>
                import ('../src/views/buildingPrice.vue')
        },

        // 编辑楼宇价格
        {
            path: '/editBuildingPrice',
            name: 'editBuildingPrice',
            meta: {
                title: '楼宇价格'
            },
            component: () =>
                import ('../src/views/editBuildingPrice.vue')
        },

        // 服务费列表
        {
            path: '/serviceChargeList',
            name: 'serviceChargeList',
            meta: {
                title: '服务费列表'
            },
            component: () =>
                import ('../src/views/serviceChargeList.vue')
        },

        // 优惠券列表
        {
            path: '/couponsList',
            name: 'couponsList',
            meta: {
                title: '优惠券管理'
            },
            component: () =>
                import ('../src/views/couponsList.vue')
        },
        // 新增优惠券
        {
            path: '/addCoupon',
            name: 'addCoupon',
            meta: {
                title: '优惠券'
            },
            component: () =>
                import ('../src/views/addCoupon.vue')
        },
        // 折扣管理
        {
            path: '/discountManagement',
            name: 'discountManagement',
            meta: {
                title: '折扣管理'
            },
            component: () =>
                import ('../src/views/discountManagement.vue')
        },
        // 订单列表
        {
            path: '/orderList',
            name: 'orderList',
            meta: {
                title: '订单状态管理'
            },
            component: () =>
                import ('../src/views/orderList.vue')
        },

        // 其他类型订单
        {
            path: '/otherOrder',
            name: 'otherOrder',
            meta: {
                title: '其他订单'
            },
            component: () =>
                import ('../src/views/otherOrder.vue')
        },

        // 新订单
        {
            path: '/newOrders',
            name: 'newOrders',
            meta: {
                title: '新增订单'
            },
            component: () =>
                import ('../src/views/newOrders.vue')
        },
        {
            path: '/addOrder',
            name: 'addOrder',
            meta: {
                title: '新增订单-业务与产品选择'
            },
            component: () =>
                import ('../src/views/addOrder.vue')
        },
        {
            path: '/applicantInformation',
            name: 'applicantInformation',
            meta: {
                title: '新增订单-业务与产品选择 / 申请人信息'
            },
            component: () =>
                import ('../src/views/applicantInformation.vue')
        },
        {
            path: '/companyInformation',
            name: 'companyInformation',
            meta: {
                title: '新增订单-业务与产品选择 / 公司信息'
            },
            component: () =>
                import ('../src/views/companyInformation.vue')
        },

        {
            path: '/pictureUpload',
            name: 'pictureUpload',
            meta: {
                title: '新增订单-业务与产品选择 / 证件照'
            },
            component: () =>
                import ('../src/views/pictureUpload.vue')
        },

        // 促销或者活动

        {
            path: '/salesOrActivity',
            name: 'salesOrActivity',
            meta: {
                title: '促销/活动信息管理'
            },
            component: () =>
                import ('../src/views/salesOrActivity.vue')
        },
        // 新增促销活动
        {
            path: '/addSalesOrActivity',
            name: 'addSalesOrActivity',
            meta: {
                title: '新增促销 / 活动'
            },
            component: () =>
                import ('../src/views/addSalesOrActivity.vue')
        },

        // 评论列表
        {
            path: '/commentList',
            name: 'commentList',
            meta: {
                title: '评分列表'
            },
            component: () =>
                import ('../src/views/commentList.vue')
        },

        {
            path: '/commentDetails/:productId',
            name: 'commentDetails',
            meta: {
                title: '评论列表'
            },
            component: () =>
                import ('../src/views/commentDetails.vue')
        },
        // 客户列表
        {
            path: '/customerList',
            name: 'customerList',
            meta: {
                title: '客户列表'
            },
            component: () =>
                import ('../src/views/customerList.vue')
        },
        // 积分列表
        {
            path: '/integralList',
            name: 'integralList',
            meta: {
                title: '积分列表'
            },
            component: () =>
                import ('../src/views/integralList.vue')
        },
        // 积分规则列表
        {
            path: '/ruleList',
            name: 'ruleList',
            meta: {
                title: '规则列表'
            },
            component: () =>
                import ('../src/views/ruleList.vue')
        },

        // 积分详情
        {
            path: '/integralDetails',
            name: 'integralDetails',
            meta: {
                title: '积分详情'
            },
            component: () =>
                import ('../src/views/integralDetails.vue')
        },
        // 积分历史
        {
            path: '/integralHistory/:openID',
            name: 'integralHistory',
            meta: {
                title: '积分明细'
            },
            component: () =>
                import ('../src/views/integralHistory.vue')
        },

        {
            path: '/intergralRules',
            name: 'intergralRules',
            meta: {
                title: '积分规则'
            },
            component: () =>
                import ('../src/views/intergralRules.vue')
        },
        // 客户分类
        {
            path: '/distributorClassification',
            name: 'distributorClassification',
            meta: {
                title: '客户分类'
            },
            component: () =>
                import ('../src/views/distributorClassification.vue')
        },
        // 分销商清单
        {
            path: '/distributorList',
            name: 'distributorList',
            meta: {
                title: '分销商清单'
            },
            component: () =>
                import ('../src/views/distributorList.vue')
        },


        // 自定义字段
        {
            path: '/customOrder',
            name: 'customOrder',
            meta: {
                title: '自定义字段'
            },
            component: () =>
                import ('../src/views/customOrder.vue')
        },
        // 订单报表
        {
            path: '/orderReport',
            name: 'orderReport',
            meta: {
                title: '订单报表'
            },
            component: () =>
                import ('../src/views/orderReport.vue')
        },

        // 权限管理
        {
            path: '/rightsManagement',
            name: 'rightsManagement',
            meta: {
                title: '权限管理'
            },
            component: () =>
                import ('../src/views/rightsManagement.vue')
        },


        // 协议列表
        {
            path: '/protocolList',
            name: 'protocolList',
            meta: {
                title: '协议管理'
            },
            component: () =>
                import ('../src/views/protocolList.vue')
        },
        // 合同列表
        {
            path: '/contractList',
            name: 'contractList',
            meta: {
                title: '合同管理'
            },
            component: () =>
                import ('../src/views/contractList.vue')
        },
        // 用户管理
        {
            path: '/userList',
            name: 'userList',
            meta: {
                title: '用户管理'
            },
            component: () =>
                import ('../src/views/userList.vue')
        },
        // 协议绑定
        {
            path: '/agreement',
            name: 'agreement',
            meta: {
                title: '协议绑定'
            },
            component: () =>
                import ('../src/views/agreement.vue')
        },

        {
            path: '/IntegralExchangeList',
            name: 'IntegralExchangeList',
            meta: {
                title: '兑换商城'
            },
            component: () =>
                import ('../src/views/IntegralExchangeList.vue')
        },

        {
            path: '/addExchange',
            name: 'addExchange',
            meta: {
                title: '积分兑换'
            },
            component: () =>
                import ('../src/views/addExchange.vue')
        },
        // 兑换记录
        {
            path: '/exchangeRecordList',
            name: 'exchangeRecordList',
            meta: {
                title: '兑换记录'
            },
            component: () =>
                import ('../src/views/exchangeRecordList.vue')
        },


        // 路由重定向
        {
            path: '*',
            redirect: { name: 'login' }
        }
    ]
})