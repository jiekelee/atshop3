import type{ResponseData,SkuData} from '@/api/product/spu/type'

// export interface ResponseData{
//     code:number,
//     message:string,
//     ok:boolean
// }

// 定义SKU对象的TS类型

// 获取SKU接口返回的数据TS类型
export interface SkuResponseData extends ResponseData{
    data:{
        records:SkuData[],
        total:number,
        size:number,
        current:number,
        orders:[]
        optimizeCountSql:boolean,
        hitCount:boolean,
        countId:null,
        maxLimit:null,
        searchCount:boolean,
        pages:number
    }
}