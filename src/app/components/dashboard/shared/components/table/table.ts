import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() columnWidths: { [key: string]: string } = {};

  getColumnWidth(column: string): string {
    return this.columnWidths[column] || 'auto';
  }

  getCellTemplate(column: string, row: any): any {
    const value = row[column.toLowerCase()] || row[column] || '';
    return value;
  }

}
