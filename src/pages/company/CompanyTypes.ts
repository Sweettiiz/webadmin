// import { User } from '../users/types'

export type Company = {
  company_id: number
  company_name: string
  company_address: string
  company_email: string
  company_phone: string
  company_create_date: Date
  company_update_date: Date
  company_sub_company_name: string
  status: 'active' | 'inactive'
}

export type EmptyCompany = Omit<
  Company,
  | 'company_id'
  | 'company_name'
  | 'company_address'
  | 'company_email'
  | 'company_phone'
  | 'company_create_date'
  | 'company_update_date'
  | 'company_sub_company_name'
  | 'status'
> & {
  company_name: Company['company_name'] | string
  company_address: Company['company_address'] | string
  company_email: Company['company_email'] | string
  company_phone: Company['company_phone'] | string
  company_create_date: Company['company_create_date'] | undefined
  company_update_date: Company['company_update_date'] | undefined
  company_sub_company_name: Company['company_sub_company_name'] | string
  status: Company['status'] | undefined
}
