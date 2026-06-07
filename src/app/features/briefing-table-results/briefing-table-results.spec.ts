import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { BriefingTableResults } from './briefing-table-results';
import { OpmetResult } from '../../core/models/opmet-result.model';

const mockResult = (stationId: string, reportType = 'METAR'): OpmetResult => ({
  placeId:       `icao:${stationId}`,
  queryType:     reportType,
  receptionTime: '2024-06-04T12:00:00Z',
  reportTime:    '2024-06-04T12:00:00Z',
  reportType,
  stationId,
  text:          `${stationId} raw text`,
  textHTML:      `${stationId} <font color="blue">9999</font>`,
});

describe('BriefingTableResults', () => {
  let component: BriefingTableResults;
  let fixture: ComponentFixture<BriefingTableResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BriefingTableResults],
    }).compileComponents();

    fixture = TestBed.createComponent(BriefingTableResults);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set groups to [] when results is null', () => {
      component.results = null;
      component.ngOnChanges({ results: new SimpleChange(undefined, null, true) });
      expect((component as any).groups).toEqual([]);
    });

    it('should set groups to [] when results is empty array', () => {
      component.results = [];
      component.ngOnChanges({ results: new SimpleChange(undefined, [], true) });
      expect((component as any).groups).toEqual([]);
    });

    it('should create one group per distinct stationId', () => {
      const results = [mockResult('EGLL'), mockResult('LZIB'), mockResult('EGLL', 'SIGMET')];
      component.results = results;
      component.ngOnChanges({ results: new SimpleChange(undefined, results, true) });
      expect((component as any).groups.length).toBe(2);
    });

    it('should group rows under the correct stationId', () => {
      const results = [mockResult('EGLL'), mockResult('EGLL', 'TAF'), mockResult('LZIB')];
      component.results = results;
      component.ngOnChanges({ results: new SimpleChange(undefined, results, true) });

      const egll = (component as any).groups.find((g: any) => g.stationId === 'EGLL');
      expect(egll.rows.length).toBe(2);

      const lzib = (component as any).groups.find((g: any) => g.stationId === 'LZIB');
      expect(lzib.rows.length).toBe(1);
    });

    it('should use stationId as the label of the first column', () => {
      component.results = [mockResult('EGLL')];
      component.ngOnChanges({ results: new SimpleChange(undefined, component.results, true) });

      const group = (component as any).groups[0];
      expect(group.columns[0].label).toBe('EGLL');
    });

    it('should mark textHTML column as html: true', () => {
      component.results = [mockResult('EGLL')];
      component.ngOnChanges({ results: new SimpleChange(undefined, component.results, true) });

      const group = (component as any).groups[0];
      const htmlCol = group.columns.find((c: any) => c.key === 'textHTML');
      expect(htmlCol.html).toBe(true);
    });

    it('should format reportTime using sk-SK locale', () => {
      component.results = [mockResult('EGLL')];
      component.ngOnChanges({ results: new SimpleChange(undefined, component.results, true) });

      const row = (component as any).groups[0].rows[0];
      expect(row['reportTime']).toMatch(/\d{2}\.\s?\d{2}\.\s?\d{4}/);
    });
  });
});
