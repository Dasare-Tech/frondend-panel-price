import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { DashboardService } from '../../services/dashboard.service';
import {
  DashboardCardDTO,
  DashboardFilterDTO,
  DashboardTableRowDTO,
  DashboardChartDTO,
  DashboardDataDTO
} from '../../model/dashboard.model';
import { MenuGlobalComponent } from '../../components/menuGlobal/menu-global/menu-global.component';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, MenuGlobalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  filtros: DashboardFilterDTO[] = [];
  estadoLojaData!: DashboardChartDTO;
  estadoPrecoData!: DashboardChartDTO;
  cidadePrecoData!: DashboardChartDTO;

  // 🔹 tabela agora trabalha com objeto genérico vindo do db.json
  tabelaDados: DashboardTableRowDTO[] = [];
  tabelaColunas: string[] = [];

  dashboardCards: DashboardCardDTO[] = [];

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false // 🔹 remove a legenda fixa embaixo
      }
    },
    tooltip: {
      enabled: true, // 🔹 mantém o tooltip ao passar o mouse
      callbacks: {
        label: function(context: any) {
          let label = context.label || '';
          let value = context.raw || 0;
          return `${label}: ${value}`;
        }
      }
    }

  };

  searchTerm: string = '';

  constructor(private dashboardService: DashboardService) {}


  private atualizarDashboard(res: DashboardDataDTO) {
    this.dashboardCards = res.cards;
    this.filtros = res.filters;
    this.tabelaDados = res.table;
    this.estadoLojaData = res.chartEstadosLojas;
    this.estadoPrecoData = res.chartEstadosPrecos;
    this.cidadePrecoData = res.chartCidadePrecos;

     // Atualiza as colunas da tabela dinamicamente

    if (this.tabelaDados.length > 0) {
      this.tabelaColunas = Object.keys(this.tabelaDados[0]);
    }
  }

  ngOnInit() {
    // Carga inicial
    this.dashboardService.getDashboard().subscribe(res => this.atualizarDashboard(res));

    // Atualizações em tempo real
    /*this.dashboardService.getDashboardStream().subscribe({
      next: (res) => this.atualizarDashboard(res),
      error: (err) => console.error('Erro no SSE:', err)
    });*/
  }

  /*loadDashboard() {
    this.dashboardService.getFilters()
      .subscribe(res => this.filtros = res);

    this.dashboardService.getCards()
      .subscribe(res => this.dashboardCards = res);

    this.dashboardService.getTable()
      .subscribe((res: DashboardTableRowDTO[]) => {
        this.tabelaDados = res;

        if (res.length > 0) {
          // 🔹 pega dinamicamente as colunas do primeiro objeto retornado pela API
          this.tabelaColunas = Object.keys(res[0]);
        }
      });

    this.dashboardService.getChartEstadosLojas()
      .subscribe(res => this.estadoLojaData = res);

    this.dashboardService.getChartEstadosPrecos()
      .subscribe(res => this.estadoPrecoData = res);
  }*/

  filteredData() {
    if (!this.searchTerm) return this.tabelaDados;
    const term = this.searchTerm.toLowerCase();

    return this.tabelaDados.filter(row =>
      Object.values(row).some(val =>
        val !== null && val !== undefined &&
        val.toString().toLowerCase().includes(term)
      )
    );
  }

  updateFilter(filter: string, value: string) {
    const filtro = this.filtros.find(f => f.label === filter);
    if (filtro) {
      filtro.value = value;
    }
  }

applyFilter(card: DashboardCardDTO) {
  const filters: any = {};
  this.dashboardCards.forEach(c => {
    if (c.filter) {
      switch (c.title) {
        case "Estados com Lojas":
          filters.estado = c.filter;
          break;
        case "Cidades com Lojas":
          filters.cidade = c.filter;
          break;
        case "Lojas":
          filters.loja = c.filter;
          break;
        case "Produtos Internos":
          filters.produto = c.filter;
          break;
      }
    }
  });

  console.log('Filtros enviados:', filters);

  this.dashboardService.getDashboardWithFilters(filters)
      .subscribe(res => this.atualizarDashboard(res));
}



isMoneyColumn(col: string): boolean {
  if (!col) return false;
  const normalized = col.toLowerCase();
  return (
    normalized.includes('valor interno') ||
    normalized.includes('valor externo') ||
    normalized.includes('diferenca') ||
    normalized.includes('diferença')
  );
}

formatCurrency(value: any, col?: string): string {
  if (value === null || value === undefined || value === '') return '-';

  const num = Number(value);
  if (isNaN(num)) return String(value);

  // 🔹 Configuração padrão de moeda
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

    // 🔹 Se for coluna de diferença, força exibir o sinal
  if (col && col.toLowerCase().includes('diferen')) {
    return (num > 0 ? '+' : '') + formatted;
  }



  return formatted;
}




}
