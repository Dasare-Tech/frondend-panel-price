export interface DashboardCardDTO {
  title: string;
  value: string | number;
  icon: string;
  growth: number;
  subtext?: string;
  filter?: string;
  filterOptions?: string[];
  additionalInfo?: string;
}

export interface DashboardFilterDTO {
  label: string;
  value: string;
  options: string[];
}

/*export interface DashboardTableRowDTO {
  id: number;
  estado: string;
  cidade: string;
  loja: string;
  produtoInterno: string;
  valorInterno: number;
  concorrente: string;
  produtoExterno: string;
  valorExterno: number;
  diferenca: number;
}*/

export interface DashboardChartDTO {
  labels: string[];
  datasets: { data: number[]; backgroundColor: string[] }[];
}

// DashboardTableRowDTO com index signature para aceitar colunas dinâmicas
export interface DashboardTableRowDTO {
  [key: string]: string | number | boolean | null;
}


export interface DashboardDataDTO {
  cards: DashboardCardDTO[];
  filters: DashboardFilterDTO[];
  table: DashboardTableRowDTO[];
  chartEstadosLojas: DashboardChartDTO;
  chartEstadosPrecos: DashboardChartDTO;
  chartCidadePrecos: DashboardChartDTO;
}
