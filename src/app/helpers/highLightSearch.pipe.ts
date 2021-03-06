import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highLightSearch'
})
export class HighLightSearchPipe implements PipeTransform {

  transform(value: string, search: string): string {
    const valueStr = value + ''; // Ensure numeric values are converted to strings
    return valueStr.replace(new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + search + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<strong>$1</strong>');
  }

}