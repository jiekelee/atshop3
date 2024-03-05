// SKU模块接口管理
import request from '@/utils/request'
import type{SkuResponseData} from '@/api/product/sku/type'
enum API{
    // 获取已有SKU数据
    SKU_URL = '/admin/product/list/'
}
// 获取商品SKU的接口
export const reqSkuList = (page:number,limit:number)=>request.get<any,SkuResponseData>(API.SKU_URL+`${page}/${limit}`)