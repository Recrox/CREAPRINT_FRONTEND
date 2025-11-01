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
    // Some backends expect a plain JSON body with standard application/json content-type.
    // The generated client sends "application/json-patch+json" which can cause server errors.
    const payload = { articleId, quantity } as any;
    return from(sharedAxiosInstance.post(environment.apiBaseUrl + '/api/Basket/me/items', payload).then(() => {}));
  }

  removeItem(itemId: number): Observable<void> {
    return from(this.client.itemsDELETE(itemId));
  }
}
