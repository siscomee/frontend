import { MensagemConfirmService } from './services/mensagem-confirm.service';
import { delay, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export class CrudService<T> {
  constructor(
    protected http: HttpClient,
    private API_URL: string,
    protected mensagem: MensagemConfirmService
  ) {}

  private END_POINT_LIST: string = '/listarTodos';
  private END_POINT_CREATE: string = '/adicionar';
  private END_POINT_UPDATE: string = '/editar';
  private END_POINT_UPDATE2: string = '/inativar';
  private END_POINT_DELETE: string = '/deletar';

  set listEndPoint(novoEndPoint: string) {
    this.END_POINT_LIST = novoEndPoint;
  }
  set createEndPoint(novoEndPoint: string) {
    this.END_POINT_CREATE = novoEndPoint;
  }
  set updateEndPoint(novoEndPoint: string) {
    this.END_POINT_UPDATE = novoEndPoint;
  }
  set deleteEndPoint(novoEndPoint: string) {
    this.END_POINT_DELETE = novoEndPoint;
  }

  list(params?: any) {
    return this.http
      .get<any[]>(`${this.API_URL}${this.END_POINT_LIST}`, { params })
      .pipe(
        tap(console.log),
        catchError(this.handleError<T>('listagem de dados'))
      );
  }

  private create(record: T): any {
    return this.http
      .post<T>(`${this.API_URL}${this.END_POINT_CREATE}`, record)
      .pipe(
        tap((_) => console.log('criou no servidor')),
        catchError(this.handleError<T>('criação de dados'))
      );
  }

  private update(record: T) {
    return this.http
      .put(`${this.API_URL}${this.END_POINT_UPDATE}`, record, httpOptions)
      .pipe(
        tap((_) => console.log('editou no servidor')),
        catchError(this.handleError<T>('update de dados'))
      );
  }

  save(record: any) {
    if (record.id) {
      return this.update(record);
    }
    return this.create(record);
  }

  remove(record: T): any {
    return this.http
      .put(`${this.API_URL}${this.END_POINT_UPDATE2}`, record, {
        observe: 'response',
      })
      .pipe(
        tap((_) => console.log('editou no servidor')),
        catchError(this.handleError<T>('remoção de dados'))
      );
  }
  private handleError<T>(operation = 'Erro interno na aplicação.', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.mensagem.errorToaster(
        `Erro interno na aplicação. Não foi feito ${operation}.`
      );

      return of(result as T);
    };
  }
}
