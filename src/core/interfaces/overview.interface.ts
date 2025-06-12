export interface ISupplierOverview {
  totalRecords: number;
  totalBilling: number;
  totalSubscribers: number;
  totalCustomers: number;
  billingByMonth: IMonthBilling[];
}

export interface IMonthBilling {
  yearMonth: string;
  total: number;
}
