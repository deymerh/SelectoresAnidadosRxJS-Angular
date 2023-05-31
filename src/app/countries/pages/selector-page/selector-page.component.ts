import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';
@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange(): void {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.controls['country'].setValue('')),
        tap(()=> this.borders = []),
        switchMap((region) => this.countriesService.getCountriesByRegion(region))
      ).subscribe((countries) => {
        this.countriesByRegion = countries;
      })
  }

  onCountryChange(): void {
    this.myForm.get('country')?.valueChanges
      .pipe(
        tap(() => this.myForm.controls['border'].setValue('')),
        filter((value: string) => value.length > 0),
        switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap((country) => this.countriesService.getCountryBorderByCodes(country.borders))
    ).subscribe((countries) => {
        this.borders = countries;
      })
  }

}
