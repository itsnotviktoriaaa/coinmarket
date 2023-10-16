import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addMarkBeforeNumber'
})
export class AddMarkBeforeNumberPipe implements PipeTransform {

  transform(value: number): string | number {
    return value > 0 ? '+' + value : value;
  }

}
