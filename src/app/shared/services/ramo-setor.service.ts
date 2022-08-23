import { MensagemConfirmService } from './mensagem-confirm.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CrudService } from './../crud-service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { map, tap } from 'rxjs/operators';
import { ShorthandPropertyAssignment } from 'typescript';
import { RamoSetor } from '../models/ramo-setor';

@Injectable({
  providedIn: 'root',
})
export class RamoSetorService extends CrudService<RamoSetor> {
  constructor(
    protected http: HttpClient,
    protected mensagem: MensagemConfirmService
  ) {
    super(http, `${environment.API}ramoSetor`, mensagem);
  }

  unicidade(param: string, id: number | null) {
    let params = new HttpParams();
    params = param
      ? params.set('nmRamoSetor', param)
      : params.set('nmRamoSetor', '');
    return this.http
      .get<RamoSetor[]>(`${environment.API}ramoSetor/unicidade`, {
        params,
      })
      .pipe(
        tap(console.log),
        map((dados: { nmRamoSetor: string; id: number }[]) =>
          dados.filter((v) => v.id != id && v.nmRamoSetor == param)
        ),
        tap(console.log),
        map((dados: any[]) => dados.length > 0),
        tap(console.log)
      );
  }
}
