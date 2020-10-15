const CONTACT_API = {

    /**
     * 产品部分
     * getProductList 产品列表 form-data
     * getProductListById 根据楼宇id获取产品列表
     * saveProductInfo 保存产品信息
     * productPriceList 产品价格列表
     * newProductPrice  新增产品价格
     * delProduct 删除产品
     * delProductPrice 删除产品价格
     */


    getProductList: {
        method: 'post',
        url: '/HandlerProductList.ashx'
    },

    getProductListById: {
        method: 'post',
        url: '/HandlerGetProductInfo.ashx'
    },



    // 注意：该接口用于产品的编辑页面
    productDetailsInfo: {
        method: 'post',
        url: '/HandlerProductList.ashx'
    },


    saveProductInfo: {
        method: 'post',
        url: '/HandlerProduct.ashx'
    },

    productPriceList: {
        method: 'post',
        url: '/HandlerProductPriceList.ashx'
    },


    newProductPrice: {
        method: 'post',
        url: '/HandlerProductPrice.ashx'
    },

    delProduct: {
        method: 'post',
        url: '/HandlerProduct.ashx'
    },

    delProductPrice: {
        method: 'post',
        url: '/HandlerProductPriceList.ashx'
    },
    productPriceDetails: {
        method: 'post',
        url: '/HandlerProductPriceList.ashx'

    },



    /**
     * 产品/楼宇部分下拉部分
     * newOrderType 产品/楼宇信息业务分类、新装宽带业务分类
     * maintainOrderType 维护宽带业务分类
     */

    newOrderType: {
        method: 'post',
        url: '/HandlerOrderType.ashx'
    },

    maintainOrderType: {
        method: 'post',
        url: '/HandlerOrderType.ashx'
    },


    /**
     * 楼宇部分
     * buildingList 获取楼宇信息
     * saveBuildingInfo 新增/编辑楼宇信息
     * buildingDetails 楼宇详情
     * delBuilding 删除楼宇信息
     * newBuildingPrice 新增楼宇价格
     * delBuildingPrice 删除楼宇价格
     * buildingPriceList // 获取楼宇价格列表
     * bindProduct 绑定产品
     */

    buildingList: {
        method: 'post',
        url: '/HandlerProjectList.ashx'
    },


    saveBuildingInfo: {
        method: 'post',
        url: '/HandlerProject.ashx'
    },

    buildingDetails: {
        method: 'post',
        url: '/HandlerProjectList.ashx'
    },

    delBuilding: {
        method: 'post',
        url: '/HandlerProject.ashx'
    },

    newBuildingPrice: {
        method: 'post',
        url: '/HandlerProjectPrice.ashx'
    },
    delBuildingPrice: {
        method: 'post',
        url: '/HandlerProjectPriceList.ashx'
    },

    buildingPriceList: {
        method: 'post',
        url: '/HandlerProjectPriceList.ashx'
    },


    bindProduct: {
        method: 'post',
        url: '/HandlerProjectProduct.ashx'
    },
    // 楼宇价格详情
    buildingPriceDetails: {
        method: 'post',
        url: '/HandlerProjectPriceList.ashx'
    },

    // 编辑保存楼宇价格
    saveBuildingPrice: {
        method: 'post',
        url: '/HandlerProjectPrice.ashx'
    },



    // 小区列表 form-data
    getAddressList: {
        method: 'post',
        url: '/HandlerGetProjectInfo.ashx'
    },








    /**
     * 服务费部分
     * serviceFee 新增/编辑服务费
     * serviceFeeByType 根据业务分类获取产品服务费
     * newServiceFee 新增服务费
     * delServiceFee 删除服务费
     */


    serviceFee: {
        method: 'post',
        url: '/HandlerServiceFee.ashx'
    },

    serviceFeeByType: {
        method: 'post',
        url: '/HandlerServiceFeeList.ashx'
    },
    serviceFeeDetails: {
        method: 'post',
        url: '/HandlerServiceFeeList.ashx'
    },
    delServiceFee: {
        method: 'post',
        url: '/HandlerServiceFee.ashx'
    },
    newServiceFee: {
        method: 'post',
        url: '/HandlerServiceFee.ashx'
    },




    /**
     * 促销管理与折扣部分
     * newDiscountInfo 新增编辑折扣管理
     */

    newDiscountInfo: {
        method: 'post',
        url: '/HandlerProductOff.ashx'
    },


    /**
     * 积分部分
     * newRules 新增编辑积分规则
     * integralDetails 积分详情
     * integralChange 积分变更
     * ruleList 积分列表
     * delRule 删除积分规则
     * ruleDetails 规则详情
     */

    newRules: {
        method: 'post',
        url: '/HandlerPointsRules.ashx'
    },
    integralDetails: {
        method: 'post',
        url: '/HandlerPointsList.ashx'
    },
    integralChange: {
        method: 'post',
        url: '/HandlerPoints.ashx'
    },
    ruleList: {
        method: 'post',
        url: '/HandlerPointsRulesList.ashx'
    },
    ruleDetails: {
        method: 'post',
        url: '/HandlerPointsRulesList.ashx'
    },

    delRule: {
        method: 'post',
        url: '/HandlerPointsRulesList.ashx'
    },

    // 兑换详情
    exchangeDetails: {
        method: 'post',
        url: '/HandlerExchangeList.ashx'
    },

    // 兑换列表
    exchangeList: {
        method: 'post',
        url: '/HandlerExchangeList.ashx'
    },

    // 新增兑换
    newExchange: {
        method: 'post',
        url: '/HandlerExchange.ashx'
    },
    // 删除兑换
    delExchange: {
        method: 'post',
        url: '/HandlerExchange.ashx'
    },

    // 用户兑换记录
    exchangeRecordList: {
        method: 'post',
        url: '/HandlerExchangeList.ashx'
    },

    // 标记兑换记录是否完成（是否发货）
    flagStatus: {
        method: 'post',
        url: '/HandlerExchangeList.ashx'
    },



    // 获取saleTypeId
    saleTypeId: {
        method: 'post',
        url: '/HandlerUserMan.ashx'
    },
    // 通过客户分类获取规则名称
    rulesname: {
        method: 'post',
        url: '/HandlerPointsList.ashx'
    },




    /**
     * 客户部分
     * distributorsList 分销商分类(积分规则下拉选择)
     * newDistributor 新增/编辑分销商分类
     * delDistributor 删除分销商分类
     * distributorsTable 分销商清单
     * newDistributorInfo 新增/编辑分销商
     * delDistributorInfo 删除分销商
     * addUserInDistributor 获取分销商添加用户信息
     * addDistributorMember 新增分销商成员
     * delDistributorMember 删除分销商成员
     */


    distributorsList: {
        method: 'post',
        url: '/HandlerGetSalesInfo.ashx'
    },

    newDistributor: {
        method: 'post',
        url: '/HandlerSalesType.ashx'
    },


    delDistributor: {
        method: 'post',
        url: '/HandlerSalesType.ashx'
    },


    distributorsTable: {
        method: 'post',
        url: '/HandlerGetSalesInfo.ashx'
    },


    newDistributorInfo: {
        method: 'post',
        url: '/HandlerSales.ashx'
    },


    delDistributorInfo: {
        method: 'post',
        url: '/HandlerSales.ashx'
    },


    addUserInDistributor: {
        method: 'post',
        url: '/HandlerUserMan.ashx'
    },


    addDistributorMember: {
        method: 'post',
        url: '/HandlerSalesWechat.ashx'
    },

    delDistributorMember: {
        method: 'post',
        url: '/HandlerSalesWechat.ashx'
    },


    /**
     * 优惠券部分
     * couponList 未使用优惠券信息
     * newCoupon 新增/编辑优惠券
     * couponDetails 优惠券详情
     * couponCode 获取优惠券code
     */

    couponList: {
        method: 'post',
        url: '/HandlerCouponList.ashx'
    },

    newCoupon: {
        method: 'post',
        url: '/HandlerCoupon.ashx'
    },

    couponDetails: {
        method: 'post',
        url: '/HandlerCouponList.ashx'
    },
    couponCode: {
        method: 'post',
        url: '/HandlerCoupon.ashx'
    },

    /**
     * 订单部分
     * orderList 订单列表
     * writeCommencementDate 填写订单开始日期
     * otherOrderDetails 其他订单详情
     */


    orderList: {
        method: 'post',
        url: '/HandlerOrderList.ashx'
    },

    writeCommencementDate: {
        method: 'post',
        url: '/HandlerOrder.ashx'
    },
    otherOrder: {
        method: 'post',
        url: '/HandlerOrder2List.ashx'
    },
    otherOrderDetails: {
        method: 'post',
        url: '/HandlerOrder2List.ashx'
    },
    // 订单协议
    orderAgreement: {
        method: 'post',
        url: '/HandlerGetAgreement.ashx'
    },
    // 保存订单协议
    saveOrderAgreement: {
        method: 'post',
        url: '/HandlerOrder.ashx'
    },


    // 修改订单状态(非修改为使用中)
    changeOrderStatus: {
        method: 'post',
        url: '/HandlerOrder.ashx'
    },

    // 票据类型
    billType: {
        method: 'post',
        url: '/HandlerOrderType.ashx'
    },

    // 运营商
    operator: {
        method: 'post',
        url: '/HandlerOrderType.ashx'
    },


    // 合同参数
    contractUgr: {
        method: 'post',
        url: '/HandlerOrderType.ashx'
    },

    // 邮箱发送合同
    downloadContract: {
        method: 'post',
        url: '/HandlerDownLoadContract.ashx'
    },
    
    // 下载合同pdf
    downloadPdf: {
        method: 'post',
        url: '/HandlerGetPdfByWord.ashx'
    },
    isBindContract: {
        method: 'post',
        url: '/HandlerContractList.ashx'
    },
    /**
     * 提交订单部分
     * productInfo 套餐信息
     * customText 自定义文本字段（初次提交订单相关）
     * orderServiceFee 业务服务费
     * submitOrder  提交订单
     * orderDetails 订单详情 form-data
     * customProp  自定义字段(图片相关)
     * uploadPhoto  上传图片
     * updateOrderImg 未订单添加图片
     */

    productInfo: {
        method: 'post',
        url: '/HandlerGetProductInfo.ashx'
    },

    // 新增订单中根据楼宇与产品id获取的详情
    productDetails: {
        method: 'post',
        url: '/HandlerGetProductInfo.ashx'
    },
    // 点击产品的详情按钮，查看产品详细信息
    viewProductDetails: {
        method: 'post',
        url: '/HandlerProductList.ashx'
    },

    customText: {
        method: 'post',
        url: '/HandlerGetCustomPropText.ashx'
    },

    orderServiceFee: {
        method: 'post',
        url: '/HandlerGetServiceFee.ashx'
    },

    submitOrder: {
        method: 'post',
        url: '/HandlerOrder.ashx'
    },


    orderDetails: {
        method: 'post',
        url: '/HandlerOrderList.ashx'
    },


    customProp: {
        method: 'post',
        url: '/HandlerGetCustomProp.ashx'
    },


    uploadPhoto: {
        method: 'post',
        url: '/HandlerUploadPic.ashx'
    },

    updateOrderImg: {
        method: 'post',
        url: '/HandlerOrder.ashx'
    },

    /**
     * 客户管理部分
     */

    customerList: {
        method: 'post',
        url: '/HandlerUserMan.ashx'
    },
    customerType: {
        method: 'post',
        url: '/HandlerUserMan.ashx'
    },

    settingClassification: {
        method: 'post',
        url: '/HandlerUser.ashx'
    },


    /**
     * 积分部分
     */
    integralList: {
        method: 'post',
        url: '/HandlerPointsList.ashx'
    },


    /**
     * 促销活动部分
     */
    newSalesPromotion: {
        method: 'post',
        url: '/HandlerPromotion.ashx'
    },
    salesPromotionList: {
        method: 'post',
        url: '/HandlerPromotionList.ashx'
    },
    salesPromotionDetails: {
        method: 'post',
        url: '/HandlerPromotionList.ashx'
    },


    /**
     * 权限管理部分
     * roleList 权限列表
     * addRole 添加权限
     * roleDetails 权限详情
     */


    roleList: {
        method: 'post',
        url: '/HandlerRoleList.ashx'
    },

    addRole: {
        method: 'post',
        url: '/HandlerRole.ashx'
    },
    roleDetails: {
        method: 'post',
        url: '/HandlerRoleList.ashx'
    },
    delRole: {
        method: 'post',
        url: '/HandlerRole.ashx'
    },

    /**
     * 用户管理部分
     * userList 用户列表
     * userDetails 用户权限详情
     * newUser 新增编辑用户权限
     */

    userList: {
        method: 'post',
        url: '/HandlerMemberShipList.ashx'
    },
    userDetails: {
        method: 'post',
        url: '/HandlerMemberShipList.ashx'
    },
    newUser: {
        method: 'post',
        url: '/HandlerMemberShip.ashx'
    },
    changeUserStatus: {
        method: 'post',
        url: '/HandlerMemberShipList.ashx'
    },
    // 删除用户
    delUser: {
        method: 'post',
        url: '/HandlerMemberShipList.ashx'
    },

    /**
     * 协议合同部分
     * agreementList 协议列表
     * newAgreement 新增编辑协议
     * delAgreement 删除协议
     * agreementDetails 协议详情
     */
    agreementList: {
        method: 'post',
        url: '/HandlerAgreementList.ashx'
    },
    newAgreement: {
        method: 'post',
        url: '/HandlerAgreement.ashx'
    },
    delAgreement: {
        method: 'post',
        url: '/HandlerAgreement.ashx'
    },
    agreementDetails: {
        method: 'post',
        url: '/HandlerAgreementList.ashx'
    },


    /**
     * 合同部分
     * contractList 合同列表
     * newContract 新增合同
     * delContract 删除合同
     * contractDetails 合同详情
     */

    contractList: {
        method: 'post',
        url: '/HandlerContractList.ashx'
    },
    newContract: {
        method: 'post',
        url: '/HandlerContract.ashx'
    },

    delContract: {
        method: 'post',
        url: '/HandlerContract.ashx'
    },

    contractDetails: {
        method: 'post',
        url: '/HandlerContractList.ashx'
    },

    /**
     * 自定义字段
     * newCustomField 新增编辑自定义字段
     * customFieldDetails 自定义字段详情
     * allOrderType 字段类型列表
     */

    newCustomField: {
        method: 'post',
        url: '/HandlerCustomProp.ashx'
    },
    customFieldDetails: {
        method: 'post',
        url: '/HandlerCustomPropList.ashx'
    },
    allOrderType: {
        method: 'post',
        url: '/HandlerOrderType.ashx'
    },


    /**
     * 评论部分
     */
    // 评论列表
    commentList: {
        method: 'post',
        url: '/HandlerCommentList.ashx'
    },

    // 删除评论
    delComment: {
        method: 'post',
        url: '/HandlerCommentList.ashx'
    },

    // 评论详情
    commentDetails: {
        method: 'post',
        url: '/HandlerCommentList.ashx'
    },

    // 运营商
    operator: {
        method: 'post',
        url: '/HandlerOrderType.ashx'
    },

    // 登录
    loginAccount: {
        method: 'post',
        url: '/HandlerLogin.ashx'
    },

    // 左侧菜单列表
    leftMenu: {
        method: 'post',
        url: '/HandlerTreeMenuList.ashx'
    },

    // 修改密码（针对当前登录用户） 重置密码(参数空字符串)
    changePassword: {
        method: 'post',
        url: '/HandlerMemberShipList.ashx'
    },

    // 续费

    // 续费订单状态改变
XFChangeOrderStatus: {
        method: 'post',
        url: '/HandlerOrderMaintain.ashx'
    },


    // 续费订单修改为使用中
    XFwriteCommencementDate:{
        method: 'post',
        url: '/HandlerOrderMaintain.ashx' 
    },

    apiChangeReferrer:{
        method: 'post',
        url: '/HandlerUserMan.ashx' 
    }





}
export default CONTACT_API