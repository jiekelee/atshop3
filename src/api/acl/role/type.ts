import { ResponseData } from "@/api/product/spu/type"

export interface Role {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName?: string,
    remark?: null
}

export type Records = Role[]

export interface RoleResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        pages: number
    }
}
