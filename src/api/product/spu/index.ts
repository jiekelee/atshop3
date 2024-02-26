// SPU管理模块的接口
import request from '@/utils/request'
import type { HasSpuResponseData } from '@/api/product/spu/type'

enum API {
    // 获取已有的SPU的数据{page}/{limit}
    HASSPU_URL = '/admin/product/spu/getspudata/'
}

// 获取某个三级分类下已有的SPU分类数据
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)