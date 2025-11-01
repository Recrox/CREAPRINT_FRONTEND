import { Injectable } from '@angular/core';
import * as apiClient from '../api-client';
import { environment } from '../../environments/environment';
import { sharedAxiosInstance } from './http.service';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private client: apiClient.apiClient.ApiClient;

  constructor() {
    this.client = new apiClient.apiClient.ApiClient(environment.apiBaseUrl, sharedAxiosInstance);
  }

  /** Get current user's basket by calling the Basket endpoint directly and returning response.data */
  getBasket(): Observable<any> {
    return from(sharedAxiosInstance.get(environment.apiBaseUrl + '/api/Basket/me').then(r => r.data));
  }

  /** Get current basket total from backend */
  getTotal(): Observable<number> {
    return from(sharedAxiosInstance.get(environment.apiBaseUrl + '/api/Basket/me/total').then(r => r.data));
  }

  addItem(articleId: number, quantity = 1): Observable<void> {
    const req = new apiClient.apiClient.AddItemRequest({ articleId, quantity });
    return from(this.client.itemsPOST(req));
  }

  removeItem(itemId: number): Observable<void> {
    return from(this.client.itemsDELETE(itemId));
  }
}
