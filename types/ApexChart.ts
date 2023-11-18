export interface ApexOptions {
  chart: {
    width?: string | number;
    height?: string | number;
    type: string;
    foreColor?: string;
    zoom?: {
      enabled: boolean;
    };
    toolbar?: {
      show: boolean;
    };
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
  };
  xaxis?: {
    categories?: string[];
    type?: string;
  };
  yaxis?: {
    labels?: {
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
      format?: string;
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
