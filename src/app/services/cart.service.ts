import { Injectable } from '@angular/core';
import * as apiClient from '../api-client';
import { environment } from '../../environments/environment';
import { sharedAxiosInstance } from './http.service';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private client: apiClient.apiClient.ApiClient;

  constructor() {
    this.client = new apiClient.apiClient.ApiClient(environment.apiBaseUrl, sharedAxiosInstance);
  }

  /** Get current user's basket. Return type is any because generator produced void in some places. */
  getBasket(): Observable<any> {
    return from(this.client.me() as Promise<any>);
  }

  addItem(articleId: number, quantity = 1): Observable<void> {
    const req = new apiClient.apiClient.AddItemRequest({ articleId, quantity });
    return from(this.client.itemsPOST(req));
  }

  removeItem(itemId: number): Observable<void> {
    return from(this.client.itemsDELETE(itemId));
  }
}
