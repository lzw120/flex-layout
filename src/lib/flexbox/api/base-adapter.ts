/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ElementRef, Renderer} from '@angular/core';

import {BaseFxDirective} from './base';
import {ResponsiveActivation} from './../responsive/responsive-activation';
import {MediaQuerySubscriber} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';


/**
 * Adapter to the BaseFxDirective abstract class so it can be used via composition.
 * @see BaseFxDirective
 */
export class BaseFxDirectiveAdapter extends BaseFxDirective {

  get activeKey() {
    let mqa = this._mqActivation;
    let key = mqa ? mqa.activatedInputKey : this._baseKey;
    // SimpleChanges uses 'klazz' instead of 'class' as a key
    return (key === 'class') ? 'klazz' : key;
  }

  get inputMap() {
    return this._inputMap;
  }

  /**
   * @see BaseFxDirective._mqActivation
   */
  get mqActivation(): ResponsiveActivation {
    return this._mqActivation;
  }

  /**
     *
     */
  constructor(protected _baseKey: string,
              protected _mediaMonitor: MediaMonitor,
              protected _elementRef: ElementRef,
              protected _renderer: Renderer ) {
    super(_mediaMonitor, _elementRef, _renderer);
  }


  /**
   * @see BaseFxDirective._queryInput
   */
  queryInput(key) {
    return key ? this._queryInput(key) : undefined;
  }

  /**
   *  Save the property value.
   */
  cacheInput(key?: string, source?: any, cacheRaw = false) {
    if (cacheRaw) {
      this._cacheInputRaw(key, source);
    } else if (Array.isArray(source)) {
      this._cacheInputArray(key, source);
    } else if (typeof source === 'object') {
      this._cacheInputObject(key, source);
    } else if (typeof source === 'string') {
      this._cacheInputString(key, source);
    } else {
      throw new Error('Invalid class value provided. Did you want to cache the raw value?');
    }
  }

  /**
   * @see BaseFxDirective._listenForMediaQueryChanges
   */
  listenForMediaQueryChanges(key: string,
                             defaultValue: any,
                             onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation {
    return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
  }

  // ************************************************************
  // Protected Methods
  // ************************************************************

  /**
   * No implicit transforms of the source.
   * Required when caching values expected later for KeyValueDiffers
   */
  protected _cacheInputRaw(key?: string, source?: any) {
    this._inputMap[key] = source;
  }

  /**
   *  Save the property value for Array values.
   */
  protected _cacheInputArray(key?: string, source?: boolean[]) {
    this._inputMap[key] = source.join(' ');
  }

  /**
   *  Save the property value for key/value pair values.
   */
  protected _cacheInputObject(key?: string, source?: {[key: string]: boolean}) {
    let classes = [];
    for (let prop in source) {
      if (!!source[prop]) {
        classes.push(prop);
      }
    }
    this._inputMap[key] = classes.join(' ');
  }

  /**
   *  Save the property value for string values.
   */
  protected _cacheInputString(key?: string, source?: string) {
    this._inputMap[key] = source;
  }
}
