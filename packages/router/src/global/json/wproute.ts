import { Template } from '../index'

export interface WPRoute {
    args?: {
        postType?: string,
        id?: number,
        slug?: string,
        taxonomy?: string,
        nicename?: string
        archiveType: any
    },
    type : Template
    query : {
        is_archive?: boolean,
        is_single?: boolean,
        is_page?: boolean,
        is_home?: boolean,
        is_404: boolean,
        is_search?: boolean
    }
}