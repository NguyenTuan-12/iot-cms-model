export class BlogCategory {
    _id?: string;
    id?: string;
    code?: string;
    name?: string;
    status?: number;
    note?:string;
    title?:string;
    summary?:string;
    content?:string;
    avatar?:any;
    categoryId?:string;
    author?: string;
    description?:string;
    image?:string;
    productCategoryId?:string;
    money?:number;
    price_is_contact?:boolean;
    price?:number;
    images?: Array<any>;
    serviceCategoryId?:string;
    is_show_booking?:boolean;
    price_is_sale?:boolean;
    price_after_sale?:number;
    dateCreated?: string;
    dateUpdated?: string;
}
