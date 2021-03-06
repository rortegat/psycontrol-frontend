import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from '../session.service';

@Pipe({
    name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

    constructor(
        private http: HttpClient,
        private sessionService: SessionService,
    ) { }

    async transform(src: string): Promise<string> {
        const token = this.sessionService.getTokenData().token;
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const imageBlob = await this.http.get(src, { headers, responseType: 'blob' }).toPromise();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(imageBlob);
        });
    }

}