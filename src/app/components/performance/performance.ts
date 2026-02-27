import { FinanceService } from '@/services/finance';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarAdmin } from '../navbar-admin/navbar-admin';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import 'chart.js/auto';

@Component({
  selector: 'app-performance',
  imports: [CommonModule, FormsModule, RouterLink, NavbarAdmin, BaseChartDirective],
  templateUrl: './performance.html',
  styleUrl: './performance.css',
})
export class AdminPerformanceComponent implements OnInit {

  moisSelectionne: string = '';
  performanceData: any = null;
  isOpen = false;

  constructor(private financeService: FinanceService) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const monthStr = month < 10 ? '0' + month : String(month);
    this.moisSelectionne = `${today.getFullYear()}-${monthStr}`;
  }

  ngOnInit(): void {
    this.chargerPerformance();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  chargerPerformance() {
    if (!this.moisSelectionne) return;
    this.financeService.GetPerformance(this.moisSelectionne)
      .subscribe((res: any) => {
        this.performanceData = res.data;
        console.log(res.data)
        this.buildChart();
      });
  }

  // ── KPI helpers ──────────────────────────────────────────────
  get totalProfit(): number {
    if (!this.performanceData) return 0;
    return this.performanceData.performances
      .reduce((sum: number, p: any) => sum + p.profit, 0);
  }

  get totalChiffre(): number {
    if (!this.performanceData) return 0;
    return this.performanceData.performances
      .reduce((sum: number, p: any) => sum + p.chiffreAffaire, 0);
  }

  get totalCharges(): number {
    if (!this.performanceData) return 0;
    return this.performanceData.performances
      .reduce((sum: number, p: any) => sum + p.charges, 0);
  }

  get countProfit(): number {
    if (!this.performanceData) return 0;
    return this.performanceData.performances
      .filter((p: any) => p.statut === 'PROFIT').length;
  }

  get countPerte(): number {
    if (!this.performanceData) return 0;
    return this.performanceData.performances
      .filter((p: any) => p.statut === 'PERTE').length;
  }

  get bestBoutique(): any {
    if (!this.performanceData?.performances?.length) return null;
    return [...this.performanceData.performances]
      .sort((a: any, b: any) => b.profit - a.profit)[0];
  }

  get worstBoutique(): any {
    if (!this.performanceData?.performances?.length) return null;
    return [...this.performanceData.performances]
      .sort((a: any, b: any) => a.profit - b.profit)[0];
  }

  get maxAbsProfit(): number {
    if (!this.performanceData) return 1;
    return Math.max(
      ...this.performanceData.performances.map((p: any) => Math.abs(p.profit)),
      1
    );
  }

  getProgressPct(profit: number): number {
    return Math.round((Math.abs(profit) / this.maxAbsProfit) * 100);
  }

  getBarWidth(value: number, max: number): number {
    if (!max || max === 0) return 0;
    return Math.round((value / max) * 100);
  }

  get maxChiffre(): number {
    if (!this.performanceData) return 1;
    return Math.max(
      ...this.performanceData.performances.map((p: any) => p.chiffreAffaire),
      1
    );
  }

  get maxCharges(): number {
    if (!this.performanceData) return 1;
    return Math.max(
      ...this.performanceData.performances.map((p: any) => p.charges),
      1
    );
  }

  // ── Chart ────────────────────────────────────────────────────
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#475569',
          font: { size: 12 },
          usePointStyle: true,
          pointStyleWidth: 10,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E4E8F0',
        borderWidth: 1,
        titleColor: '#0F172A',
        bodyColor: '#475569',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y || 0;
            return `  ${ctx.dataset.label}: ${v.toLocaleString('fr-FR')} Ar`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#F1F5F9' },
        ticks: { color: '#94A3B8', font: { size: 11 }, maxRotation: 15 },
        border: { color: '#E4E8F0' }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#F1F5F9' },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          callback: (v) => Number(v).toLocaleString('fr-FR') + ' Ar'
        },
        border: { color: '#E4E8F0', dash: [4, 4] }
      }
    }
  };

  private buildChart() {
    if (!this.performanceData) return;
    const perfs = this.performanceData.performances;
    this.barChartData = {
      labels: perfs.map((p: any) => p.boutique),
      datasets: [
        {
          label: "Chiffre d'Affaire",
          data: perfs.map((p: any) => p.chiffreAffaire),
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          borderColor: '#6366F1',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Charges',
          data: perfs.map((p: any) => p.charges),
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          borderColor: '#EF4444',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Profit Net',
          data: perfs.map((p: any) => p.profit),
          backgroundColor: perfs.map((p: any) =>
            p.profit >= 0 ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.12)'
          ),
          borderColor: perfs.map((p: any) =>
            p.profit >= 0 ? '#059669' : '#DC2626'
          ),
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    };
  }
}
