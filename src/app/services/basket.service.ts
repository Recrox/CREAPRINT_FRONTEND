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

  /**
   * Get current user's basket using the generated ApiClient so we preserve typed DTOs.
   * Returns an Observable of BasketDto (may contain items array).
   */
  getBasket(): Observable<apiClient.apiClient.BasketDto> {
    return from(this.client.me());
  }

  /** Get current basket total from backend (untyped response kept as number/any) */
  getTotal(): Observable<number> {
    // The generated client has a `total` endpoint, but its generated signature may vary.
    // Keep the existing axios call for the total to avoid generator mismatch, but type the result.
    return from(sharedAxiosInstance.get(environment.apiBaseUrl + '/api/Basket/me/total').then(r => r.data as number));
  }

  addItem(articleId: number, quantity = 1): Observable<void> {
    const req = new apiClient.apiClient.AddItemRequest({ articleId, quantity });
    return from(this.client.itemsPOST(req));
  }

  removeItem(itemId: number): Observable<void> {
    return from(this.client.itemsDELETE(itemId));
  }
}
