import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home';
import { OpmetQueryService } from './services/opmet-query.service';
import { OpmetResult } from '../../core/models/opmet-result.model';
import { BriefingModel } from '../briefing-form/briefing.model';

const mockResult: OpmetResult = {
  placeId:       'icao:EGLL',
  queryType:     'METAR',
  receptionTime: '2024-06-04T12:00:00Z',
  reportTime:    '2024-06-04T12:00:00Z',
  reportType:    'METAR',
  stationId:     'EGLL',
  text:          'EGLL raw',
  textHTML:      'EGLL <font color="blue">9999</font>',
};

const mockBriefing: BriefingModel = {
  messageTypes: [true, false, false],
  airports:     'EGLL',
  countries:    '',
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let opmetService: { query: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    opmetService = { query: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        { provide: OpmetQueryService, useValue: opmetService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showForm signal', () => {
    it('should be false initially', () => {
      expect((component as any).showForm()).toBe(false);
    });

    it('onShowForm should set showForm to true', () => {
      (component as any).onShowForm();
      expect((component as any).showForm()).toBe(true);
    });

    it('onFormClose should set showForm to false', () => {
      (component as any).onShowForm();
      (component as any).onFormClose();
      expect((component as any).showForm()).toBe(false);
    });
  });

  describe('onFormSuccess — happy path', () => {
    beforeEach(() => {
      opmetService.query.mockReturnValue(of([mockResult]));
    });

    it('should set results signal with API response', async () => {
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).results()).toEqual([mockResult]);
    });

    it('should set loading to false after response', async () => {
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).loading()).toBe(false);
    });

    it('should clear error signal on new request', async () => {
      (component as any).error.set('previous error');
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).error()).toBeNull();
    });
  });

  describe('onFormSuccess — clears stale state', () => {
    it('should clear warning signal when new search returns results', async () => {
      opmetService.query.mockReturnValue(of([mockResult]));
      (component as any).warning.set('No results found for the given criteria.');
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).warning()).toBeNull();
    });

    it('should clear error signal when new search starts', async () => {
      opmetService.query.mockReturnValue(of([mockResult]));
      (component as any).error.set('previous error');
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).error()).toBeNull();
    });
  });

  describe('onFormSuccess — empty results', () => {
    beforeEach(() => {
      opmetService.query.mockReturnValue(of([]));
    });

    it('should set warning when API returns empty array', async () => {
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).warning()).toBeTruthy();
    });

    it('should set results to empty array', async () => {
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).results()).toEqual([]);
    });
  });

  describe('onFormSuccess — API error', () => {
    beforeEach(() => {
      opmetService.query.mockReturnValue(throwError(() => new Error('Network error')));
    });

    it('should set error signal on API failure', async () => {
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).error()).toBe('Network error');
    });

    it('should set loading to false after error', async () => {
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      expect((component as any).loading()).toBe(false);
    });
  });

  describe('report type API value mapping', () => {
    it('should pass TAF_LONGTAF when TAF checkbox is selected', async () => {
      opmetService.query.mockReturnValue(of([]));
      const tafBriefing: BriefingModel = { messageTypes: [false, false, true], airports: 'EGLL', countries: '' };
      (component as any).onFormSuccess(tafBriefing);
      await fixture.whenStable();
      const calledWith = opmetService.query.mock.calls[0][1] as string[];
      expect(calledWith).toContain('TAF_LONGTAF');
      expect(calledWith).not.toContain('TAF');
    });

    it('should only pass selected report types', async () => {
      opmetService.query.mockReturnValue(of([]));
      (component as any).onFormSuccess(mockBriefing);
      await fixture.whenStable();
      const calledWith = opmetService.query.mock.calls[0][1] as string[];
      expect(calledWith).toEqual(['METAR']);
    });
  });
});
