import request from 'request-promise-native';

const apiEndpoint = 'https://app.gogriddy.com/api/v1/insights/getnow';

const getData = async (settlement_point: string) => {
  const body = {
    settlement_point
  };
  return (await request({
    uri: apiEndpoint,
    method: 'POST',
    body,
    json: true
  })) as GriddyResponse;
};

interface GriddyItem {
  date: Date;
  hour_num: number;
  price_type: string;
  price_ckwh: number;
  value_score: number;
  mean_price_ckwh: number;
  diff_mean_ckwh: number;
  high_ckwh: number;
  low_ckwh: number;
  std_dev_ckwh: number;
  price_display: number;
  date_local_tz: Date;
}
interface GriddyResponse {
  now: GriddyItem;
  forecast: GriddyItem[];
  seconds_until_refresh: number;
}

export { getData, GriddyResponse };
