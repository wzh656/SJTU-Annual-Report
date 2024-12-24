interface Entity {
  orderNo: string;
  orderTime: number;
  payTime: number;
  merchantNo: number;
  merchant: string;
  deviceNo: string;
  amount: number;
  status: string;
  channel: string;
}

export interface ReportData {
  num: number;
  total: number;
  first: Entity;
  max: Entity;
  earliest: Entity;
  merchants: {
    [merchant: string]: {
      num: number;
      total: number;
    };
  };
  categories: {
    breakfast: {
      num: number;
      total: number;
    };
    lunch: {
      num: number;
      total: number;
    };
    dinner: {
      num: number;
      total: number;
    };
  };
  months: {
    [month: number]: {
      num: number;
      total: number;
    };
  };
}
