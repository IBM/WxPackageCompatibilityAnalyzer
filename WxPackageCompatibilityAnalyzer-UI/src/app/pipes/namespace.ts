import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'namespace'
})
export class NamespacePipe implements PipeTransform {

    transform(resourceName: string): any {
        if(resourceName !== undefined && resourceName !== null && resourceName !== "" ) {
            let slashIndex: number = resourceName.indexOf("/");
            if(slashIndex > -1) {
                resourceName = resourceName.substring(slashIndex + 1);
            }
        }
        return resourceName;
    }
}