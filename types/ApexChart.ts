export interface ApexOptions {
  chart: {
    id?: string;
    width?: string | number;
    height?: string | number;
    type: string;
    foreColor?: string;
    zoom?: {
      enabled?: boolean;
      autoScaleYaxis?: boolean;
    };
    toolbar?: {
      show: boolean;
    };
    background?: string;
  };
  dataLabels?: {
    enabled?: boolean;
  };
  stroke?: {
    curve?: string;
    width?: number;
  };
  grid?: {
    show?: boolean;
    borderColor?: string;
  };
  plotOptions?: {
    area?: {
      fillTo?: string;
    };
    radialBar?: {
      offsetY?: number;
      startAngle?: number;
      endAngle?: number;
      hollow?: {
        margin: number;
        size: string;
        background: string;
        image: string | undefined;
      };
      track?: {
        show: boolean;
      };
      dataLabels?: {
        showOn?: string;
        name?: {
          show: boolean;
        };
        value?: {
          show: boolean;
        };
      };
    };
    circle?: {
      track?: {
        show: boolean;
      };
      dataLabels: {
        showOn?: string;
        name?: {
          show: boolean;
        };
        value?: {
          show: boolean;
        };
      };
    };
    pie?: {
      size?: undefined;
      donut?: {
        size?: string;
        background?: string;
      };
      customScale?: number;
      offsetX?: number;
      offsetY?: number;
      dataLabels?: {
        offset?: number;
      };
    };
  };
  markers?: {
    size?: number;
    style?: string;
  };
  xaxis?: {
    type?: string;
    min?: number;
    max?: number;
    tickAmount?: number;
    axisBorder?: {
      show?: boolean;
    };
    axisTicks?: {
      show?: boolean;
    };
    labels?: {
      style?: {
        colors?: string;
      };
      categories?: string[];
      formatter?: (value: number) => string;
      datetimeFormatter?: {
        year?: string;
        month?: string;
        day?: string;
        hour?: string;
      };
    };
  };
  yaxis?: {
    labels?: {
      show?: boolean;
      formatter?: (value: number) => string;
    };
    min?: number;
    max?: number;
  };
  tooltip?: {
    enabled?: boolean;
    shared?: boolean;
    intersect?: boolean;
    followCursor?: boolean;
    x: {
      show?: boolean;
      format?: string;
    };
  };
  theme?: {
    mode?: string;
  };
  fill?: {
    type?: string;
    opacity?: number;
    gradient?: {
      shade?: string;
      type?: string;
      shadeIntensity?: number;
      gradientToColors?: string[];
      inverseColors?: boolean;
      opacityFrom?: number;
      opacityTo?: number;
      stops?: number[];
    };
  };
  colors?: string[];
  series?: number[];
  labels?: string[];
  legend?: {
    show?: boolean;
    floating?: boolean;
    fontSize?: string;
    position?: string;
    verticalAlign?: string;
    textAnchor?: string;
    labels?: {
      useSeriesColors: boolean;
    };
    markers?: {
      size: number;
    };
    formatter?: () => string;
    itemMargin?: {
      vertical: number;
    };
    containerMargin?: {
      left: number;
      top: number;
    };
  };
}

export type ApexChartSeries = {
  name?: string;
  data: [number, number][];
};

export type TimeFrame = {
  value: string;
  series: {
    start: number;
    end: number;
  };
};
