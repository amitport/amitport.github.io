import { Pipe, PipeTransform } from '@angular/core';
import shortNumber from 'short-number';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return shortNumber(value);
  }
}
